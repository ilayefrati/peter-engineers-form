if(!self.define){let e,i={};const c=(c,n)=>(c=new URL(c+".js",n).href,i[c]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=i,document.head.appendChild(e)}else e=c,importScripts(c),i()})).then((()=>{let e=i[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(n,d)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(i[a])return;let s={};const r=e=>c(e,a),o={module:{uri:a},exports:s,require:r};i[a]=Promise.all(n.map((e=>o[e]||r(e)))).then((e=>(d(...e),s)))}}define(["./workbox-a7cbd5d9"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"favicon.ico",revision:"c92b85a5b907c70211f4ec25e29a8c4a"},{url:"index.html",revision:"6c7861de82c991519a012cd71d01f584"},{url:"logo192.png",revision:"33dbdd0177549353eeeb785d02c294af"},{url:"logo512.png",revision:"917515db74ea8d1aee6a246cfbcc0b45"},{url:"media/instructions.png",revision:"b9020ec9fad0495aa8c43f29172ed51f"},{url:"media/peter-engineers-icon-192.png",revision:"d0e829e1c0c20e98df6152055ee29cec"},{url:"media/peter-engineers-icon-384.png",revision:"bedc6bc98598814d9d0e0eb33b62deed"},{url:"media/peter-engineers-icon-512.png",revision:"312a1b10e6ed6ddda4e03938754653ce"},{url:"media/peter-engineers-logo.png",revision:"0b8ce5c8c929b4c90f6b0aee3505083e"},{url:"media/upload_images_icon.png",revision:"d4de72b92aa97aaf0dabb9355c2bbc7f"},{url:"service-worker.js",revision:"842bd7ef37112830ee4a13beb40db2ef"},{url:"static/css/main.eb119de5.css",revision:"35d92e831b3597ffe79f10b92f4c8686"},{url:"static/js/453.daa47f1d.chunk.js",revision:"a944086aa0380ed98549487478ba8298"},{url:"static/js/main.d0a16b44.js",revision:"716fd4dd9a359dea544c2b479ade8d6a"},{url:"static/media/upload_images_icon.28147b491023a24414cc.png",revision:"d4de72b92aa97aaf0dabb9355c2bbc7f"},{url:"workbox-a7cbd5d9.js",revision:"6cc6e7b76a5c9846c9a87221086dc6f7"}],{}),e.registerRoute(/\.(?:js|css)$/,new e.StaleWhileRevalidate({cacheName:"static-resources",plugins:[new e.ExpirationPlugin({maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/\/$/,new e.NetworkFirst({cacheName:"homepage-cache",plugins:[new e.ExpirationPlugin({maxAgeSeconds:86400})]}),"GET")}));
//# sourceMappingURL=service-worker.js.map