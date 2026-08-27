import {readdir,readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
const root=resolve(import.meta.dirname,'..');
for(const name of await readdir(join(root,'public/src'))){if(name.endsWith('.js')){const result=spawnSync(process.execPath,['--check',join(root,'public/src',name)],{stdio:'inherit'});if(result.status)process.exit(result.status);}}
const html=await readFile(join(root,'public/index.html'),'utf8');
if(!html.includes('Content-Security-Policy')||!html.includes('lang="da"'))throw Error('Missing security or language metadata');
for(const path of ['assets/icon-192.png','assets/icon-512.png','assets/sisi.webp','assets/misser.webp','vendor/maplibre-gl.js','vendor/maplibre-gl.css','vendor/MAPLIBRE-LICENSE.txt','vendor/LUCIDE-LICENSE.txt'])await readFile(join(root,'public',path));
console.log('Syntax, metadata, assets and licenses checked.');
