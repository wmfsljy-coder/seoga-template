/* 반 대항 도장(2026-10-20 회장님): 10/26~11/1 참여 인원이 가장 많은 반 · 글이 가장 많은 반은 반 학생 모두에게 만능 도장 1개씩.
   같으면 모두 · 끝난 다음 날(11/2 월) 들어감 · 손질 때 결과를 '당첨' 칸에 적어 두면 그 뒤로 안 움직임 */
const fs=require("fs");eval(fs.readFileSync(__dirname+"/../../core.gs","utf8")+";global.Core=Core;");
let NOW=new Date("2026-10-20T03:00:00Z");
const T={};Object.keys(Core.HEAD).forEach(t=>T[t]=[]);
const env={now:()=>NOW,email:()=>"",uid:()=>"u"+Math.random().toString(36).slice(2,8),hmac:s=>"h"+s,http:()=>{throw 1},mail:()=>{}};
const db={replace:(t,l)=>{T[t]=[];l.forEach(o=>db.add(t,o));},rows:t=>T[t],add:(t,o)=>{const r={};Core.HEAD[t].forEach(h=>r[h]=o[h]==null?"":String(o[h]));T[t].push(r)},addMany:(t,l)=>l.forEach(o=>db.add(t,o)),
  set:(t,k,v,p)=>T[t].forEach(r=>{if(String(r[k]).trim()===String(v))Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setMany:(t,k,m)=>T[t].forEach(r=>{const p=m[String(r[k])];if(p)Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setConf:(k,v)=>{const h=T["설정"].find(r=>r["항목"]===k);if(h)h["값"]=v;else T["설정"].push({"항목":k,"값":v})}};
const must=(c,m)=>{if(!c){console.log("✗",m);process.exitCode=1;}else console.log("✓",m);};
const C=()=>Core.make(db,env);
/* 10/20 손질: 이벤트 둘 + 공지 하나(공지는 10/26부터), 두 번 돌아도 한 번만 */
C().maintain();C().maintain();
must(T["이벤트"].filter(r=>r["방식"]==="반인원"&&r["시작"]==="2026-10-26").length===1&&T["이벤트"].filter(r=>r["방식"]==="반글"&&r["시작"]==="2026-10-26").length===1,"10/26~11/1 반인원·반글 이벤트를 한 번만 넣음");
must(T["공지"].filter(r=>/반 대항/.test(r["제목"])&&r["시작"]==="2026-10-20").length===1,"반 대항 공지는 이번 주(10/20)부터 하나");
/* 먼저 10/26 으로 들어가 있던 공지도 10/20 으로 당겨짐 */
T["공지"].forEach(r=>{if(/반 대항/.test(r["제목"]))r["시작"]="2026-10-26";});T["설정"]=T["설정"].filter(r=>r["항목"]!=="공지1020b판");C().maintain();
must(T["공지"].find(r=>/반 대항/.test(r["제목"]))["시작"]==="2026-10-20","이미 들어간 공지도 10/20부터로 당김");
/* 먼저 1개로 들어가 있던 이벤트·공지를 2개로 */
T["이벤트"].forEach(r=>{if(r["시작"]==="2026-10-26"&&r["방식"]!=="무지개")r["보상"]="1";});
T["공지"].forEach(r=>{if(/반 대항/.test(r["제목"])){r["제목"]="🏆 반 대항(10/26~11/1) — 이긴 반은 모두 만능 도장 1개";r["내용"]="… 이긴 반은 반 학생 모두에게 만능 도장 1개씩(두 가지 다 이기면 2개)! 같으면 모두 상을 받고, 도장은 11월 2일(월) 아침에 들어가요. …";}});
T["설정"]=T["설정"].filter(r=>r["항목"]!=="반대항2개판");C().maintain();
const nt=T["공지"].find(r=>/반 대항/.test(r["제목"]));
must(/2개$/.test(nt["제목"])&&/2개씩\(두 가지 다 이기면 4개\)/.test(nt["내용"])&&/9일\(월\)/.test(nt["내용"]),"이미 들어간 공지도 2개로 고침");
must(T["이벤트"].filter(r=>r["시작"]==="2026-10-26"&&r["방식"]!=="무지개").every(r=>r["보상"]==="2"),"이미 들어간 이벤트 보상도 2");
T["교사"].push({"이메일":"lib@x","이름":"사서","담당":"관리자"});
const kids=[["3101","3-1"],["3102","3-1"],["3103","3-1"],["3201","3-2"],["3202","3-2"],["3301","3-3"],["3302","3-3"]];
kids.forEach(([h,c])=>T["명단"].push({"학번":h,"이름":"학생"+h,"반":c,"동의":"y","도서부":""}));
const tok={};kids.forEach(([h],i)=>{tok[h]=C().api("login",{role:"student",hakbun:h,name:"학생"+h,agree:true,newPin:"5182"+String(30+i)}).token;});
let atok=C().api("login",{role:"teacher",name:"사서",newPin:"518293"}).token;
const as=(who,op,p)=>{try{return C().api(op,Object.assign({_t:who==="adm"?atok:tok[who]},p||{}));}catch(x){return {ERR:x.message};}};
must(/3개/.test(as("adm","eventSet",{name:"x",way:"반글",from:"2026-10-26",to:"2026-11-01",prize:5}).ERR||""),"반 모두 도장은 3개까지");
let pid=0;const post=(hb,cls,at,st)=>T["글"].push({"id":"p"+(pid++),"시각":at,"주":"2026-10-26","종류":"label","학번":hb,"이름":"","반":cls,"책제목":"책"+pid,"상태":st||"posted"});
/* 기간 전 글은 안 셈 */
post("3201","3-2","2026-10-25 12:00:00");post("3202","3-2","2026-10-25 12:00:00");post("3201","3-2","2026-10-25 13:00:00");
NOW=new Date("2026-10-27T03:00:00Z");
/* 3-1: 한 명이 세 편(글 3 · 인원 1) / 3-2: 두 명이 한 편씩(글 2 · 인원 2) / 3-3: 한 명 글 한 편 + 한 명 퀴즈(글 1 · 인원 2) */
post("3101","3-1","2026-10-26 09:00:00");post("3101","3-1","2026-10-27 09:00:00");post("3101","3-1","2026-10-27 10:00:00");
post("3102","3-1","2026-10-27 10:30:00","pending");
post("3201","3-2","2026-10-26 10:00:00");post("3202","3-2","2026-10-27 10:00:00");
post("3301","3-3","2026-10-27 11:00:00");
T["퀴즈응답"].push({"주":"2026-10-26","학번":"3302","점수":"1","시각":"2026-10-27 11:30:00","차수":"1","문항수":"5"});
let s=as("3201","state");
const e1=(s.events||[]).find(e=>e.way==="반인원"),e2=(s.events||[]).find(e=>e.way==="반글");
must(e1&&e1.mine===2&&e1.best===2&&e1.rank===1&&e1.lead.join()==="3-2,3-3","진행 중 · 참여왕: 3-2·3-3 둘 다 2명(퀴즈 푼 학생도 셈) "+JSON.stringify(e1&&e1.lead));
must(e2&&e2.mine===2&&e2.best===3&&e2.rank===2&&e2.lead.join()==="3-1","진행 중 · 글왕: 3-1 3편, 우리 반(3-2) 2등 2편(기간 전·대기 글은 안 셈)");
must(!(as("3101","state").week.stamps||[]).some(x=>x.k==="classwin"),"끝나기 전에는 도장 없음");
/* 끝난 날(11/1)에도 아직 없음 */
NOW=new Date("2026-11-01T10:00:00Z");
must(!(as("3201","state").week.stamps||[]).some(x=>x.k==="classwin"),"11/1(끝나는 날)에도 아직 없음");
/* 11/2 월요일: 손질이 결과를 적어 둠 → 도장 */
NOW=new Date("2026-11-02T00:30:00Z");C().maintain();
const r1=T["이벤트"].find(r=>r["방식"]==="반인원"),r2=T["이벤트"].find(r=>r["방식"]==="반글");
must(r1["당첨"]==="3-2, 3-3"&&r2["당첨"]==="3-1","당첨 칸: 참여왕 3-2, 3-3 · 글왕 3-1 ("+r1["당첨"]+" / "+r2["당첨"]+")");
const cw=h=>(as(h,"state").week.stamps||[]).filter(x=>x.k==="classwin");
must(T["이벤트"].filter(r=>r["시작"]==="2026-10-26"&&r["방식"]!=="무지개").every(r=>r["보상"]==="2"),"10/26 반 대항 둘 다 보상 2개");
must(cw("3101").length===1&&cw("3102").length===1&&cw("3103").length===1,"11/2 주: 3-1 학생 셋 모두(글 안 쓴 학생도) 첫째 만능 도장(1/2)");
must(cw("3201").length===1&&cw("3301").length===1&&cw("3302").length===1,"3-2·3-3 학생 모두 첫째(같은 1등)");
must(/\(1\/2\)/.test(cw("3201")[0].t||""),"도장 이름에 (1/2)");
must(/참여 가장 많은 반/.test(cw("3201")[0].t||""),"도장 이름: 참여 가장 많은 반 · "+(cw("3201")[0].t||""));
/* 뒤에 글이 내려가도 결과는 그대로 */
T["글"].forEach(r=>{if(r["학번"]==="3101")r["상태"]="hidden";});
must(cw("3101").length===1,"적어 둔 결과는 뒤에 글이 내려가도 그대로");
/* 다음 주(11/9 주)에 둘째 */
NOW=new Date("2026-11-10T03:00:00Z");
must(cw("3101").length===1&&/\(2\/2\)/.test(cw("3101")[0].t||""),"11/9 주에 둘째 만능 도장(2/2)");
NOW=new Date("2026-11-02T00:30:00Z");
/* 관리자 화면 */
const ad=as("adm","state");const ae=(ad.events||[]).find(e=>e.way==="반글");
must(ae&&ae.won==="3-1"&&ae.rank&&ae.rank.length===3,"관리자 이벤트 목록에 결과와 순위");
/* 아무도 안 했으면 상 없음 */
T["이벤트"].length=0;T["글"].length=0;T["퀴즈응답"].length=0;
NOW=new Date("2026-11-03T03:00:00Z");
as("adm","eventSet",{name:"빈 주",way:"반인원",from:"2026-11-03",to:"2026-11-04",prize:1});
NOW=new Date("2026-11-05T03:00:00Z");C().maintain();
must(T["이벤트"][0]["당첨"]==="없음"&&!cw("3101").length,"아무도 참여 안 하면 '없음', 도장 없음");
