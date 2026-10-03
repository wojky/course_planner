/* Model and import boundary: plain data, no executable content. */
(function(root){
'use strict';
const GROUPS=['Ja','Środowisko','Drużyna'];
const KEY='pzpn-course-planner-v1';
const uid=()=>globalThis.crypto?.randomUUID?.()||('id-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
const mins=t=>Number(t.slice(0,2))*60+Number(t.slice(3,5));
const duration=x=>mins(x.end)-mins(x.start);
const allEntries=c=>c.sessions.flatMap(s=>s.days.flatMap(d=>d.entries.map(e=>({...e,sessionId:s.id,sessionName:s.name,dayId:d.id,date:d.date}))));
const lessons=c=>allEntries(c).filter(e=>e.type==='lesson');
function seed(){
 const names=[['Ja',['Samoświadomość','Autorefleksja','Wartości i etyka','Nastawienie','Inteligencja emocjonalna','Adaptowalność i innowacyjność']],['Środowisko',['Przywództwo','Budowanie relacji','Organizacja pracy','Tworzenie wizji i kultury','Bezpieczeństwo','Metody nauczania','Efektywna komunikacja','Zarządzanie grupą','Media']],['Drużyna',['Zarządzanie meczem','Analiza','Indywidualizacja procesu','Planowanie','Zarządzanie treningiem']]];
 const competencies=names.flatMap(([group,ns])=>ns.map(name=>({id:uid(),name,group,description:''})));
 const lesson=(start,end,title,trainer,method='Warsztaty',location='Sala wykładowa',note='')=>({id:uid(),type:'lesson',start,end,title,trainer,method,location,competencyIds:[],note});
 const pause=(start,end,title='Przerwa')=>({id:uid(),type:'break',start,end,title,trainer:'',method:'',location:'',competencyIds:[],note:''});
 return {schemaVersion:1,course:{id:uid(),name:'UEFA Elite Youth A',edition:'Edycja 2 · 2026',location:'Szkoła Trenerów PZPN w Białej Podlaskiej (ul. Warszawska 29)',competencies,sessions:[{id:uid(),name:'Sesja 2',location:'Biała Podlaska',days:[
 {id:uid(),date:'2026-10-05',entries:[lesson('09:00','10:30','OUTWITTING YOUR OPPONENT OBSERVATION - ANALYSIS - COACHING - PROCESS','Paul McGuinness','Prezentacja / Warsztaty'),pause('10:30','10:50'),lesson('10:50','12:10','Działania indywidualne i grupowe bez piłki','Paul McGuinness','Praktyka','Boisko','W załączniku podano 90 min; z godzin wynika 80 min.'),pause('12:10','12:30'),lesson('12:30','14:00','OUTWITTING YOUR OPPONENT OBSERVATION - ANALYSIS - COACHING - PROCESS','Paul McGuinness','Prezentacja / Warsztaty'),pause('14:00','15:00','Przerwa obiadowa'),lesson('15:00','17:00','Moje wyzwania w pracy trenera','Paweł Grycmann','Prezentacja / Warsztaty','Sala wykładowa','W załączniku podano 90 min; z godzin wynika 120 min.'),pause('17:00','17:30')]},
 {id:uid(),date:'2026-10-06',entries:[lesson('09:00','10:30','Z doświadczeń własnych – kim jest świadomy trener?','Artur Skowronek','Prezentacja / Warsztaty'),pause('10:30','11:00','Przerwa kawowa'),lesson('11:00','12:30','Jak rozumiem proces wprowadzania młodego zawodnika do profesjonalnej piłki seniorskiej?','Artur Skowronek'),pause('12:30','13:30','Przerwa obiadowa'),lesson('15:00','16:30','Tworzenie środowiska – wspólne projektowanie procesu wejścia do pierwszego zespołu','Artur Skowronek'),pause('16:30','16:45','Przerwa kawowa'),lesson('16:00','17:30','Refleksja – podsumowanie dnia – droga do pierwszego zespołu','Artur Skowronek','Dyskusja','Sala wykładowa','Godziny zachowane z załącznika: nakładają się na poprzednie zajęcia i przerwę. W kolumnie czasu podano 45 min, z godzin wynika 90 min. Wymaga korekty.')]},
 {id:uid(),date:'2026-10-07',entries:[lesson('08:30','09:15','Refleksja','Kamil Wojkowski','Dyskusja'),lesson('09:15','10:45','Breathwork','Rafał Czerniewski'),pause('10:45','11:15','Przerwa kawowa'),lesson('11:15','12:45','Breathwork','Rafał Czerniewski'),pause('12:45','13:45','Przerwa obiadowa'),lesson('13:45','14:30','Breathwork','Rafał Czerniewski'),lesson('14:30','15:15','Podsumowanie sesji 2','Kamil Wojkowski','Dyskusja')]}
 ]}]},ui:{view:'schedule',sessionId:null,dayId:null},updatedAt:new Date().toISOString()};
}
function validate(raw){
 const fail=m=>{throw new Error(m);};
 const obj=(v,label)=>{if(!v||typeof v!=='object'||Array.isArray(v))fail('Nieprawidłowe dane: '+label);};
 const str=(v,label,required=false)=>{if(typeof v!=='string'||v.length>10000||(required&&!v.trim()))fail('Nieprawidłowe pole: '+label);return v;};
 const arr=(v,label)=>{if(!Array.isArray(v))fail('Brak listy: '+label);return v;};
 const used=new Set();
 const id=v=>{str(v,'identyfikator',true);if(!/^[a-zA-Z0-9_-]{1,128}$/.test(v))fail('Nieprawidłowy identyfikator.');if(used.has(v))fail('Powtórzony identyfikator: '+v);used.add(v);return v;};
 const time=(v)=>{if(typeof v!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(v))fail('Nieprawidłowa godzina.');return v;};
 const date=v=>{if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(new Date(v+'T12:00:00Z').valueOf())||new Date(v+'T12:00:00Z').toISOString().slice(0,10)!==v)fail('Nieprawidłowa data dnia.');return v;};
 obj(raw,'plik kursu');if(raw.schemaVersion!==1)fail('Nieobsługiwana wersja pliku. Wymagany jest eksport z tej aplikacji (wersja 1).');
 obj(raw.course,'kurs');const c=raw.course;
 const competencies=arr(c.competencies,'kompetencje').map(k=>{obj(k,'kompetencja');if(!GROUPS.includes(k.group))fail('Nieprawidłowy obszar kompetencji.');return {id:id(k.id),name:str(k.name,'nazwa kompetencji',true),group:k.group,description:str(k.description??'','opis')};});
 const refs=new Set(competencies.map(k=>k.id));
 const sessions=arr(c.sessions,'sesje').map(s=>{obj(s,'sesja');return {id:id(s.id),name:str(s.name,'nazwa sesji',true),location:str(s.location??'','miejsce sesji'),days:arr(s.days,'dni').map(d=>{obj(d,'dzień');return {id:id(d.id),date:date(d.date),entries:arr(d.entries,'zajęcia').map(e=>{obj(e,'zajęcia');if(!['lesson','break'].includes(e.type))fail('Nieprawidłowy typ pozycji.');const start=time(e.start),end=time(e.end);if(mins(end)<=mins(start))fail('Zakończenie zajęć musi być późniejsze niż rozpoczęcie.');const ids=arr(e.competencyIds,'kompetencje zajęć');if(ids.some(v=>typeof v!=='string'||!refs.has(v))||new Set(ids).size!==ids.length)fail('Zajęcia odwołują się do nieznanej lub powtórzonej kompetencji.');if(e.type==='break'&&ids.length)fail('Przerwy nie mogą mieć przypisanych kompetencji.');return {id:id(e.id),type:e.type,start,end,title:str(e.title,'temat',true),trainer:str(e.trainer??'','prowadzący'),method:str(e.method??'','metoda'),location:str(e.location??'','miejsce'),note:str(e.note??'','notatka'),competencyIds:[...ids]};})};})};});
 const course={id:id(c.id),name:str(c.name,'nazwa kursu',true),edition:str(c.edition??'','edycja'),location:str(c.location??'','miejsce kursu'),competencies,sessions};
 const ui=raw.ui&&typeof raw.ui==='object'?raw.ui:{};
 return {schemaVersion:1,course,ui:{view:['schedule','competencies','analytics','settings'].includes(ui.view)?ui.view:'schedule',sessionId:typeof ui.sessionId==='string'?ui.sessionId:null,dayId:typeof ui.dayId==='string'?ui.dayId:null},updatedAt:typeof raw.updatedAt==='string'?raw.updatedAt:new Date().toISOString()};
}
function analytics(c){
 const es=lessons(c);const total=es.reduce((n,e)=>n+duration(e),0);
 const stats=c.competencies.map(k=>{const selected=es.filter(e=>e.competencyIds.includes(k.id));return {...k,count:selected.length,minutes:selected.reduce((n,e)=>n+duration(e),0)};});
 const pairs=new Map(),sets=new Map();
 const add=(map,ids,e)=>{const key=JSON.stringify(ids);const v=map.get(key)||{ids,count:0,minutes:0};v.count++;v.minutes+=duration(e);map.set(key,v);};
 es.forEach(e=>{const ids=[...e.competencyIds].sort();if(ids.length>1){add(sets,ids,e);for(let a=0;a<ids.length;a++)for(let b=a+1;b<ids.length;b++)add(pairs,[ids[a],ids[b]],e);}});
 const sort=map=>[...map.values()].sort((a,b)=>b.count-a.count||b.minutes-a.minutes);
 return {total,lessonCount:es.length,stats,pairs:sort(pairs),sets:sort(sets),tagged:es.filter(e=>e.competencyIds.length).length};
}
function conflicts(day){const result=new Set();day.entries.forEach((a,i)=>day.entries.slice(i+1).forEach(b=>{if(mins(a.start)<mins(b.end)&&mins(b.start)<mins(a.end)){result.add(a.id);result.add(b.id);}}));return result;}
root.CourseModel={GROUPS,KEY,uid,mins,duration,allEntries,lessons,seed,validate,analytics,conflicts};
if(typeof module!=='undefined')module.exports=root.CourseModel;
})(globalThis);
