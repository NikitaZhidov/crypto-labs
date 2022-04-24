(()=>{var n={57:(n,t,e)=>{const o=e(466),{generatePrime:r,isPrime:i,modExp:u,getCountBitsOfNumber:l}=e(210);n.exports={generateG:function(n){let t,e,s,c;c=r(256);do{e=o(n),s=e*c+1n}while(!i(s));let f=l(s);do{a=o(f-1),t=u(a,e,s)}while(1n===t);return{g:t,q:c,p:s}},diffieHellman:function(n,t,e,o){return u(n,t%e,o)}}},210:(n,t,e)=>{const o=e(466);function r(n){const t=[2n,3n,5n,7n,11n,13n,17n,19n,23n,29n,31n,37n,41n,43n,47n,53n,59n,61n,67n,71n,73n,79n,83n,89n,97n,101n,103n,107n,109n,113n,127n,131n,137n,139n,149n,151n,157n,163n,167n,173n,179n,181n,191n,193n,197n,199n,211n,223n,227n,229n,233n,239n,241n,251n,257n,263n,269n,271n,277n,281n,283n,293n,307n,311n,313n,317n,331n,337n,347n,349n,353n,359n,367n,373n,379n,383n,389n,397n,401n,409n,419n,421n,431n,433n,439n,443n,449n,457n,461n,463n,467n,479n,487n,491n,499n,503n,509n,521n,523n,541n];for(const e of t)if(n%e==0)return n==e;return i(n,20)}function i(n,t){let e=n-1n,o=-1,r=[];do{o+=1,r.push(e%2n),e/=2n}while(e>0n);for(let e=0;e<t;e++){if(a=u(2,Number.MAX_VALUE),l(a,n)[0]>1n)return!1;var i=1n;for(let t=o;t>=0;t--){let e=i;if(1==(i=i*i%n)&&1n!=e&&e!=n-1n)return!1;1n==r[t]&&(i=i*a%n)}if(1!=i)return!1}return!0}function u(n,t){const e=Math.floor(Math.random()*(t-n+1)+n);return BigInt(e)}function l(n,t){if(0n==t)return[n,1n,0n];let e,o,r;return[e,o,r]=l(t,n%t),[e,r,o-n/t*r]}function s(n){let t=0;for(;n>0n;)n>>=1n,t++;return t}n.exports={extendedEuclid:l,randomIntFromInterval:u,modExp:function n(t,e,o){let r;return 0n==e?1n:e%2n==0n?(r=n(t,e/2n,o),r*r%o):(r=n(t,(e-1n)/2n,o),r=r*r%o,t*r%o)},rabinMiller:i,isPrime:r,generatePrime:function(n){let t;do{t=o(n),t=2n*t-1n}while(!r(t));return t},getCountBitsOfNumber:s,getRandomBigInt:function(n){const t=s(n);return o(t)}}},466:(n,t,e)=>{"use strict";n.exports=r;const{randomBytes:o}=e(939);function r(n,t){if(n<0)throw new RangeError("bits < 0");const e=(n>>>3)+!!(7&n),r=(1<<8-(8*e-n))-1;if(t)return function(n,t,e){o(n,((n,o)=>{if(n)return e(n);i(t,o),e(null,u(o))}))}(e,r,t);const l=o(e);return i(r,l),u(l)}function i(n,t){t.length>0&&(t[0]&=n)}function u(n){let t=0n;const e=n.length;if(e>=8){const o=new DataView(n.buffer,n.byteOffset);for(let n=0,r=-8&e;n<r;n+=8)t=(t<<64n)+o.getBigUint64(n,!1)}for(let o=-8&e;o<e;o++)t=256n*t+BigInt(n[o]);return t}r.test={bytes2bigint:u}},939:()=>{}},t={};function e(o){var r=t[o];if(void 0!==r)return r.exports;var i=t[o]={exports:{}};return n[o](i,i.exports,e),i.exports}(()=>{const{getCountBitsOfNumber:n}=e(210),{diffieHellman:t}=e(57),o=io();let r=null,i=null,u=null;const l=function(n){if(n.preventDefault(),s.value){if(isNaN(s.value))return;o.emit("chat message",s.value),s.value=""}};let s=null,c=null,f={g:null,p:null,q:null,x:null};o.on("init",(function(n){f.g=BigInt(n.g),f.p=BigInt(n.p),f.q=BigInt(n.q)})),o.on("keys-exchange",(function(){r=function(){const{p:e,q:o,g:r}=f,i=n(e);return f.x=function(n){const t=new Uint8Array(Math.ceil(n/4));window.crypto.getRandomValues(t);const e=t.reduce(((n,t)=>n+("00"+t.toString(16)).slice(-2)),"");return BigInt("0x"+e)}(i),console.log("x",f.x),t(r,f.x,o,e)}().toString(),console.log("first-stage-key",r),o.emit("first-stage-key",r)})),o.on("first-stage-key",(function(n){const e=BigInt(n),{x:o,q:a,p:g}=f;c=t(e,o,a,g),console.log("private_key",c),function(){const n=`\n\t\t<h1>1st stage key: ${r}</h1>\n\t\t<h1 style="border-bottom: 1px solid #000;">Key: ${c}</h1>\n\t\t`;document.body.innerHTML=n,u=document.getElementById("form"),s=document.getElementById("input"),i=document.getElementById("messages"),u.addEventListener("submit",l)}()})),o.on("no-two-connections",(()=>{u&&(u.removeEventListener("submit",l),document.body.innerHTML='<h1 style="display: flex; justify-content: center; align-items: center; height: 100vh;">Wait for a partner to connect...</h1>;')})),o.on("chat message",(function(n){var t=document.createElement("li");t.textContent=n,i.appendChild(t),window.scrollTo(0,document.body.scrollHeight)}))})()})();