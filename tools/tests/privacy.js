/* 개인정보 동의(2026-10-19): 학습지원 소프트웨어 필수기준 체크리스트 9개 항목을 덮는지.
   1-1 최소처리 · 1-2 목적 · 1-3 항목·보유기간 · 2-1 안전조치 · 3-1 열람/정정/삭제/처리정지
   4-1 만14세 미만 법정대리인 · 5-1 보호책임자 · 5-2 제3자 제공 · 5-3 위·수탁 */
const fs=require("fs"),crypto=require("crypto");eval(fs.readFileSync(__dirname+"/../../core.gs","utf8")+";global.Core=Core;Core.CONF0.forEach(function(r){if(r[0]==='학교명')r[1]='한빛고등학교';if(r[0]==='추천묶음'||r[0]==='투표묶음')r[1]='2026-09~2026-10';});");
let NOW=new Date("2026-10-19T03:00:00Z"),EMAIL="";
const T={};Object.keys(Core.HEAD).forEach(t=>T[t]=[]);
const env={now:()=>NOW,email:()=>EMAIL,uid:()=>"u"+Math.random().toString(36).slice(2,8),hmac:s=>crypto.createHmac("sha256","testkey").update(String(s)).digest("hex"),http:()=>{throw 1},mail:()=>{}};
const db={replace:(t,l)=>{T[t]=[];l.forEach(o=>db.add(t,o));},rows:t=>T[t],add:(t,o)=>{const r={};Core.HEAD[t].forEach(h=>r[h]=o[h]==null?"":String(o[h]));T[t].push(r)},addMany:(t,l)=>l.forEach(o=>db.add(t,o)),
  set:(t,k,v,p)=>T[t].forEach(r=>{if(String(r[k]).trim()===String(v))Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setMany:(t,k,m)=>T[t].forEach(r=>{const p=m[String(r[k])];if(p)Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setConf:(k,v)=>{const h=T["설정"].find(r=>r["항목"]===k);if(h)h["값"]=v;else T["설정"].push({"항목":k,"값":v})}};
const C=()=>Core.make(db,env);C().maintain();
const must=(c,m)=>{if(!c){console.log("✗",m);process.exitCode=1;}else console.log("✓",m);};
const err=f=>{try{f();return "";}catch(e){return e.message;}};
T["교사"].push({"이름":"사서","담당":"관리자","이메일":"lib@x"});
T["명단"].push({"학번":"1101","이름":"가온","반":"1-1","이메일":"s1101@x"},
  {"학번":"1102","이름":"어린","반":"1-1","이메일":"s1102@x"},
  {"학번":"1103","이름":"받음","반":"1-1","이메일":"s1103@x","법정대리인":"Y"});

/* 시트·설정이 갖춰져 있다 */
must(Core.HEAD["명단"].indexOf("법정대리인")>=0,"명단 시트에 법정대리인 칸(4-1 증빙)");
const c0={};Core.CONF0.forEach(r=>c0[r[0]]=r[1]);
must(c0["개인정보담당"]&&c0["담당연락처"],"보호책임자와 연락처 설정(5-1)");
must(/졸업식|학년말/.test(c0["보유기간"]),"보유 기간 설정(1-3)");

/* 동의 화면에 내려보내는 값 */
const pc=C().api("login",{role:"student",hakbun:"1101",name:"가온"});
must(pc.need==="consent","처음 들어오면 동의 화면부터");
const pv=(C().pubConf?C().pubConf():null);
const st=(function(){EMAIL="lib@x";return C().api("state",{});})();
must(st.conf.privacy&&st.conf.privacy.owner&&st.conf.privacy.contact&&st.conf.privacy.school,
  "화면에 보호책임자·연락처·학교명을 내려보낸다");
must(st.conf.privacy.keep===c0["보유기간"],"보유 기간도 함께 내려보낸다");

/* 만 14세 미만: 법정대리인 동의서가 있어야 가입 */
let e1=err(()=>C().api("login",{role:"student",hakbun:"1102",name:"어린",agree:true,under14:true}));
must(/법정대리인/.test(e1),"만 14세 미만은 법정대리인 동의 없이는 막힌다: "+e1.slice(0,30));
must(!T["명단"].filter(r=>r["학번"]==="1102")[0]["동의"],"막혔으면 동의 시각도 남지 않는다");
let ok1=C().api("login",{role:"student",hakbun:"1103",name:"받음",agree:true,under14:true});
must(ok1.need==="setpin","동의서를 받은 만 14세 미만 학생은 통과");
let ok2=C().api("login",{role:"student",hakbun:"1101",name:"가온",agree:true,under14:false});
must(ok2.need==="setpin","만 14세 이상은 그대로 통과");

/* 동의해야 참여할 수 있다(거부할 권리 — 불이익 없음, 참여만 제한) */
const pin="481526";
C().api("login",{role:"student",hakbun:"1101",name:"가온",agree:true,newPin:pin});
must(!!T["명단"].filter(r=>r["학번"]==="1101")[0]["동의"],"동의 시각이 명단에 남는다(1-2 증빙)");

/* PIN 은 원문으로 저장하지 않는다(2-1 안전조치) */
const row=T["명단"].filter(r=>r["학번"]==="1101")[0];
must(row["핀"]&&row["핀"].indexOf(pin)<0,"PIN 원문은 저장하지 않는다");
must(T["기기"].every(d=>/^[0-9a-f]{64}$/.test(String(d["토큰"]))),"기기 토큰도 섞어서 저장(원문 아님)");
/* 처리방침이 체크리스트 9개 항목을 모두 덮는지 — 화면 글을 직접 본다 */
const page=fs.readFileSync(__dirname+"/../../index.html","utf8");
[["1-1 최소처리","모으지 않습니다"],["1-2 목적","수집하는 항목과 목적"],["1-3 보유기간","보유·이용 기간"],
 ["2-1 안전조치","안전하게 지키는 방법"],["3-1 열람·정정·삭제·처리정지","열람·정정·삭제·처리정지"],
 ["4-1 만14세 미만","만 14세 미만 학생"],["5-1 보호책임자","개인정보 보호책임자"],
 ["5-2 제3자 제공","제3자 제공"],["5-3 위·수탁","처리 위탁"]].forEach(function(x){
  must(page.indexOf(x[1])>=0,"처리방침에 "+x[0]+" 조항이 있다");
});
must(/제1조|제9조/.test(page),"조문 번호가 붙어 있다(증빙에 '제○조'로 적을 수 있게)");
