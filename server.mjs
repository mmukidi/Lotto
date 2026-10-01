import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files={'/research.js':['research.js','text/javascript; charset=utf-8'],'/data/history.json':['data/history.json','application/json; charset=utf-8'],'/':['index.html','text/html; charset=utf-8'],'/index.html':['index.html','text/html; charset=utf-8'],'/app.js':['app.js','text/javascript; charset=utf-8'],'/engine.js':['engine.js','text/javascript; charset=utf-8'],'/style.css':['style.css','text/css; charset=utf-8']};
const port=Number(process.env.PORT||4173);
http.createServer(async(req,res)=>{
 const file=files[new URL(req.url,'http://localhost').pathname];
 if(!file){res.writeHead(404);res.end('Not found');return;}
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
 try{const data=await readFile(new URL(file[0],import.meta.url));res.writeHead(200,{'Content-Type':file[1],'X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"});res.end(req.method==='HEAD'?undefined:data);}catch{res.writeHead(500);res.end('Unable to load file');}
}).listen(port,process.env.HOST||'127.0.0.1',()=>console.log(`Little Luck diary: http://127.0.0.1:${port}`));
