'use strict';
const prefix='md-editor:'+self.registration.scope+':';
const version=prefix+'v1';
const shell=['./index.html','./manifest.json','./icon-192.png','./icon-512.png'].map(p=>new URL(p,self.registration.scope).href);
self.addEventListener('install',e=>e.waitUntil(caches.open(version).then(cache=>cache.addAll(shell.map(url=>new Request(url,{cache:'reload'}))))));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(prefix)&&name!==version)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('fetch',e=>{const url=new URL(e.request.url);if(e.request.method!=='GET'||!url.href.startsWith(self.registration.scope))return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(async()=>{const cache=await caches.open(version);return (await cache.match(shell[0]))||Response.error();}));}else if(shell.includes(url.href)){e.respondWith(caches.open(version).then(async cache=>(await cache.match(e.request))||fetch(e.request)));}});
