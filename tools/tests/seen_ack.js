/* 학생이 확인한 안내는 서버(안내확인)에 남아 어느 기기에서도 다시 안 뜸(2026-10-19 회장님) */
const fs=require("fs");eval(fs.readFileSync(__dirname+"/../../core.gs","utf8")+";global.Core=Core;Core.CONF0.forEach(function(r){if(r[0]==='로그인방식')r[1]='구글';});");
let NOW=new Date("2026-10-13T03:00:00Z"),EMAIL="lib@x";
const T={};Object.keys(Core.HEAD).forEach(t=>T[t]=[]);
const env={now:()=>NOW,email:()=>EMAIL,uid:()=>Math.random().toString(36).slice(2,10),hmac:s=>s,http:()=>{throw 1},mail:()=>{}};
const db={rows:t=>T[t],add:(t,o)=>{const r={};Core.HEAD[t].forEach(h=>r[h]=o[h]==null?"":String(o[h]));T[t].push(r)},addMany:(t,l)=>l.forEach(o=>db.add(t,o)),
  set:(t,k,v,p)=>T[t].forEach(r=>{if(String(r[k]).trim()===String(v))Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setMany:(t,k,m)=>T[t].forEach(r=>{const p=m[String(r[k])];if(p)Object.keys(p).forEach(c=>r[c]=String(p[c]))}),
  setConf:(k,v)=>{const h=T["설정"].find(r=>r["항목"]===k);if(h)h["값"]=v;else T["설정"].push({"항목":k,"값":v})}};
const C=()=>Core.make(db,env);C().maintain();
const must=(c,m)=>{if(!c){console.log("✗",m);process.exitCode=1;}else console.log("✓",m);};
T["교사"].push({"이메일":"lib@x","이름":"사서","담당":"관리자"});
T["명단"].push({"학번":"3101","이름":"가","반":"3-1","이메일":"s3101@x","동의":"2026-09-20 10:00:00"});
T["교사"].push({"이메일":"lib@x","이름":"사서","담당":"관리자"});
EMAIL="s3101@x";
let st=C().api("state",{});
must(Array.isArray(st.seen)&&st.seen.length===0,"처음엔 확인한 안내 없음");
must(C().api("seen",{key:"full|2026-10-12 08:00"}).ok,"반 전원 가입 '고마워요' 기록");
C().api("seen",{key:"full|2026-10-12 08:00"});C().api("seen",{key:"giftok|2026-10-23"});C().api("seen",{key:"guide"});
must(T["안내확인"].length===3,"같은 안내는 한 번만 남김(3줄)");
st=C().api("state",{});
must(["full|2026-10-12 08:00","giftok|2026-10-23","guide"].every(k=>st.seen.includes(k)),"다음 접속(다른 기기)에서도 확인한 안내 목록이 옴");
let bad="";try{C().api("seen",{key:"<script>"});}catch(e){bad=e.message;}
must(/알 수 없는/.test(bad),"이상한 키는 거절");
EMAIL="lib@x";must(C().api("seen",{key:"guide"}).ok&&T["안내확인"].length===3,"선생님은 남기지 않음");
/* 받은 별은 사라진다는 공지(10/19~10/26 사이 처음 손질 때 한 번) */
T["설정"]=T["설정"].filter(r=>r["항목"]!=="공지1019b판");NOW=new Date("2026-10-19T03:00:00Z");C().maintain();C().maintain();
must(T["공지"].filter(r=>/별이 사라져요/.test(r["제목"])).length===1,"'문화상품권을 받으면 그만큼 별이 사라져요' 공지 한 번");
