/* 투표 순위·도장 공지(2026-10-26 회장님): 한 번만 넣고, 11월이 되면 '9~10월 글은 10월 31일에' 문장을 달마다 문장으로 */
const fs=require("fs");eval(fs.readFileSync(__dirname+"/../../core.gs","utf8")+";global.Core=Core;");
let NOW=new Date("2026-10-26T03:00:00Z");
const T={};Object.keys(Core.HEAD).forEach(t=>T[t]=[]);
const env={now:()=>NOW,email:()=>"",uid:()=>"u"+Math.random().toString(36).slice(2,8),hmac:s=>"h"+s,http:()=>{throw 1},mail:()=>{}};
const db={replace:(t,l)=>{T[t]=[];l.forEach(o=>db.add(t,o));},rows:t=>T[t],add:(t,o)=>{const r={};Core.HEAD[t].forEach(h=>r[h]=o[h]==null?"":String(o[h]));T[t].push(r)},addMany:(t,l)=>l.forEach(o=>db.add(t,o)),
  set:(t,k,v,p)=>T[t].forEach(r=>{if(String(r[k]).trim()===String(v))Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setMany:(t,k,m)=>T[t].forEach(r=>{const p=m[String(r[k])];if(p)Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setConf:(k,v)=>{const h=T["설정"].find(r=>r["항목"]===k);if(h)h["값"]=v;else T["설정"].push({"항목":k,"값":v})}};
const must=(c,m)=>{if(!c){console.log("✗",m);process.exitCode=1;}else console.log("✓",m);};
const C=()=>Core.make(db,env);
C().maintain();C().maintain();
const N=()=>T["공지"].filter(r=>/투표해서 순위를 뽑아요/.test(r["제목"]));
must(N().length===1&&N()[0]["고정"]==="Y"&&N()[0]["대상"]==="학생","투표 순위 공지 하나(고정·학생)");
must(/10위까지 만능 도장 1개/.test(N()[0]["내용"])&&/독후감은 10위까지 만능 도장 2개/.test(N()[0]["내용"])&&/10월 31일/.test(N()[0]["내용"]),"순위별 도장과 10/31 마감이 적힘");
T["교사"].push({"이메일":"lib@x","이름":"사서","담당":"관리자"});
T["명단"].push({"학번":"3101","이름":"가온","반":"3-1","동의":"y","도서부":""});
const tk=C().api("login",{role:"student",hakbun:"3101",name:"가온",agree:true,newPin:"729314"}).token;
must((C().api("state",{_t:tk}).notices||[]).some(n=>/투표해서 순위/.test(n.title)),"학생 공지사항에 보임");
NOW=new Date("2026-11-01T03:00:00Z");C().maintain();
must(!/10월 31일/.test(N()[0]["내용"])&&/7일 동안 투표/.test(N()[0]["내용"]),"11월부터는 달마다 문장으로 바뀜");
