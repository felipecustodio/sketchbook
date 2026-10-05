import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { cp, mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const dist = join(root, 'dist');
const site = join(root, 'site');
const kinds = ['p5', 'processing'];

export async function catalog() {
  return JSON.parse(await readFile(join(site, 'catalog.json'), 'utf8'));
}

export async function validate({ previews = false } = {}) {
  const items = await catalog();
  const ids = new Set();
  for (const item of items) {
    if (!/^[a-z][a-z0-9_]*$/.test(item.id) || ids.has(item.id)) throw new Error(`Invalid or duplicate sketch id: ${item.id}`);
    ids.add(item.id);
    if (!kinds.includes(item.kind) || !item.title || !item.description || !Array.isArray(item.tags) || !item.tags.length) throw new Error(`Incomplete catalog entry: ${item.id}`);
    const folder = join(root, 'sketches', item.kind, item.id);
    if (!existsSync(folder)) throw new Error(`Missing sketch folder: ${folder}`);
    const main = item.kind === 'p5' ? (item.entry || 'index.html') : `${item.id}.pde`;
    for (const page of [main, ...(item.alternates || []).map(page => page.path)]) {
      if (resolve(folder, page).startsWith(folder + sep) && existsSync(join(folder, page))) continue;
      throw new Error(`Invalid or missing sketch page: ${item.id}/${page}`);
    }
    if (!existsSync(join(folder, main))) throw new Error(`Missing sketch entry: ${item.id}/${main}`);
    if (previews && !existsSync(join(site, 'previews', `${item.id}.png`))) throw new Error(`Missing preview: ${item.id}`);
  }
  for (const kind of kinds) {
    for (const name of await readdir(join(root, 'sketches', kind), { withFileTypes: true })) {
      if (name.isDirectory() && !ids.has(name.name)) throw new Error(`Unlisted sketch: ${kind}/${name.name}`);
    }
  }
  return items;
}

export async function build() {
  const items = await validate();
  if (dist !== join(root, 'dist') || !dist.startsWith(root + sep)) throw new Error('Unsafe build directory');
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await cp(site, dist, { recursive: true });
  await mkdir(join(dist, 'sketches'), { recursive: true });
  await cp(join(root, 'sketches', 'p5'), join(dist, 'sketches', 'p5'), {
    recursive: true,
    filter: path => !['node_modules', '.vscode', '.ropeproject'].includes(path.split(/[\\/]/).at(-1))
  });
  await mkdir(join(dist, 'vendor'), { recursive: true });
  await cp(join(root, 'node_modules', 'p5', 'lib', 'p5.min.js'), join(dist, 'vendor', 'p5.min.js'));
  console.log(`Built ${items.length} sketches in dist/`);
}

const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.csv': 'text/csv', '.otf': 'font/otf', '.ttf': 'font/ttf', '.woff': 'font/woff' };

export async function startServer(port = 0) {
  const server = createServer(async (request, response) => {
    try {
      let path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (path.startsWith('/sketchbook/')) path = path.slice('/sketchbook'.length);
      if (path === '/sketchbook') path = '/';
      let file = resolve(dist, '.' + path);
      if (file !== dist && !file.startsWith(dist + sep)) { response.writeHead(403).end(); return; }
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      const type = mime[extname(file)] || 'application/octet-stream';
      response.setHeader('Content-Type', /^(text\/|application\/json)/.test(type) ? `${type}; charset=utf-8` : type);
      response.end(await readFile(file));
    } catch { response.writeHead(404).end('Not found'); }
  });
  await new Promise(resolveListen => server.listen(port, resolveListen));
  return server;
}

const command = process.argv[2];
if (command === 'build') await build();
if (command === 'check') {
  const items = await validate({ previews: true });
  await build();
  for (const folder of [dist]) {
    const files = await readdir(folder, { recursive: true, withFileTypes: true });
    for (const entry of files.filter(entry => entry.isFile() && entry.name.endsWith('.html'))) {
      const file = join(entry.parentPath, entry.name);
      const html = await readFile(file, 'utf8');
      for (const [, href] of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
        if (/^(?:[a-z]+:|\/\/|#)/i.test(href)) continue;
        const path = href.split(/[?#]/)[0];
        const target = path.startsWith('/sketchbook/') ? join(dist, path.slice('/sketchbook/'.length)) : resolve(dirname(file), path);
        if (!existsSync(target)) throw new Error(`Broken link in ${file}: ${href}`);
      }
    }
  }
  console.log(`Validated ${items.length} sketches and previews`);
}
if (command === 'dev') {
  await build();
  const server = await startServer(8000);
  console.log(`Gallery: http://localhost:${server.address().port}/sketchbook/`);
}
