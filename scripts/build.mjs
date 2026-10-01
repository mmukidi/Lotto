import {mkdir,copyFile} from 'node:fs/promises';
await mkdir(new URL('../dist/',import.meta.url),{recursive:true});
for(const file of ['index.html','app.js','engine.js','style.css','research.js']) await copyFile(new URL('../'+file,import.meta.url),new URL('../dist/'+file,import.meta.url));
console.log('Static MVP built in dist/');

await mkdir(new URL('../dist/data/',import.meta.url),{recursive:true});
await copyFile(new URL('../data/history.json',import.meta.url),new URL('../dist/data/history.json',import.meta.url));
