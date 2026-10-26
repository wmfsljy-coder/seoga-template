const fs=require("fs");eval(fs.readFileSync(__dirname+"/../../core.gs","utf8")+";global.Core=Core;Core.CONF0.forEach(function(r){if(r[0]===\"로그인방식\")r[1]=\"구글\";});");
let NOW=new Date("2026-09-21T01:00:00Z");
const T={};Object.keys(Core.HEAD).forEach(t=>T[t]=[]);
T["문장"]=Core.QUOTES.slice(0,52).map(q=>({"문장":q[0],"출처":q[1],"종류":q[2],"숨김":""}));
const ok=x=>({code:200,text:JSON.stringify({status:"OK",data:x})});
const TOP=["우정","기억","바다","용기","도시","시간","가족","숲","별","편지","전쟁","음악","요리","로봇","우주","식물","고양이","철도","섬","시장"];
const http=reqs=>reqs.map(q=>{
  if(/category\/list/.test(q.url))return ok({categoryList:Core.GENRES.map(g=>({lCategoryCode:g[0]}))});
  if(/detail\/info\/isbn/.test(q.url)){const n=Number(/isbn=(\d+)/.exec(q.url)[1].slice(-6));const t=TOP[n%20],u=TOP[(n*7+3)%20];
    return ok({description:"예시 책 소개입니다. 주인공은 "+t+"에 얽힌 오래된 비밀을 따라가며 한 해 동안 조금씩 달라진다. 끝에서 밝혀지는 진실은 "+u+"에 대한 생각을 바꾸게 만든다.",keywordList:[t,u,"예시"+n]});}
  if(q.body&&q.body.categoryCode){const g=q.body.categoryCode.slice(0,3),pg=q.body.page;
    return ok({totalCount:q.body.display===1?700:300,bookList:Array.from({length:50},(_,k)=>({bookKey:"k"+g+pg+k,title:"책"+g+"-"+pg+"-"+String.fromCharCode(44032+k),author:"지은이"+g+pg+k+" 지음",pubFormCode:"MA",appendixYn:"N",pubYear:"2020",
      isbn:"979"+String(1e9+Number(g)*10000+pg*100+k),callNo:(100+(Number(g)*37+k*11)%800)+".6 가"+k+" c.2",categoryInfo:{mcode:g+"00"+(k%3)+"000",mdesc:"중분류"+(k%3)}}))});}
  if(q.body){const t=q.body.searchKeyword;return ok({totalCount:/^책/.test(t)?1:0,bookList:/^책/.test(t)?[{bookKey:"z"+t,title:t,author:"지은이 지음",callNo:"813.6 가1",isbn:""}]:[]});}
  return ok({status:"대출가능"});});
