export const GAMES={powerball:{label:'Powerball',max:69,bonusMax:26,source:'https://nclottery.com/powerball-past-draws'},mega:{label:'Mega Millions',max:70,bonusMax:24,source:'https://nclottery.com/mega-millions-past-draws'},cash5:{label:'Cash 5',max:43,bonusMax:0,source:'https://nclottery.com/cash5-past-draws'}};
export function easternToday(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function validateHistory(input,today=easternToday()){
 const rows=Array.isArray(input)?input:input?.draws;
 if(!Array.isArray(rows)||rows.length===0||rows.length>50000)throw new Error('Provide 1–50,000 draw records.');
 const keys=new Set();
 return rows.map((r,i)=>{
  const g=GAMES[r?.game];const fail=text=>{throw new Error(`Row ${i+1}: ${text}`);};
  if(!g)fail('unknown game.');
  if(typeof r.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||!Number.isFinite(Date.parse(r.date+'T12:00:00Z'))||new Date(r.date+'T12:00:00Z').toISOString().slice(0,10)!==r.date||r.date<'2025-04-08'||r.date>=today)fail('use valid past dates from April 8, 2025 onward; today is excluded until complete.');
  if(!Array.isArray(r.numbers)||r.numbers.length!==5||new Set(r.numbers).size!==5||r.numbers.some(n=>!Number.isInteger(n)||n<1||n>g.max))fail('invalid main numbers.');
  if(g.bonusMax&&(!Number.isInteger(r.bonus)||r.bonus<1||r.bonus>g.bonusMax))fail('invalid bonus.');
  if(!g.bonusMax&&r.bonus!==undefined&&r.bonus!==null)fail('Cash 5 has no bonus pool.');
  const key=r.game+':'+r.date;if(keys.has(key))fail('duplicate game/date.');keys.add(key);
  return {game:r.game,date:r.date,numbers:[...r.numbers].sort((a,b)=>a-b),...(g.bonusMax?{bonus:r.bonus}:{})};
 }).sort((a,b)=>a.date.localeCompare(b.date)||a.game.localeCompare(b.game));
}
export function describe(rows,game){
 const g=GAMES[game];if(!g)throw new Error('Unknown game.');
 const draws=rows.filter(r=>r.game===game);const main=Array(g.max).fill(0),bonus=Array(g.bonusMax).fill(0);
 const odds=Array(6).fill(0);let sum=0;
 for(const r of draws){for(const n of r.numbers){main[n-1]++;sum+=n;}if(g.bonusMax)bonus[r.bonus-1]++;odds[r.numbers.filter(n=>n%2).length]++;}
 return {count:draws.length,main,bonus,oddDistribution:odds,meanSum:draws.length?sum/draws.length:0,first:draws[0]?.date,last:draws.at(-1)?.date};
}
export function rng(seed){let x=seed>>>0;return ()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
export function sample(random,max=20,count=5){const pool=Array.from({length:max},(_,i)=>i+1);for(let i=0;i<count;i++){const j=i+Math.floor(random()*(max-i));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,count);}
export function experiment(seed=20261001,trainCount=400,testCount=2000){
 if(!Number.isInteger(seed)||seed<1||seed>4294967295||!Number.isInteger(trainCount)||trainCount<10||trainCount>10000||!Number.isInteger(testCount)||testCount<30||testCount>20000)throw new Error('Invalid experiment settings.');
 const dataRandom=rng(seed),selectionRandom=rng(seed^0x9e3779b9);const frequency=Array(20).fill(0);
 for(let i=0;i<trainCount;i++)for(const n of sample(dataRandom))frequency[n-1]++;
 const order=frequency.map((count,i)=>({number:i+1,count}));
 const frequent=[...order].sort((a,b)=>b.count-a.count||a.number-b.number).slice(0,5).map(x=>x.number);
 const infrequent=[...order].sort((a,b)=>a.count-b.count||a.number-b.number).slice(0,5).map(x=>x.number);
 const histograms=[Array(6).fill(0),Array(6).fill(0),Array(6).fill(0)];
 for(let i=0;i<testCount;i++){
  const outcome=new Set(sample(dataRandom));const selections=[sample(selectionRandom),frequent,infrequent];
  selections.forEach((s,j)=>histograms[j][s.filter(n=>outcome.has(n)).length]++);
 }
 return {seed,trainCount,testCount,max:20,count:5,expectedMean:1.25,results:histograms.map((histogram,i)=>{
  const mean=histogram.reduce((s,c,k)=>s+c*k,0)/testCount;
  const variance=histogram.reduce((s,c,k)=>s+c*(k-mean)**2,0)/(testCount-1);
  return {method:['Random baseline','Training-frequency method','Training-infrequency method'][i],histogram,mean,halfInterval:1.96*Math.sqrt(variance/testCount)};
 })};
}
