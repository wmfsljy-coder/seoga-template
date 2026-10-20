/* 무지개 별(2026-10-19 회장님): 이벤트 '무지개' 기간(10/26~11/1)에 새로 생긴 별만 별 1개 = 문화상품권 2장.
   그 전부터 가진 별은 1장 그대로 · 별은 오래된 것부터 쓴다 · 지급 시트 '별' = 쓴 별 개수 */
const fs=require("fs");eval(fs.readFileSync(__dirname+"/../../core.gs","utf8")+";global.Core=Core;");
let NOW=new Date("2026-10-19T03:00:00Z");
const T={};Object.keys(Core.HEAD).forEach(t=>T[t]=[]);
const env={now:()=>NOW,email:()=>"",uid:()=>"u"+Math.random().toString(36).slice(2,8),hmac:s=>"h"+s,http:()=>{throw 1},mail:()=>{}};
const db={replace:(t,l)=>{T[t]=[];l.forEach(o=>db.add(t,o));},rows:t=>T[t],add:(t,o)=>{const r={};Core.HEAD[t].forEach(h=>r[h]=o[h]==null?"":String(o[h]));T[t].push(r)},addMany:(t,l)=>l.forEach(o=>db.add(t,o)),
  set:(t,k,v,p)=>T[t].forEach(r=>{if(String(r[k]).trim()===String(v))Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setMany:(t,k,m)=>T[t].forEach(r=>{const p=m[String(r[k])];if(p)Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setConf:(k,v)=>{const h=T["설정"].find(r=>r["항목"]===k);if(h)h["값"]=v;else T["설정"].push({"항목":k,"값":v})}};
const must=(c,m)=>{if(!c){console.log("✗",m);process.exitCode=1;}else console.log("✓",m);};
const C=()=>Core.make(db,env);C().maintain();
db.setConf("상품권공개","Y");
T["교사"].push({"이메일":"lib@x","이름":"사서","담당":"관리자"});
T["명단"].push({"학번":"3101","이름":"가온","반":"3-1","동의":"y","도서부":""},{"학번":"3102","이름":"두리","반":"3-1","동의":"y","도서부":""},
  {"학번":"3103","이름":"세인","반":"3-1","동의":"y","도서부":"Y"});
const tok={};[["3101","가온"],["3102","두리"],["3103","세인"]].forEach(([h,n],i)=>{tok[h]=C().api("login",{role:"student",hakbun:h,name:n,agree:true,newPin:"41820"+i}).token;});
let atok=C().api("login",{role:"teacher",name:"사서",newPin:"518293"}).token;
const as=(who,op,p)=>{try{return C().api(op,Object.assign({_t:who==="adm"?atok:tok[who]},p||{}));}catch(x){return {ERR:x.message};}};
/* 선생님 도장 5개 = 별 1개(한 주 다섯 칸) */
let sid=0;function five(hb,monday){for(let i=0;i<5;i++){const d=new Date(Date.parse(monday+"T00:00:00Z")+(i%3+1)*864e5).toISOString().slice(0,10);
  T["도장"].push({"id":"d"+(sid++),"시각":d+" 10:"+String(i).padStart(2,"0")+":00","주":monday,"학번":hb,"이름":"","반":"3-1","사유":"선생님 도장","교사":"과학","취소":""});}}
five("3101","2026-10-12");five("3101","2026-10-19");five("3102","2026-10-19");
/* 관리자가 무지개 별 이벤트를 연다(다음 주) */
let ev=as("adm","eventSet",{name:"무지개 별 주간",way:"무지개",from:"2026-10-26",to:"2026-11-01",val:2,memo:"이 주에 생긴 별은 상품권 2장"});
must(!ev.ERR,"관리자: 무지개 별 이벤트 열기 "+(ev.ERR||""));
must(/2~5/.test(as("adm","eventSet",{name:"x",way:"무지개",from:"2026-10-26",to:"2026-11-01",val:9}).ERR||""),"무지개 값은 2~5");
const st=h=>as(h,"state");
let s=st("3101");
must(s.stars.shown===2&&s.stars.rainbow===0&&s.stars.rainbowEv&&!s.stars.rainbowEv.live,"이번 주: 별 2개(보통), 무지개 별 주간은 예정");
must(!(s.events||[]).some(e=>e.way==="무지개"),"시작 전에는 학생 이벤트 띠에 안 뜸");
/* 다음 주(무지개 별 주간)에 생긴 별 */
NOW=new Date("2026-10-27T03:00:00Z");five("3101","2026-10-26");five("3102","2026-10-26");
s=st("3101");
must(s.stars.shown===3&&s.stars.rainbow===1&&s.stars.rainbowEv.live&&s.stars.lastRainbow,"무지개 별 주간에 생긴 별은 무지개 별(별 3개 중 1개)");
must((s.events||[]).some(e=>e.way==="무지개"&&e.mul===2),"학생 이벤트 띠에 무지개 별 주간(1개 = 2장)");
/* 10/30(금) 수령: 보통 2 + 무지개 1×2 = 4매 */
NOW=new Date("2026-10-30T03:30:00Z");
let dk=as("3103","state").giftDesk,r1=dk.rows.find(x=>x.hakbun==="3101");
must(r1&&r1.stars===3&&r1.rainbow===1&&r1.vouchers===4,"도서부 명단: 별 3개(무지개 1) → 4매");
must(st("3101").giftNotice.mine.vouchers===4&&st("3101").giftNotice.mine.rainbow===1,"학생 수령 안내도 4매(무지개 1개)");
must(!as("3103","clubMark",{ids:["3101"],on:true}).ERR,"배부");
const pay=T["지급"].find(r=>r["학번"]==="3101");
must(pay["매수"]==="4"&&pay["별"]==="3","지급 시트: 매수 4 · 쓴 별 3개");
s=st("3101");must(s.stars.shown===0&&s.stars.rainbow===0,"받은 뒤 별 0개");
/* 이벤트가 끝난 뒤 생긴 별은 다시 1장 */
NOW=new Date("2026-11-04T03:00:00Z");five("3101","2026-11-02");
NOW=new Date("2026-11-06T03:30:00Z");
dk=as("3103","state").giftDesk;
const a1=dk.rows.find(x=>x.hakbun==="3101"),b1=dk.rows.find(x=>x.hakbun==="3102");
must(a1&&a1.stars===1&&a1.rainbow===0&&a1.vouchers===1,"이벤트 뒤에 생긴 별은 1장");
must(b1&&b1.stars===2&&b1.rainbow===1&&b1.vouchers===3,"못 받은 학생: 보통 1 + 무지개 1 → 3매(무지개 별은 그대로 2장짜리)");
/* 무르기 → 다시 배부해도 같은 계산 */
as("3103","clubMark",{ids:["3102"],on:true});as("3103","clubMark",{ids:["3102"],on:false});
must(st("3102").giftNotice.mine.vouchers===3,"무르면 별이 돌아와 다시 3매");
/* 2026-10-19 공지·이벤트 한 번만 넣기: 금요일 수령 안내는 바로, 무지개 별 주간은 10/26 부터 */
T["공지"].length=0;T["이벤트"].length=0;T["설정"]=T["설정"].filter(r=>r["항목"]!=="공지1019판");
NOW=new Date("2026-10-19T03:00:00Z");C().maintain();C().maintain();
must(T["공지"].filter(r=>/꼭 금요일/.test(r["제목"])).length===1&&T["공지"].filter(r=>/무지개/.test(r["제목"])).length===1&&T["이벤트"].filter(r=>r["방식"]==="무지개").length===1,"공지 둘·이벤트 하나를 한 번만 넣음");
const ns=h=>(st(h).notices||[]).map(n=>n.title).join(" | ");
must(/꼭 금요일/.test(ns("3101"))&&!/무지개/.test(ns("3101")),"이번 주: 금요일 수령 안내만 보이고 무지개 공지는 아직");
must(/2주 넘게/.test(T["공지"].find(r=>/꼭 금요일/.test(r["제목"]))["내용"])&&/검토/.test(T["공지"].find(r=>/꼭 금요일/.test(r["제목"]))["내용"]),"2주 넘게 안 찾아간 별은 '검토 중' 예고");
NOW=new Date("2026-10-26T00:30:00Z");
must(/무지개/.test(ns("3101"))&&!/꼭 금요일/.test(ns("3101")),"10/26 월요일: 무지개 별 주간 공지가 뜨고 지난주 안내는 내려감");
/* 배부한 뒤에도 명단에 무지개 별이 끼어 있었다는 표시 */
NOW=new Date("2026-10-30T03:30:00Z");
const paidRow=as("3103","state").giftDesk.rows.find(x=>x.hakbun==="3101");
must(paidRow&&paidRow.paid&&paidRow.vouchers===4&&paidRow.stars===3&&paidRow.rainbow===1,"배부한 줄도 '별 3개(무지개 1개) → 4매'");
/* 2026-10-19: 상품권으로 쓴 별은 '그때 이미 있던 별'에서만 뺀다 — 계산이 바뀌어 별이 모자라도, 받은 뒤 생긴 별은 남는다 */
T["도장"]=T["도장"].filter(r=>r["학번"]!=="3102");T["지급"]=T["지급"].filter(r=>r["학번"]!=="3102");
five("3102","2026-10-19");   /* 10/20 무렵 별 1개 */
T["지급"].push({"키":"2026-10-23|3102","월":"2026-10-23","학번":"3102","처리":"지급","시각":"2026-10-23 12:40:00","처리자":"도서부","매수":"2","별":"2"});   /* 그때 별 2개로 받았다고 기록됨(나중에 계산이 바뀐 상황) */
NOW=new Date("2026-11-04T03:00:00Z");five("3102","2026-11-02");   /* 받은 뒤 새 별 1개 */
must(st("3102").stars.shown===1,"받은 뒤 새로 생긴 별은 미리 쓴 것으로 치지 않고 남는다(별 1개)");