let EMAIL="lib@x";const env={now:()=>NOW,email:()=>EMAIL,uid:()=>Math.random().toString(36).slice(2,10),hmac:s=>s,http};
const db={rows:t=>T[t],add:(t,o)=>{const r={};Core.HEAD[t].forEach(h=>r[h]=o[h]==null?"":String(o[h]));T[t].push(r)},
  set:(t,k,v,p)=>T[t].forEach(r=>{if(String(r[k]).trim()===String(v))Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setMany:(t,k,m)=>T[t].forEach(r=>{const p=m[String(r[k])];if(p)Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setConf:(k,v)=>{const h=T["설정"].find(r=>r["항목"]===k);if(h)h["값"]=v;else T["설정"].push({"항목":k,"값":v})}};
T["교사"].push({"이메일":"lib@x","이름":"사서","담당":"전체"});
T["명단"].push({"학번":"30201","이름":"김","반":"3-2","이메일":"s@x","동의":"y"});
const C=()=>Core.make(db,env);
const conf=k=>(T["설정"].find(r=>r["항목"]===k)||{})["값"];

const must=(c,m)=>{if(!c){console.log("✗",m);process.exitCode=1;}else console.log("✓",m);};
/* 다음 주 문제 미리 정하기·선생님 바꾸기·한 주 10문제(2026-10-19 회장님)
   ① 다음 주 책은 이번 주 책과 겹치지 않게 ② 다음 주 문제를 미리 정해 보여 주고, 선생님이 안 바꾸면 월요일에 그대로 ③ 학생 문제가 많아도 10문제까지 */
C().tick();
const plan=()=>String(conf("다음주퀴즈책")||"").split("|");
const W0="2026-09-21",W1="2026-09-28",W2="2026-10-05";
const inWk=wk=>T["퀴즈"].filter(q=>q["상태"]==="출제"&&q["주"]===wk);
const books=wk=>[...new Set(inWk(wk).map(q=>q["책제목"]))];
must(inWk(W1).length===5,"다음 주(9/28) 문제 5개를 미리 정해 둠: "+inWk(W1).length);
must(books(W1).sort().join(";")===plan()[2].split(";").sort().join(";"),"미리 정한 문제는 다음 주 퀴즈 책으로");
must(books(W1).every(t=>books(W0).indexOf(t)<0),"이번 주 책과 겹치지 않음");
/* 겹치는 계획이 있으면 그 책만 바꾼다(이번 주 책은 그대로 이번 주) */
const p0=plan(),keepB=p0[2].split(";")[0];
db.setConf("다음주퀴즈책",W1+"|"+p0[1]+"|"+keepB+";"+books(W0)[0]);
C().tick();
const p1=plan()[2].split(";");
must(p1.includes(keepB)&&!p1.includes(books(W0)[0])&&p1.length===2,"이번 주 책과 겹친 다음 주 책은 다른 책으로 바뀜(나머지 책은 그대로): "+p1.join(", "));
must(books(W1).every(t=>p1.includes(t))&&inWk(W1).length===5,"미리 정한 문제도 바뀐 책으로 5개");
/* 선생님: 은행 문제 '다른 문제로' */
const tst=()=>{EMAIL="lib@x";return C().api("state");};
let s=tst();
must(s.nextQuiz&&s.nextQuiz.choices&&s.nextQuiz.choices.length>2&&s.nextQuiz.choices.every(t=>books(W0).indexOf(t)<0),"바꿀 책 목록(이번 주 책 빼고)");
const a1=inWk(W1).find(q=>q["출처"]==="자동");
C().api("quizSwap",{id:a1["id"]});
must(!inWk(W1).some(q=>q["id"]===a1["id"])&&inWk(W1).length===5,"다른 문제로 바꾸면 그 문제는 빠지고 다시 5개");
must(T["퀴즈"].find(q=>q["id"]===a1["id"])["상태"]==="교체","바꾼 문제는 다시 안 나옴(교체)");
/* 선생님: 책 바꾸기 */
const oldB=p1[1],newB=s.nextQuiz.choices.find(t=>!p1.includes(t));
C().api("quizNextBook",{from:oldB,to:newB});
must(plan()[2].split(";").includes(newB)&&!plan()[2].split(";").includes(oldB),"다음 주 책을 바꿈: "+oldB+" → "+newB);
must(!books(W1).includes(oldB)&&books(W1).includes(newB)&&inWk(W1).length===5,"그 책 문제도 새 책으로 5개");
let bad="";try{C().api("quizNextBook",{from:newB,to:books(W0)[0]});}catch(e){bad=e.message;}
/* 다음 주가 새 달(추천 도서가 월요일에 바뀌는 주)이면 이번 주 책은 그 달 목록에 없어 다른 말로 막힌다 */
must(/이번 주|그 달 추천 도서/.test(bad),"이번 주 책으로는 못 바꿈 ("+bad+")");
/* 학생: 다음 주 책으로 좋은 문제를 내면 곧바로 다음 주 미리 보기에(은행 문제를 하나 덜어 냄) */
const stuN=13;
for(let i=0;i<stuN;i++)T["명단"].push({"학번":String(30300+i),"이름":"학생"+i,"반":"3-3","이메일":"t"+i+"@x","동의":"y"});
const nb=plan()[2].split(";")[0];
const sub=i=>{EMAIL="t"+i+"@x";try{return C().api("quizSubmit",{book:nb,page:(10+i)+"쪽",q:(10+i)+"쪽에서 주인공이 처음 찾아간 곳은 어디인가요 "+i,o1:"바다"+i,o2:"산"+i,o3:"강"+i,o4:"들"+i,ans:(i%4)+1,why:(10+i)+"쪽에 나옵니다. 주인공이 처음 간 곳"});}catch(e){return {ERR:e.message};}};
let r0=sub(0);
must(r0.stamped,"학생 문제 도장(품질 기준 넘음)");
must(inWk(W1).some(q=>q["학번"]==="30300")&&inWk(W1).length===6&&inWk(W1).filter(q=>q["출처"]==="자동").length===5,"좋은 학생 문제는 곧바로 다음 주에 더해짐(기본 5문제 그대로 + 학생 1 = 6)");
for(let i=1;i<5;i++)sub(i);
must(inWk(W1).length===10&&inWk(W1).filter(q=>q["출처"]==="자동").length===5,"학생 5문제까지는 기본 5문제를 그대로 두고 더해 10문제");
sub(5);
must(inWk(W1).length===10&&inWk(W1).filter(q=>q["출처"]==="자동").length===4,"10문제가 넘으면 기본(자동) 문제 하나를 학생 문제로 바꿈");
for(let i=6;i<stuN;i++)sub(i);
const own=inWk(W1).filter(q=>q["출처"]!=="자동").length;
must(inWk(W1).length===10&&own===10,"학생 문제가 많아도 10문제까지(은행 문제는 모두 빠짐): "+inWk(W1).length);
const left=T["퀴즈"].find(q=>q["학번"]===String(30300+stuN-1));
EMAIL="lib@x";let cap="";try{C().api("quizPick",{id:left["id"],next:true});}catch(e){cap=e.message;}
must(left["상태"]==="대기"&&/10문제/.test(cap),"11번째는 대기로 남고 선생님도 못 넣음: "+cap);
/* 선생님이 학생 문제를 빼면 그 자리에 대기 중인 학생 문제나 은행 문제로 다시 */
const s1=inWk(W1).find(q=>q["출처"]!=="자동");
C().api("quizCheck",{id:s1["id"]});
must(inWk(W1).length===10&&!inWk(W1).some(q=>q["id"]===s1["id"]),"선생님이 뺀 자리는 다시 채움(10개)");
/* 월요일: 미리 보여 준 그대로 */
const ids=inWk(W1).map(q=>q["id"]).sort().join(",");
NOW=new Date("2026-09-28T00:30:00Z");C().tick();
must(inWk(W1).map(q=>q["id"]).sort().join(",")===ids,"월요일에 미리 보여 준 문제 그대로 출제");
must(inWk(W2).length===5&&books(W2).every(t=>books(W1).indexOf(t)<0),"그다음 주(10/5)도 미리 5문제, 이번 주 책과 겹치지 않게");
