const key='little-luck-diary-v1';
const message=document.getElementById('message');
document.getElementById('export').addEventListener('click',()=>{
 try {
  const records=localStorage.getItem(key);
  if(!records){message.textContent='No previous records are saved in this browser.';return;}
  const url=URL.createObjectURL(new Blob([records],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='little-luck-previous-records.json';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  message.textContent='Backup download requested. Check your browser downloads.';
 } catch {message.textContent='Unable to access previous records in this browser.';}
});
