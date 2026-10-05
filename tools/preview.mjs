import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, rename, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { build, catalog, root, startServer } from './site.mjs';

const args = process.argv.slice(2);
const browserOnly = args.includes('--browser-only');
const processingOnly = args.includes('--processing-only');
const verifyOnly = args.includes('--verify-only');
const selectedId = args.find(arg => !arg.startsWith('--'));
const items = (await catalog()).filter(item => !selectedId || item.id === selectedId);
if (!items.length) throw new Error(`Unknown sketch: ${selectedId}`);
const previews = join(root, 'site', 'previews');
await mkdir(previews, { recursive: true });

async function browserPreviews(sketches) {
  if (!process.env.SKETCHBOOK_SITE_URL) await build();
  const server = process.env.SKETCHBOOK_SITE_URL ? null : await startServer();
  const base = process.env.SKETCHBOOK_SITE_URL || `http://127.0.0.1:${server.address().port}/sketchbook/`;
  const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader'] });
  try {
    for (const item of sketches) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      const url = new URL(`sketches/p5/${item.id}/${item.entry || 'index.html'}`, base).href;
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (!response?.ok()) throw new Error(`${item.id}: page returned ${response?.status()}`);
      const canvas = page.locator('canvas').first();
      try { await canvas.waitFor({ state: 'visible', timeout: 20000 }); }
      catch { throw new Error(`${item.id}: canvas did not appear; ${errors.join('; ')}`); }
      if (item.previewClicks) {
        const box = await canvas.boundingBox();
        for (let click = 0; click < item.previewClicks; click++) {
          await canvas.click({ position: { x: box.width * (0.2 + (click % 4) * 0.2), y: box.height * (0.3 + (click % 3) * 0.18) } });
        }
      }
      await page.waitForTimeout(item.captureDelayMs || 900);
      await page.evaluate(() => noLoop());
      if (errors.length) throw new Error(`${item.id}: ${errors.join('; ')}`);
      if (!verifyOnly) {
        const clip = await canvas.boundingBox();
        await page.screenshot({ path: join(previews, `${item.id}.png`), clip, timeout: 60000 });
      }
      if (item.id === 'golden_ratio') {
        await page.keyboard.press('p');
        if (!await page.evaluate(() => toggle_pause)) throw new Error('Golden ratio pause control failed');
        await page.keyboard.press('p');
      }
      if (item.id === 'lissajous_generator') {
        const previous = await page.locator('input[type=range]').first().inputValue();
        await page.keyboard.press('p');
        if (await page.locator('input[type=range]').first().inputValue() === previous) throw new Error('Lissajous preset control failed');
        if (!await page.evaluate(() => audioContext?.state === 'running')) throw new Error('Lissajous audio did not start after input');
      }
      if (item.id === 'conway') {
        await page.keyboard.press('Space');
        if (!await page.evaluate(() => paused)) throw new Error('Conway pause control failed');
        const alive = await page.evaluate(() => grid[0][0]);
        await canvas.click({ position: { x: 6, y: 6 } });
        if (await page.evaluate(() => grid[0][0]) === alive) throw new Error('Conway cell control failed');
      }
      if (item.id === 'names') {
        const previous = await page.evaluate(() => name);
        for (let attempt = 0; attempt < 3; attempt++) {
          await canvas.click();
          if (await page.evaluate(() => name) !== previous) break;
        }
        if (await page.evaluate(() => name) === previous) throw new Error('Names click control failed');
      }
      if (item.id === 'harmonograph_p5' && !await page.evaluate(() => particles.length > 0)) throw new Error('Harmonograph click control failed');
      if (item.id === 'flights') {
        await page.keyboard.press('Enter');
        await page.waitForTimeout(250);
        if (!await page.evaluate(() => running && i > 0)) throw new Error('Flights start control failed');
        await page.evaluate(() => { i = flights.length; });
        await page.waitForTimeout(100);
        if (!await page.evaluate(() => paused)) throw new Error('Flights did not stop at the end of its data');
      }
      for (const slider of await page.locator('input[type=range]').all()) {
        await slider.focus();
        await page.keyboard.press('ArrowRight');
      }
      await page.waitForTimeout(200);
      if (errors.length) throw new Error(`${item.id} interaction: ${errors.join('; ')}`);
      await page.close();
      for (const alternate of item.alternates || []) {
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const response = await page.goto(new URL(`sketches/p5/${item.id}/${alternate.path}`, base).href);
        if (!response?.ok()) throw new Error(`Alternate page failed: ${item.id}/${alternate.path}`);
        if (alternate.canvas) await page.locator('canvas').waitFor({ state: 'visible' });
        if (errors.length) throw new Error(`${item.id} alternate: ${errors.join('; ')}`);
        await page.close();
      }
      console.log(`${verifyOnly ? 'Verified' : 'Captured'} p5/${item.id}`);
    }
    const gallery = await browser.newPage();
    await gallery.goto(base);
    await gallery.locator('.card').first().waitFor();
    const allCount = await gallery.locator('.card').count();
    if (allCount !== (await catalog()).length) throw new Error(`Gallery lists ${allCount} sketches`);
    await gallery.locator('#kind').selectOption('processing');
    if (await gallery.locator('.card').count() !== (await catalog()).filter(item => item.kind === 'processing').length) throw new Error('Processing filter failed');
    await gallery.locator('.card').first().click();
    await gallery.locator('#title').waitFor();
    if (await gallery.locator('#title').textContent() === 'Loading sketch…') throw new Error('Detail page did not load');
    await gallery.goto(base);
    await gallery.locator('.card').first().waitFor();
    await gallery.locator('#search').fill('lissajous');
    if (await gallery.locator('.card').count() !== 1) throw new Error('Search filter failed');
    await gallery.locator('#search').fill('');
    await gallery.locator('button[data-tag="sound"]').click();
    if (await gallery.locator('.card').count() !== (await catalog()).filter(item => item.tags.includes('sound')).length) throw new Error('Tag filter failed');
    for (const item of await catalog()) {
      await gallery.goto(new URL(`sketch.html?id=${item.id}`, base).href);
      await gallery.waitForFunction(title => document.querySelector('#title').textContent === title, item.title);
      await gallery.waitForFunction(() => document.querySelector('#preview img')?.naturalWidth > 0);
      const source = gallery.locator('#actions a', { hasText: 'View source' });
      if (!(await source.getAttribute('href')).endsWith(`/sketches/${item.kind}/${item.id}`)) throw new Error(`Source link failed: ${item.id}`);
      if (item.kind === 'p5' && !await gallery.locator('a.primary-action').count()) throw new Error(`Demo link missing: ${item.id}`);
    }
    await gallery.close();
  } finally {
    await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  }
}

