import { cp, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { root } from './site.mjs';

const [kind, id] = process.argv.slice(2);
if (!['p5', 'processing'].includes(kind) || !/^[a-z][a-z0-9_]*$/.test(id || '')) {
  console.error('Usage: npm run new -- <p5|processing> <lowercase_sketch_name>');
  process.exit(1);
}
const target = join(root, 'sketches', kind, id);
const catalogPath = join(root, 'site', 'catalog.json');
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
if (catalog.some(item => item.id === id)) throw new Error(`Catalog id already exists: ${id}`);
if (existsSync(target)) throw new Error(`Sketch already exists: ${id}`);
await mkdir(target, { recursive: true });
await cp(join(root, 'templates', kind), target, { recursive: true });
if (kind === 'processing') await rename(join(target, 'processing.pde'), join(target, `${id}.pde`));
catalog.push({ id, title: id.replaceAll('_', ' ').replace(/^./, c => c.toUpperCase()), kind, description: 'A creative coding study.', tags: ['new'], ...(kind === 'p5' ? { captureDelayMs: 900 } : { previewFrame: 1 }) });
await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Created ${kind}/${id}. Update its catalog description and run npm run preview -- ${id}.`);
