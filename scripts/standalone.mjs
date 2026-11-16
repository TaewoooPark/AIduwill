// Inline the compiled site and create one shared local URL for each image, font and video.
import { readFileSync,writeFileSync,existsSync } from 'node:fs';
import { resolve,join,dirname,extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'), dist=join(root,'dist');
let html=readFileSync(join(dist,'index.html'),'utf8');
const css=[], media=new Map();
html=html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g,tag=>{const href=tag.match(/href="([^"]+)"/)[1];css.push(readFileSync(join(dist,href.slice(1)),'utf8'));return ''});
const src=html.match(/<script[^>]*type="module"[^>]*src="([^"]+)"[^>]*><\/script>/)[1];
html=html.replace(/<script[^>]*type="module"[^>]*src="[^"]+"[^>]*><\/script>/,'');
const js=readFileSync(join(dist,src.slice(1)),'utf8'), styles=css.join('\n');
const mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4','.woff':'font/woff','.ttf':'font/ttf'};
const pattern=/\/(?:visual|media)\/[a-zA-Z0-9_%.-]+\.(?:png|jpe?g|gif|svg|webp|woff2?|ttf|mp4)/gi;
for(const text of [styles,js,html])for(const [url] of text.matchAll(pattern)){
  if(media.has(url))continue;
  const file=join(dist,url.slice(1));if(!existsSync(file))throw Error('Missing export asset '+url);
  media.set(url,[mime[extname(url).toLowerCase()]||'application/octet-stream',readFileSync(file).toString('base64')]);
}
const safe=value=>JSON.stringify(value).replaceAll('<','\\u003c');
const runtime=`const packages=${safe(Object.fromEntries(media))};
const table=Object.fromEntries(Object.entries(packages).map(([path,[type,data]])=>{
  const bytes=Uint8Array.from(atob(data),ch=>ch.charCodeAt(0));
  return [path,URL.createObjectURL(new Blob([bytes],{type}))];
}));
const mapText=text=>text.replace(${pattern.toString()},key=>table[key]||key);
const style=document.createElement('style');style.textContent=mapText(${safe(styles)});document.head.append(style);
const icon=document.querySelector('link[rel=icon]');if(icon)icon.href=table['/media/favicon.png'];
const app=document.createElement('script');app.type='module';app.textContent=mapText(${safe(js)});document.body.append(app);`;
html=html.replace(/(<link rel="icon" href=")[^"]+/, '$1data:,').replace('</body>',()=>'<script>'+runtime+'</script></body>');
writeFileSync(join(root,'AIduwill.html'),html);console.log('AIduwill.html,',media.size,'embedded assets');
