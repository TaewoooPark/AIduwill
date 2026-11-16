// The archived HTML fragments and reference stylesheet contain absolute public-media URLs.
import {readFile, writeFile, readdir} from 'node:fs/promises';
import {join, relative, extname} from 'node:path';
import {fileURLToPath} from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const base = process.argv[2];
if (!/^\/[a-zA-Z0-9_-]+\/$/.test(base)) throw new Error('Expected a GitHub Pages project path.');
const files = await readdir(dist,{recursive:true,withFileTypes:true});
for (const entry of files) {
  if (!entry.isFile() || !['.css','.js','.html'].includes(extname(entry.name))) continue;
  const file = join(entry.parentPath,entry.name);
  const text = await readFile(file,'utf8');
  const rewritten = text.replace(/(?<![\w./-])\/(visual|media|fonts)\//g,(_,folder)=>base+folder+'/');
  if (rewritten !== text) {
    await writeFile(file,rewritten);
    console.log('Updated asset paths in '+relative(dist,file));
  }
}
