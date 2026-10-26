/* 추천 도서는 1일이 아니라 월요일에 바뀐다(2026-10-26 회장님): 그 주 목요일이 든 달이 그 주의 달(월말이 월·화·수 → 그 주 월요일, 목~일 → 다음 월요일).
   월말이 월·화요일이면 그 주 월요일에 새 달로, 수~일요일이면 다음 월요일에(예: 11/1 일요일 → 11/2 월요일) */
const fs=require("fs");eval(fs.readFileSync(__dirname+"/../../core.gs","utf8")+";global.Core=Core;");
let NOW=new Date("2026-10-26T03:00:00Z");
const T={};Object.keys(Core.HEAD).forEach(t=>T[t]=[]);
const env={now:()=>NOW,email:()=>"",uid:()=>"u"+Math.random().toString(36).slice(2,8),hmac:s=>"h"+s,http:()=>{throw new Error("off")},httpAll:null,mail:()=>{}};
const db={replace:(t,l)=>{T[t]=[];l.forEach(o=>db.add(t,o));},rows:t=>T[t],add:(t,o)=>{const r={};Core.HEAD[t].forEach(h=>r[h]=o[h]==null?"":String(o[h]));T[t].push(r)},addMany:(t,l)=>l.forEach(o=>db.add(t,o)),
  set:(t,k,v,p)=>T[t].forEach(r=>{if(String(r[k]).trim()===String(v))Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setMany:(t,k,m)=>T[t].forEach(r=>{const p=m[String(r[k])];if(p)Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setConf:(k,v)=>{const h=T["설정"].find(r=>r["항목"]===k);if(h)h["값"]=v;else T["설정"].push({"항목":k,"값":v})}};
const must=(c,m)=>{if(!c){console.log("✗",m);process.exitCode=1;}else console.log("✓",m);};
const C=()=>Core.make(db,env);
const sm=d=>C().shelfMon(d);
/* 달 정하기 */
must(sm("2026-10-26")==="2026-10"&&sm("2026-11-01")==="2026-10","10/26(월)~11/1(일) 주는 10월(그 주 목요일 10/29)");
must(sm("2026-11-02")==="2026-11","11/2(월)부터 11월");
must(sm("2026-09-28")==="2026-10"&&sm("2026-09-27")==="2026-09","9/30(수) 끝 → 9/28(월)부터 10월(월화수 쪽)");
must(sm("2026-10-05")==="2026-10","10/5(월) 10월");
must(sm("2026-03-30")==="2026-04"&&sm("2026-03-31")==="2026-04","3/31(화) 끝 → 3/30(월)부터 4월");
must(sm("2026-12-28")==="2026-12"&&sm("2027-01-04")==="2027-01","12/31(목) 끝 → 1/4(월)부터 1월");
must(sm("2026-06-29")==="2026-07","6/30(화) 끝 → 6/29(월)부터 7월");
/* 서가 바꾸기: 미리 뽑아 둔 11월 책이 있으면 그 날 바꾼다 */
C().maintain();db.setConf("추천묶음","");db.setConf("이달","2026-10");db.setConf("선별판","3");
T["도서"].push({"id":"b11","제목":"11월 책","월":"2026-11","출처":"자동","숨김":""});
const rot=()=>{try{return C().rotateMonth(false);}catch(e){return {err:e.message};}};
const cf=k=>(T["설정"].find(r=>r["항목"]===k)||{})["값"];
NOW=new Date("2026-10-31T16:00:00Z");   /* 11/1(일) 01시 */
let r=rot();must(r.skipped&&cf("이달")==="2026-10","11/1(일)에는 아직 10월 그대로 "+JSON.stringify(r));
NOW=new Date("2026-11-01T15:30:00Z");   /* 11/2(월) 00:30 */
r=rot();must(cf("이달")==="2026-11","11/2(월) 0시 뒤 11월로 바뀜 "+JSON.stringify(r).slice(0,80));
/* 화면의 '언제까지' 글자(index.html 의 switchMon 과 같은 규칙) */
const src=fs.readFileSync(__dirname+"/../../index.html","utf8");
const fn=src.match(/function switchMon\(y,m\)\{[^\n]*\}/)[0];eval(fn);
const md=d=>(d.getMonth()+1)+"/"+d.getDate();
must(md(switchMon(2026,10))==="11/2","11월 추천 도서는 11/2(월)부터");
must(md(switchMon(2026,3))==="3/30","4월 추천 도서는 3/30(월)부터");
must(md(switchMon(2026,9))==="9/28","10월 추천 도서는 9/28(월)부터(9/30 수요일 끝)");
must(md(switchMon(2026,11))==="11/30","12월 추천 도서는 11/30(월)부터(11/30 월요일 끝)");
must(md(switchMon(2026,6))==="6/29","7월 추천 도서는 6/29(월)부터(6/30 화요일 끝)");
must(md(switchMon(2027,0))==="1/4","1월 추천 도서는 1/4(월)부터");
