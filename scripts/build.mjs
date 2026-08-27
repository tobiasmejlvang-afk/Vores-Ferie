import {readdir,mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
import {resolve,relative,join,sep} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve(import.meta.dirname,'..'),source=join(root,'public'),dist=join(root,'dist');
async function files(dir){const all=[];for(const entry of await readdir(dir,{withFileTypes:true})){const path=join(dir,entry.name);if(entry.isSymbolicLink())throw Error('Symlinks are not published');if(entry.isDirectory())all.push(...await files(path));else all.push(path);}return all;}
const list=await files(source),hash=createHash('sha256'),paths=[];
for(const file of list.sort()){const path=relative(source,file);paths.push('./'+path.split(sep).join('/'));hash.update(path);hash.update(await readFile(file));await mkdir(resolve(dist,path,'..'),{recursive:true});await copyFile(file,join(dist,path));}
const revision=hash.digest('hex').slice(0,16),scopePrefix='vores-ferie-';
await writeFile(join(dist,'sw.js'),`// Generated from the exact static assets in this build. No user data is cached here.
const PREFIX=${JSON.stringify(scopePrefix)}+new URL(self.registration.scope).pathname+'-';
const CACHE=PREFIX+${JSON.stringify(revision)};
const ASSETS=${JSON.stringify(paths)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>response.ok?response:caches.match(new URL('./index.html',self.registration.scope))).catch(()=>caches.match(new URL('./index.html',self.registration.scope))));
  }else if(ASSETS.some(path=>new URL(path,self.registration.scope).href===url.href)){
    event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
  }
});
`);
await writeFile(join(dist,'.nojekyll'),'');
console.log(`Built ${paths.length+2} files → dist (${revision})`);
