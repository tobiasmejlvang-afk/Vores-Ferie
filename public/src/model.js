export const VERSION = 1;
export const statuses = { planned: 'Planlagt', active: 'På ferie', completed: 'Afsluttet' };
export const tripTypes = ['Camping', 'Autocamper', 'Hotel', 'Feriebolig', 'Telt', 'Togrejse', 'Flyrejse', 'Dagstur', 'Andet'];
export const placeTypes = ['Natur', 'Camping', 'Hotel', 'Feriebolig', 'Oplevelse', 'Mad & drikke', 'Service', 'Andet'];
export const id = () => crypto.randomUUID();
export const today = () => new Intl.DateTimeFormat('sv-SE').format(new Date());
export const copy = x => structuredClone(x);
export const dateOK = x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x) && !Number.isNaN(Date.parse(x)) && new Date(x).toISOString().slice(0,10) === x;
export const daysBetween = (a,b) => Math.round((Date.parse(b)-Date.parse(a))/86400000);
export const addDays = (date, n) => new Date(Date.parse(date)+n*86400000).toISOString().slice(0,10);
export const money = cents => new Intl.NumberFormat('da-DK',{style:'currency',currency:'DKK',maximumFractionDigits:0}).format(cents/100);
export const prettyDate = (d, opts={day:'numeric',month:'short'}) => dateOK(d) ? new Intl.DateTimeFormat('da-DK',opts).format(new Date(d+'T12:00:00')) : 'Ingen dato';
export const timeMinutes = t => Number(t.slice(0,2))*60+Number(t.slice(3));
export const minutesTime = n => `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
export const cents = value => {const n=Number(String(value).replace(',','.')); if(!Number.isFinite(n)||n<0||n>100000000)throw Error('Beløbet skal være mellem 0 og 100.000.000 kr.'); return Math.round(n*100);};

export function emptyState(){return {version:VERSION,trips:[],plans:[],packing:[],expenses:[],places:[],memories:[],files:[],history:[],settings:{maps:false,dismissed:[],lastBackup:null}};}
const assert = (test,msg) => {if(!test)throw Error(msg);};
const str = (s,max=2000) => typeof s==='string'&&s.length<=max;
const key = s => str(s,100)&&/^[\w-]+$/.test(s);
function unique(list){assert(new Set(list.map(x=>x.id)).size===list.length,'Dublerede id’er i data.');}
export function validateState(s){
  assert(s&&s.version===VERSION,'Backupversionen understøttes ikke.');
  for(const k of ['trips','plans','packing','expenses','places','memories','files','history']){assert(Array.isArray(s[k])&&s[k].length<=10000,`Ugyldige data: ${k}.`); for(const x of s[k]) assert(x&&key(x.id),'Ugyldigt id.'); unique(s[k]);}
  assert(s.trips.filter(t=>t.status==='active').length<=1,'Kun én ferie kan være aktiv.');
  for(const t of s.trips){assert(str(t.title,120)&&t.title.trim()&&str(t.destination,200),'Ferien mangler navn eller destination.');assert(dateOK(t.start)&&dateOK(t.end)&&t.end>=t.start&&daysBetween(t.start,t.end)<=366,'Vælg en gyldig ferieperiode på højst 367 dage.');assert(Object.hasOwn(statuses,t.status)&&tripTypes.includes(t.type),'Ugyldig ferietype eller status.');assert(str(t.travelers,500)&&str(t.pets,500)&&str(t.note,5000),'Ugyldige ferieoplysninger.');assert(Number.isSafeInteger(t.budget)&&t.budget>=0&&t.budget<=1e10,'Ugyldigt budget.');assert(['coast','forest','lake'].includes(t.cover),'Ugyldigt ferietema.');}
  const trips=new Map(s.trips.map(t=>[t.id,t])); const places=new Set(s.places.map(p=>p.id));
  for(const k of ['plans','packing','expenses','memories','files'])for(const x of s[k])assert(trips.has(x.tripId),'Data refererer til en ferie, der ikke findes.');
  for(const p of s.places){assert(str(p.name,140)&&p.name.trim()&&placeTypes.includes(p.type)&&str(p.area,200)&&str(p.note,3000),'Ugyldigt sted.');assert(typeof p.favorite==='boolean','Ugyldig favorit.');assert((p.lat===null&&p.lng===null)||(Number.isFinite(p.lat)&&Math.abs(p.lat)<=85&&Number.isFinite(p.lng)&&Math.abs(p.lng)<=180),'Ugyldige koordinater.');}
  for(const p of s.plans){const t=trips.get(p.tripId);assert(str(p.title,160)&&p.title.trim()&&dateOK(p.date)&&p.date>=t.start&&p.date<=t.end,'Planpunktet skal ligge i ferieperioden.');assert(/^([01]\d|2[0-3]):[0-5]\d$/.test(p.time)&&Number.isInteger(p.duration)&&p.duration>=5&&p.duration<=1440&&timeMinutes(p.time)+p.duration<=1440,'Planpunktet skal slutte senest kl. 24.00. Del etaper over midnat i to.');assert(['activity','stay','transport','booking'].includes(p.type)&&str(p.note,3000)&&str(p.reference,200)&&typeof p.done==='boolean','Ugyldigt planpunkt.');assert(p.placeId===null||places.has(p.placeId),'Stedet findes ikke.');}
  for(const p of s.packing)assert(str(p.text,160)&&p.text.trim()&&typeof p.done==='boolean','Ugyldigt pakkepunkt.');
  for(const p of s.expenses)assert(str(p.title,160)&&p.title.trim()&&str(p.category,100)&&Number.isSafeInteger(p.amount)&&p.amount>=0&&p.amount<=1e10,'Ugyldig udgift.');
  for(const m of s.memories){const t=trips.get(m.tripId);assert(str(m.title,160)&&m.title.trim()&&str(m.text,10000)&&dateOK(m.date)&&m.date>=t.start&&m.date<=t.end,'Mindet skal have en dato i ferien.');assert(m.image===null||(str(m.image,8e6)&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(m.image)),'Ugyldigt billede. Brug JPG, PNG eller WebP.');}
  for(const f of s.files)assert(str(f.name,200)&&['application/pdf','image/jpeg','image/png','image/webp'].includes(f.type)&&str(f.data,8e6)&&f.data.startsWith(`data:${f.type};base64,`)&&/^[A-Za-z0-9+/=]+$/.test(f.data.split(',')[1]),'Ugyldigt dokument.');
  assert(s.history.length<=60,'Historikken er for lang.');
  for(const h of s.history){assert(str(h.label,240)&&str(h.at,40)&&Array.isArray(h.changes)&&h.changes.length<=10000,'Ugyldig historik.');for(const c of h.changes)assert(['trips','plans','packing','expenses','places','memories','files'].includes(c.collection)&&key(c.id)&&(c.before===null||typeof c.before==='object')&&(c.after===null||typeof c.after==='object'),'Ugyldig ændringshistorik.');}
  assert(s.settings&&typeof s.settings.maps==='boolean'&&Array.isArray(s.settings.dismissed)&&s.settings.dismissed.length<=200&&s.settings.dismissed.every(x=>str(x,200))&&(s.settings.lastBackup===null||str(s.settings.lastBackup,40)),'Ugyldige indstillinger.');
  return s;
}

export function change(state,label,fn){
  const next=copy(state); fn(next);
  const changes=[];
  for(const k of ['trips','plans','packing','expenses','places','memories','files']){const before=new Map(state[k].map(x=>[x.id,x])); const after=new Map(next[k].map(x=>[x.id,x])); for(const itemId of new Set([...before.keys(),...after.keys()])){const a=before.get(itemId)||null,b=after.get(itemId)||null;if(JSON.stringify(a)!==JSON.stringify(b))changes.push({collection:k,id:itemId,before:copy(a),after:copy(b)});}}
  if(changes.length) next.history=[{id:id(),label,at:new Date().toISOString(),changes},...next.history].slice(0,60);
  return validateState(next);
}
export function undo(state){
  const next=copy(state),h=next.history.shift(); if(!h)return next;
  for(const c of h.changes){const current=next[c.collection].find(x=>x.id===c.id)||null;assert(JSON.stringify(current)===JSON.stringify(c.after),'Ændringen kan ikke fortrydes efter nyere rettelser.');next[c.collection]=next[c.collection].filter(x=>x.id!==c.id);if(c.before)next[c.collection].push(c.before);}
  return validateState(next);
}
export function startTrip(s,tripId){assert(!s.trips.some(t=>t.status==='active'&&t.id!==tripId),'Afslut den aktive ferie først.');return change(s,'Ferie startet',n=>{n.trips.find(t=>t.id===tripId).status='active';});}
export function deleteTrip(s,tripId){const n=copy(s);n.trips=n.trips.filter(t=>t.id!==tripId);for(const k of ['plans','packing','expenses','memories','files'])n[k]=n[k].filter(x=>x.tripId!==tripId);n.history=[];n.settings.dismissed=[];return validateState(n);}
export const tripPlans = (s,t) => s.plans.filter(p=>p.tripId===t).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
export function suggestions(s,tripId){
  const trip=s.trips.find(t=>t.id===tripId);if(!trip)return [];
  const list=[],plans=tripPlans(s,tripId).filter(p=>!p.done);
  for(let i=0;i<plans.length;i++)for(let j=i+1;j<plans.length;j++){const a=plans[i],b=plans[j];if(a.date!==b.date)break;const end=timeMinutes(a.time)+a.duration;if(timeMinutes(b.time)<end){const shift=end+b.duration<=1440&&b.type==='activity';list.push({id:`overlap-${a.id}-${b.id}-${a.time}-${b.time}`,title:'To planer ligger oven i hinanden',body:`${a.title} slutter kl. ${minutesTime(end)}, men ${b.title} starter kl. ${b.time} den ${prettyDate(a.date)}.`,source:'Beregnet fra dine tider. Rejsetid er ikke medregnet.',planId:b.id,newTime:shift?minutesTime(end):null});}}
  const cost=s.expenses.filter(x=>x.tripId===tripId).reduce((n,x)=>n+x.amount,0);
  if(trip.budget>0&&cost>trip.budget)list.push({id:`budget-${tripId}-${cost}-${trip.budget}`,title:'Budgettet er overskredet',body:`Du har registreret ${money(cost-trip.budget)} mere end budgettet.`,source:'Summen af dine registrerede udgifter i DKK.'});
  if(!s.packing.some(p=>p.tripId===tripId))list.push({id:`packing-${tripId}`,title:'Skal vi begynde på pakkelisten?',body:'Start med tøj, opladere og toiletgrej. Du kan rette listen bagefter.',source:'Fast skabelon. Ikke en vejrprognose eller AI-anbefaling.',packing:true});
  return list.filter(x=>!s.settings.dismissed.includes(x.id));
}
export function search(s,query){const q=query.toLocaleLowerCase('da').trim();if(q.length<2)return [];const groups=[['trips','Ferie','title'],['plans','Plan','title'],['places','Sted','name'],['memories','Minde','title'],['files','Dokument','name']];return groups.flatMap(([k,type,field])=>s[k].filter(x=>[x[field],x.destination,x.area,x.note,x.text].filter(Boolean).join(' ').toLocaleLowerCase('da').includes(q)).map(x=>({id:x.id,tripId:x.tripId|| (k==='trips'?x.id:null),type,title:x[field],route:k==='places'?'udforsk':k==='memories'?'minder':'ferier',tab:k==='files'?'dokumenter':'plan'}))).slice(0,40);}

export function demoState(){
  const s=emptyState(),start=addDays(today(),7),tid='demo-trip';
  s.trips=[{id:tid,title:'Små veje. Store oplevelser.',destination:'Søhøjlandet, Danmark',start,end:addDays(start,6),status:'planned',type:'Camping',travelers:'2 voksne',pets:'Sisi',budget:800000,cover:'lake',note:'En uge med skovstier, langsomme morgener og kaffe med udsigt.'}];
  s.places=[{id:'demo-lake',name:'En stille stund ved Almindsø',area:'Silkeborg · Søhøjlandet',type:'Natur',lat:56.1482,lng:9.5474,favorite:true,note:'Eksempelsted. Kontrollér adgangsforhold og lokale regler før besøg.'},{id:'demo-forest',name:'På opdagelse ved Himmelbjerget',area:'Ry · Søhøjlandet',type:'Oplevelse',lat:56.1059,lng:9.6854,favorite:false,note:'Eksempelsted. Ingen live-oplysninger om åbningstider.'}];
  s.plans=[{id:'demo-plan-1',tripId:tid,title:'Ankomst og tid til at lande',date:start,time:'14:00',duration:60,type:'stay',placeId:null,reference:'',note:'Find en god plads og sæt kaffen over.',done:false},{id:'demo-plan-2',tripId:tid,title:'En tur ned til søen',date:start,time:'16:00',duration:90,type:'activity',placeId:'demo-lake',reference:'',note:'Tag Sisi og kameraet med.',done:false},{id:'demo-plan-3',tripId:tid,title:'Aftensmad under åben himmel',date:start,time:'18:30',duration:60,type:'activity',placeId:null,reference:'',note:'Noget enkelt på grillen.',done:false}];
  s.packing=['Tøj til lune og kølige dage','Opladere og powerbank','Toilettaske','Hundesnor og vandskål','Kamera','Regnjakker'].map((text,i)=>({id:`demo-pack-${i}`,tripId:tid,text,done:i<3}));
  s.expenses=[{id:'demo-cost',tripId:tid,title:'Planlagt ophold (eksempel)',category:'Overnatning',amount:240000}];
  return validateState(s);
}
