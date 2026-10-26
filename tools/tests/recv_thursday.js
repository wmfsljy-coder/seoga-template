/* 이번 주만 목요일 수령(2026-10-21 회장님): 학교 일정으로 10/23(금) → 10/22(목).
   수령기간 줄을 한 번만 옮기고, 옛 '꼭 금요일' 공지는 내리고 새 공지 · 도서부 배부는 목요일에 열림 · 다음 주는 다시 금요일 */
const fs=require("fs");eval(fs.readFileSync(__dirname+"/../../core.gs","utf8")+";global.Core=Core;");
let NOW=new Date("2026-10-19T03:00:00Z");
const T={};Object.keys(Core.HEAD).forEach(t=>T[t]=[]);
const env={now:()=>NOW,email:()=>"",uid:()=>"u"+Math.random().toString(36).slice(2,8),hmac:s=>"h"+s,http:()=>{throw 1},mail:()=>{}};
const db={replace:(t,l)=>{T[t]=[];l.forEach(o=>db.add(t,o));},rows:t=>T[t],add:(t,o)=>{const r={};Core.HEAD[t].forEach(h=>r[h]=o[h]==null?"":String(o[h]));T[t].push(r)},addMany:(t,l)=>l.forEach(o=>db.add(t,o)),
  set:(t,k,v,p)=>T[t].forEach(r=>{if(String(r[k]).trim()===String(v))Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setMany:(t,k,m)=>T[t].forEach(r=>{const p=m[String(r[k])];if(p)Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setConf:(k,v)=>{const h=T["설정"].find(r=>r["항목"]===k);if(h)h["값"]=v;else T["설정"].push({"항목":k,"값":v})}};
const must=(c,m)=>{if(!c){console.log("✗",m);process.exitCode=1;}else console.log("✓",m);};
const C=()=>Core.make(db,env);
db.setConf("상품권공개","Y");
C().maintain();   /* 10/19: 금요일 수령 줄들 · '꼭 금요일' 공지 */
must(T["수령기간"].some(r=>r["시작"]==="2026-10-23"),"처음엔 10/23(금) 수령");
must(T["공지"].some(r=>r["제목"]==="이번 주 문화상품권은 꼭 금요일에 받아 가세요"),"'꼭 금요일' 공지가 있음");
T["교사"].push({"이메일":"lib@x","이름":"사서","담당":"관리자"});
T["명단"].push({"학번":"3101","이름":"가온","반":"3-1","동의":"y","도서부":""},{"학번":"3103","이름":"세인","반":"3-1","동의":"y","도서부":"Y"});
const tok={};[["3101","가온"],["3103","세인"]].forEach(([h,n],i)=>{tok[h]=C().api("login",{role:"student",hakbun:h,name:n,agree:true,newPin:"72831"+i}).token;});
const as=(who,op,p)=>{try{return C().api(op,Object.assign({_t:tok[who]},p||{}));}catch(x){return {ERR:x.message};}};
for(let i=0;i<5;i++)T["도장"].push({"id":"d"+i,"시각":"2026-10-20 10:0"+i+":00","주":"2026-10-19","학번":"3101","이름":"","반":"3-1","사유":"선생님 도장","교사":"과학","취소":""});
/* 10/21(수): 손질 → 목요일로 */
NOW=new Date("2026-10-21T01:00:00Z");C().maintain();C().maintain();
const R=T["수령기간"];
must(!R.some(r=>r["시작"]==="2026-10-23")&&R.some(r=>r["시작"]==="2026-10-22"&&r["끝"]==="2026-10-22"),"수령 날이 10/22(목)로");
must(R.some(r=>r["시작"]==="2026-10-30")&&R.some(r=>r["시작"]==="2026-11-06"),"다음 주부터는 다시 금요일");
must(T["공지"].find(r=>r["제목"]==="이번 주 문화상품권은 꼭 금요일에 받아 가세요")["숨김"]==="Y","옛 '꼭 금요일' 공지는 내림");
must(T["공지"].filter(r=>/목요일\(10월 22일\)로 바뀌었어요/.test(r["제목"])).length===1,"새 공지 하나(두 번 돌아도)");
let s=as("3101","state");
must((s.notices||[]).some(n=>/목요일/.test(n.title))&&!(s.notices||[]).some(n=>/꼭 금요일/.test(n.title)),"학생 공지: 목요일 공지만 보임");
must(s.conf.recvWeekly===true&&s.conf.recvOdd==="2026-10-22","학생 화면 설정: 매주 수령 그대로 + 이번에는 10/22");
must(s.giftNotice&&s.giftNotice.from==="2026-10-22","학생 수령 안내 날짜 10/22");
/* 도서부: 수요일엔 명단만, 목요일 점심엔 배부 */
let k=as("3103","state").giftDesk;
must(k&&!k.open&&k.from==="2026-10-22"&&!k.hidden,"10/21(수): 도서부 명단은 하루 전이라 보임, 배부 단추는 아직");
NOW=new Date("2026-10-22T03:30:00Z");
k=as("3103","state").giftDesk;
must(k&&k.open&&k.live&&k.rows.some(x=>x.hakbun==="3101"),"10/22(목) 점심: 배부 열림 · 실시간");
must(!as("3103","clubMark",{ids:["3101"],on:true}).ERR&&T["지급"].some(r=>r["월"]==="2026-10-22"),"목요일에 배부됨");
/* 10/23(금)에는 배부 날이 아님 */
NOW=new Date("2026-10-23T03:30:00Z");
k=as("3103","state").giftDesk;must(k&&!k.open&&k.from==="2026-10-30","10/23(금)은 수령 날 아님, 다음은 10/30");
must(as("3101","state").conf.recvOdd==="","다음 수령이 금요일이면 덧붙임 없음");
/* 이미 10/23에 준 기록이 있으면 옮기지 않음 */
T["수령기간"]=[{"시작":"2026-10-23","끝":"2026-10-23","메모":""}];T["지급"]=[{"월":"2026-10-23","학번":"3101","처리":"지급"}];
T["설정"]=T["설정"].filter(r=>r["항목"]!=="수령1022판");NOW=new Date("2026-10-21T01:00:00Z");C().maintain();
must(T["수령기간"][0]["시작"]==="2026-10-23","이미 준 기록이 있으면 그대로");