function run(command, commandArgs, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, { ...options, stdio: 'pipe', windowsHide: true });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { output += chunk; });
    child.on('error', reject);
    const timer = setTimeout(() => { child.kill(); reject(new Error(`${command} timed out: ${output.slice(-1000)}`)); }, 180000);
    child.on('close', code => { clearTimeout(timer); code === 0 ? resolve(output) : reject(new Error(`${command} exited ${code}: ${output.slice(-1500)}`)); });
  });
}

async function processingPreviews(sketches) {
  const executable = process.env.PROCESSING_CLI || 'processing';
  for (const item of sketches) {
    const folder = join(root, 'sketches', 'processing', item.id);
    const output = join(previews, `${item.id}.capture.png`);
    await rm(output, { force: true });
    const command = process.platform === 'linux' ? 'xvfb-run' : executable;
    const prefix = process.platform === 'linux' ? ['-a', executable] : [];
    await run(command, [...prefix, 'cli', `--sketch=${folder}`, '--build'], { env: process.env });
    await run(command, [...prefix, 'cli', `--sketch=${folder}`, '--run'], {
      env: { ...process.env, SKETCHBOOK_PREVIEW_OUT: output, SKETCHBOOK_PREVIEW_FRAME: String(item.previewFrame || 1) }
    });
    if (!existsSync(output) || (await stat(output)).size < 1000) throw new Error(`${item.id}: preview was not written`);
    await rename(output, join(previews, `${item.id}.png`));
    console.log(`Captured processing/${item.id}`);
  }
}

if (!processingOnly) await browserPreviews(items.filter(item => item.kind === 'p5'));
if (!browserOnly && !verifyOnly) await processingPreviews(items.filter(item => item.kind === 'processing'));
if (!verifyOnly) await build();
