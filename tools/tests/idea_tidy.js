/* 건의함(2026-10-26 회장님): 관리자 '지우기'는 관리자 목록에서만 치운다 — 학생은 자기 건의·답변을 계속 본다.
   예전에 '삭제'로 지운 건의는 한 번 되살린다 */
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
/* 예전에 지운 건의 둘(하나는 답변 있음) */
T["건의"].push({"id":"i1","시각":"2026-10-10 03:05:02","학번":"3101","이름":"가온","반":"3-1","내용":"책 넣어 주세요","답변":"다음에 사자","답변자":"사서 선생님","답변시각":"","상태":"삭제","치움":""},
  {"id":"i2","시각":"2026-10-15 15:52:18","학번":"3102","이름":"두리","반":"3-1","내용":"웹툰도","답변":"","답변자":"","답변시각":"","상태":"삭제","치움":""});
C().maintain();
must(T["건의"].find(r=>r.id==="i1")["상태"]==="답변"&&T["건의"].find(r=>r.id==="i2")["상태"]==="대기","지웠던 건의 되살림(답변 있으면 답변, 없으면 대기)");
T["교사"].push({"이메일":"lib@x","이름":"사서","담당":"관리자"});
T["명단"].push({"학번":"3101","이름":"가온","반":"3-1","동의":"y","도서부":""},{"학번":"3102","이름":"두리","반":"3-1","동의":"y","도서부":""});
const t1=C().api("login",{role:"student",hakbun:"3101",name:"가온",agree:true,newPin:"729314"}).token;
const ta=C().api("login",{role:"teacher",name:"사서",newPin:"518293"}).token;
const st=t=>C().api("state",{_t:t});
let s=st(t1);must(s.ideas.length===1&&s.ideas[0].reply==="다음에 사자","학생이 자기 건의와 답변을 다시 봄");
C().api("ideaReply",{_t:ta,id:"i1",del:1});
s=st(t1);must(s.ideas.length===1&&s.ideas[0].reply==="다음에 사자","관리자가 치워도 학생 건의함에는 그대로");
let A=st(ta).ideas;must(A.find(x=>x.id==="i1").tidy===true&&A.find(x=>x.id==="i2").tidy===false,"관리자 목록에는 치움 표시");
must(T["건의"].find(r=>r.id==="i1")["상태"]==="답변","치워도 상태(답변)는 그대로");
C().api("ideaReply",{_t:ta,id:"i1",undel:1});
must(st(ta).ideas.find(x=>x.id==="i1").tidy===false,"다시 꺼내기");
let bad="";try{C().api("ideaReply",{_t:t1,id:"i1",del:1});}catch(e){bad=e.message;}
must(!!bad,"학생은 치울 수 없음");
