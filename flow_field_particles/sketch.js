(() => {
  // ---------- UI helpers ----------
  const bindRange = (id, on) => {
    const el = document.getElementById(id);
    const out = el.parentElement.querySelector('output');
    const update = () => { out.textContent = el.value; on(parseFloat(el.value)); };
    el.addEventListener('input', update);
    update();
    return el;
  };
  const bindSelect = (id, on) => {
    const el = document.getElementById(id);
    el.addEventListener('change', () => on(el.value));
    on(el.value);
    return el;
  };

  // ---------- State ----------
  let img = null;           // p5.Image
  let fieldAngles = null;   // Float32Array
  let fieldStrength = null; // Float32Array (0..1)
  let cols = 0, rows = 0, CELL = 4;
  let particles = [];
  let running = true;
  let showVectors = false;
  let showSource = 'off';

  const state = {
    mode: 'edge',
    blur: 1, invert: 0, angleOffset: 0,
    count: 8000, step: 1.2, jitter: 0.08,
    thickness: 1, alpha: 40, fade: 12, blend: 'ADD',
    modType: 'none',
    bg: '#000000'
  };

  // ---------- p5 sketch ----------
  const sketch = (p) => {
    let pg;          // trails layer
    let tiny;        // tiny image preview

    p.preload = () => {};

    p.setup = () => {
      p.createCanvas(1024, 640); // initial; "Fit canvas" will resize to image
      p.pixelDensity(1);
      pg = p.createGraphics(p.width, p.height);
      clearTrails();

      // controls
      setupControls();

      // drag&drop
      const drop = document.getElementById('drop');
      const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, prevent));
      drop.addEventListener('drop', (e) => {
        const f = e.dataTransfer.files[0];
        if (f) loadFile(f);
      });

      // file input
      document.getElementById('file').addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) loadFile(e.target.files[0]);
      });

      document.getElementById('fit').addEventListener('click', () => {
        if (!img) return;
        p.resizeCanvas(img.width, img.height);
        pg = p.createGraphics(p.width, p.height);
        clearTrails();
        buildFlowField();
        respawnParticles();
      });

      document.getElementById('respawn').addEventListener('click', respawnParticles);
      document.getElementById('clear').addEventListener('click', clearTrails);
      const toggleBtn = document.getElementById('toggle');
      toggleBtn.addEventListener('click', () => {
        running = !running;
        toggleBtn.textContent = running ? 'Pause' : 'Resume';
      });
      document.getElementById('save').addEventListener('click', () => p.saveCanvas('flowfield', 'png'));
      document.getElementById('showField').addEventListener('click', () => {
        showVectors = !showVectors;
      });
    };

    p.draw = () => {
      // background layer (source image or solid)
      if (showSource === 'behind' && img) {
        p.image(img, 0, 0, p.width, p.height);
      } else {
        p.background(state.bg);
      }

      // faintly fade trails
      pg.noStroke();
      pg.fill(0, state.fade);
      pg.rect(0, 0, pg.width, pg.height);

      // draw particle trails
      pg.strokeWeight(state.thickness);
      pg.stroke(255, state.alpha);
      pg.blendMode(p[state.blend] || p.ADD);

      if (running && fieldAngles && particles.length) {
        for (let i = 0; i < particles.length; i++) {
          const pt = particles[i];
          pt.follow();
          pt.step();
          pt.wrap();
          pt.draw(pg);
        }
      }

      // composite to screen
      p.image(pg, 0, 0);

      // optional: field vectors preview
      if (showVectors && fieldAngles) {
        const scale = CELL;
        p.push();
        p.stroke(0, 255, 255, 100);
        p.strokeWeight(1);
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const ang = fieldAngles[x + y * cols];
            const cx = x * scale + scale / 2;
            const cy = y * scale + scale / 2;
            const vx = Math.cos(ang) * scale * 0.45;
            const vy = Math.sin(ang) * scale * 0.45;
            p.line(cx - vx, cy - vy, cx + vx, cy + vy);
          }
        }
        p.pop();
      }

      // tiny source preview
      if (showSource === 'tiny' && img) {
        if (!tiny) {
          tiny = img.get();
          tiny.resize(160, 0);
        }
        p.image(tiny, 12, 12);
      }

      // stats
      const s = document.getElementById('stats');
      s.textContent = img
        ? `${p.width}×${p.height} | cells ${cols}×${rows} | particles ${particles.length} | ${state.mode}`
        : 'Load an image to begin';
    };

    // ---------- image & field ----------
    function loadFile(file) {
      const url = URL.createObjectURL(file);
      p.loadImage(url, (im) => {
        img = im;
        img.loadPixels();
        document.getElementById('stats').textContent = `${img.width}×${img.height} image loaded`;
        const fitButton = document.getElementById('fit');
        if (fitButton) fitButton.disabled = false;
        buildFlowField();
        respawnParticles();
        tiny = null;
      }, () => alert('Failed to load image'));
    }

    function buildFlowField() {
      if (!img) return;
      // downscale for field grid
      const small = img.get();
      small.resize(Math.floor(p.width / CELL), Math.floor(p.height / CELL));
      if (state.blur > 0) small.filter(p.BLUR, state.blur);
      small.filter(p.GRAY);
      small.loadPixels();

      cols = small.width;
      rows = small.height;
      fieldAngles = new Float32Array(cols * rows);
      fieldStrength = new Float32Array(cols * rows);

      if (state.mode === 'brightness') {
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const idx = 4 * (x + y * cols);
            const r = small.pixels[idx];
            const g = small.pixels[idx + 1];
            const b = small.pixels[idx + 2];
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            const g01 = (state.invert ? 255 - gray : gray) / 255;
            fieldAngles[x + y * cols] = g01 * p.TWO_PI + state.angleOffset;
            fieldStrength[x + y * cols] = g01; // optional modulation
          }
        }
      } else {
        // Sobel gradients -> tangent direction (add 90°)
        const G = new Float32Array(cols * rows);
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const idx = 4 * (x + y * cols);
            G[x + y * cols] = 0.299 * small.pixels[idx] + 0.587 * small.pixels[idx + 1] + 0.114 * small.pixels[idx + 2];
          }
        }
        const kx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
        const ky = [1, 2, 1, 0, 0, 0, -1, -2, -1];
        let maxMag = 1e-6;

        for (let y = 1; y < rows - 1; y++) {
          for (let x = 1; x < cols - 1; x++) {
            let gx = 0;
            let gy = 0;
            let k = 0;
            for (let j = -1; j <= 1; j++) {
              for (let i = -1; i <= 1; i++, k++) {
                const v = G[(x + i) + (y + j) * cols];
                gx += v * kx[k];
                gy += v * ky[k];
              }
            }
            // tangent along edges (gradient + 90°)
            let ang = Math.atan2(gy, gx) + Math.PI / 2 + state.angleOffset;
            if (state.invert) ang += Math.PI; // flip direction
            fieldAngles[x + y * cols] = ang;
            const mag = Math.hypot(gx, gy);
            fieldStrength[x + y * cols] = mag;
            if (mag > maxMag) maxMag = mag;
          }
        }
        // normalize strength 0..1
        for (let i = 0; i < fieldStrength.length; i++) fieldStrength[i] = Math.min(1, fieldStrength[i] / maxMag);
        // pad borders
        for (let x = 0; x < cols; x++) {
          fieldAngles[x] = fieldAngles[x + cols];
          fieldAngles[x + (rows - 1) * cols] = fieldAngles[x + (rows - 2) * cols];
          fieldStrength[x] = fieldStrength[x + cols];
          fieldStrength[x + (rows - 1) * cols] = fieldStrength[x + (rows - 2) * cols];
        }
        for (let y = 0; y < rows; y++) {
          fieldAngles[y * cols] = fieldAngles[1 + y * cols];
          fieldAngles[(cols - 1) + y * cols] = fieldAngles[(cols - 2) + y * cols];
          fieldStrength[y * cols] = fieldStrength[1 + y * cols];
          fieldStrength[(cols - 1) + y * cols] = fieldStrength[(cols - 2) + y * cols];
        }
      }
    }

    // ---------- particles ----------
    function respawnParticles() {
      const need = state.count | 0;
      const cur = particles.length;
      if (need > cur) {
        for (let i = 0; i < need - cur; i++) particles.push(new Particle());
      } else if (need < cur) {
        particles.length = need;
      }
      for (const particle of particles) particle.randomize();
    }

    function clearTrails() {
      pg.background(state.bg);
      pg.stroke(255, state.alpha);
      pg.strokeWeight(state.thickness);
      pg.blendMode(p[state.blend] || p.ADD);
    }

    class Particle {
      constructor() {
        this.pos = p.createVector(0, 0);
        this.prev = p.createVector(0, 0);
        this.vel = p.createVector(0, 0);
        this.speed = state.step;
        this.randomize();
      }
      randomize() {
        this.pos.set(p.random(p.width), p.random(p.height));
        this.prev.set(this.pos);
        this.speed = state.step * (0.85 + 0.3 * Math.random());
      }
      _index() {
        let cx = Math.floor(this.pos.x / CELL);
        let cy = Math.floor(this.pos.y / CELL);
        cx = p.constrain(cx, 0, cols - 1);
        cy = p.constrain(cy, 0, rows - 1);
        return cx + cy * cols;
      }
      follow() {
        if (!fieldAngles) return;
        const idx = this._index();
        let ang = fieldAngles[idx] || 0;
        const s = fieldStrength ? fieldStrength[idx] : 0;
        let spd = this.speed;

        if (state.modType === 'speed' || state.modType === 'speedAlpha') {
          spd = state.step * (0.6 + 1.2 * s);
        }
        // slight random curvature
        ang += p.random(-state.jitter, state.jitter);

        this.vel.set(Math.cos(ang), Math.sin(ang)).mult(spd);

        if (state.modType === 'alpha' || state.modType === 'speedAlpha') {
          const a = Math.round(p.lerp(8, state.alpha, s));
          pg.stroke(255, a);
        } else {
          pg.stroke(255, state.alpha);
        }
      }
      step() {
        this.prev.set(this.pos);
        this.pos.add(this.vel);
      }
      wrap() {
        let wrapped = false;
        if (this.pos.x < 0) {
          this.pos.x = p.width;
          wrapped = true;
        }
        if (this.pos.x > p.width) {
          this.pos.x = 0;
          wrapped = true;
        }
        if (this.pos.y < 0) {
          this.pos.y = p.height;
          wrapped = true;
        }
        if (this.pos.y > p.height) {
          this.pos.y = 0;
          wrapped = true;
        }
        if (wrapped) this.prev.set(this.pos);
      }
      draw(g) {
        g.line(this.prev.x, this.prev.y, this.pos.x, this.pos.y);
      }
    }

    // ---------- controls wiring ----------
    function setupControls() {
      bindSelect('showSource', (v) => { showSource = v; });

      bindSelect('mode', (v) => { state.mode = v; debounceBuild(); });
      bindRange('cell', (v) => { CELL = v | 0; debounceBuild(); });
      bindRange('blur', (v) => { state.blur = v | 0; debounceBuild(); });
      bindSelect('invert', (v) => { state.invert = +v; debounceBuild(); });
      bindRange('angleOffset', (v) => { state.angleOffset = v; debounceBuildLight(); });

      bindSelect('modType', (v) => { state.modType = v; });

      bindRange('count', (v) => { state.count = v | 0; respawnParticles(); });
      bindRange('step', (v) => { state.step = v; });
      bindRange('jitter', (v) => { state.jitter = v; });
      bindRange('thickness', (v) => { state.thickness = v; pg.strokeWeight(state.thickness); });
      bindRange('alpha', (v) => { state.alpha = v | 0; });
      bindRange('fade', (v) => { state.fade = v | 0; });
      bindSelect('blend', (v) => { state.blend = v; });
      document.getElementById('bg').addEventListener('input', (e) => { state.bg = e.target.value; });

      // Disable Fit until an image is loaded
      document.getElementById('fit').disabled = true;
    }

    let tBuild = 0;
    let tLight = 0;
    const debounceBuild = () => {
      clearTimeout(tBuild);
      tBuild = setTimeout(() => { buildFlowField(); }, 60);
    };
    const debounceBuildLight = () => {
      clearTimeout(tLight);
      tLight = setTimeout(() => {
        if (fieldAngles) {
          // Just nudge angles by offset (no re-Sobel)
          for (let i = 0; i < fieldAngles.length; i++) fieldAngles[i] = fieldAngles[i] + 0;
          // offset is applied during build; run full build:
          buildFlowField();
        }
      }, 60);
    };
  };

  // mount sketch
  new p5(sketch, document.querySelector('.canvasWrap'));
})();
