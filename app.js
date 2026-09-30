import {emptyState, validateState, addTicket, cents, monthlySummary, purchasedCoverage} from './engine.js';
const $=id=>document.getElementById(id);
const key='little-luck-diary-v1';
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
let state=emptyState();
function message(text){$('message').textContent=text;}
try { const saved=localStorage.getItem(key); if(saved) state=validateState(JSON.parse(saved)); }
catch {message('Saved records could not be read. Export any available backup before saving new records.');}
$('month').value=today.slice(0,7); $('purchased').value=today;
const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value/100);
function element(tag,text,className){const node=document.createElement(tag);node.textContent=text;if(className)node.className=className;return node;}
function ask(question, initial) {
  return new Promise(resolve=>{
    const dialog=document.createElement('dialog');
    const form=document.createElement('form');form.method='dialog';
    const label=element('label',question);const input=document.createElement('input');
    if(initial!==undefined){input.value=initial;input.inputMode='decimal';label.append(input);}
    const cancel=element('button','Cancel');cancel.type='button';
    const accept=element('button','Confirm');accept.type='submit';
    const actions=element('div','','inline');actions.append(cancel,accept);form.append(label,actions);dialog.append(form);document.body.append(dialog);
    let result=null;
    cancel.addEventListener('click',()=>dialog.close());
    form.addEventListener('submit',()=>{result=initial===undefined?true:input.value;});
    dialog.addEventListener('close',()=>{dialog.remove();resolve(result);},{once:true});dialog.showModal();
  });
}
function save(next){localStorage.setItem(key,JSON.stringify(next));state=next;render();}
function render(){
 $('budget').value=(state.budgetCents/100).toFixed(2);
 const totals=monthlySummary(state,$('month').value);
 $('summary').replaceChildren(...[['Spent',totals.spentCents],['Budget remaining',totals.remainingCents],['Collected prizes',totals.prizeCents],['Net outcome',totals.netCents]].map(([label,value])=>{const card=element('div','');card.append(element('span',label),element('strong',money(value)));return card;}));
 $('count').textContent=`${state.tickets.length} records`;
 $('tickets').replaceChildren();
 if(!state.tickets.length)$('tickets').append(element('p','No purchased tickets recorded yet.','muted'));
 for(const ticket of [...state.tickets].sort((a,b)=>b.purchasedAt.localeCompare(a.purchasedAt))){
  const row=element('article','','ticket');
  row.append(element('h3',`${ticket.game} · ${ticket.reference}`),element('p',`${ticket.purchasedAt} · Paid ${money(ticket.costCents)} · Collected ${money(ticket.prizeCents)}`),element('p',`Draw dates: ${ticket.drawDates.join(', ')||'Not recorded'}`));
  const edit=element('button','Update collected prize');edit.type='button';edit.addEventListener('click',async()=>{const amount=await ask('Total collected prizes for this ticket ($)',(ticket.prizeCents/100).toFixed(2));if(amount===null)return;try{save(validateState({...state,tickets:state.tickets.map(t=>t.id===ticket.id?{...t,prizeCents:cents(amount)}:t)}));message('Collected prize updated.');}catch(e){message(e.message);}});
  const remove=element('button','Remove record');remove.type='button';remove.addEventListener('click',async()=>{if(await ask(`Remove ${ticket.reference}? This changes your spending records.`)){try{save({...state,tickets:state.tickets.filter(t=>t.id!==ticket.id)});message('Record removed.');}catch(e){message(e.message);}}});
  const actions=element('div','','inline');actions.append(edit,remove);row.append(actions);$('tickets').append(row);
 }
 const coverage=purchasedCoverage(state);$('coverage').replaceChildren(...coverage.map(c=>element('p',`${c.date} · ${c.game} · ${c.tickets} ticket record${c.tickets===1?'':'s'}`)));
 if(!coverage.length)$('coverage').append(element('p','No draw dates recorded.','muted'));
}
$('month').addEventListener('change',()=>{if($('month').value)render();});
$('budget-form').addEventListener('submit',event=>{event.preventDefault();try{save(validateState({...state,budgetCents:cents($('budget').value)}));message('Budget saved.');}catch(e){message(e.message);}});
$('ticket-form').addEventListener('submit',event=>{event.preventDefault();try{
 const ticket={id:crypto.randomUUID(),game:$('game').value,reference:$('reference').value,purchasedAt:$('purchased').value,costCents:cents($('cost').value),prizeCents:cents($('prize').value),drawDates:$('draws').value.split(/[\s,]+/).filter(Boolean)};
 save(addTicket(state,ticket));$('ticket-form').reset();$('purchased').value=today;$('prize').value='0';message('Purchased ticket recorded.');
}catch(e){message(e.message);}});
$('export').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`little-luck-${today}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Backup downloaded.');});
$('import').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>5000000)throw new Error('Backup exceeds 5 MB.');const next=validateState(JSON.parse(await file.text()));if(await ask(`Replace current records with ${next.tickets.length} tickets from this backup?`)){save(next);message('Backup restored.');}}catch(e){message(`Restore failed: ${e.message}`);}finally{event.target.value='';}});
render();
