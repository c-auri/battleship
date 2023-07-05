(()=>{"use strict";var t,e,n,i,r,s=function(t,e,n,i){if("a"===n&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!i:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?i:"a"===n?i.call(t):i?i.value:e.get(t)},a=function(t,e,n,i,r){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!r)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!r:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?r.call(t,n):r?r.value=n:e.set(t,n),n};class o{static get minLength(){return s(o,t,"f",e)}static get maxLength(){return s(o,t,"f",n)}constructor(l){if(i.set(this,void 0),r.set(this,void 0),l<s(o,t,"f",e)||l>s(o,t,"f",n))throw new Error("Ship length out of bounds: "+l);a(this,i,l,"f"),a(this,r,0,"f")}get length(){return s(this,i,"f")}get isSunk(){return s(this,i,"f")<=s(this,r,"f")}hit(){var t;this.isSunk||a(this,r,(t=s(this,r,"f"),++t),"f")}}t=o,i=new WeakMap,r=new WeakMap,e={value:1},n={value:5};var l,c,h,u,d,f,p,m,w,g=function(t,e,n,i){if("a"===n&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!i:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?i:"a"===n?i.call(t):i?i.value:e.get(t)},y=function(t,e,n,i,r){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!r)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!r:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?r.call(t,n):r?r.value=n:e.set(t,n),n};class v{static get Size(){return g(v,c,"f",h)}constructor(){l.add(this),u.set(this,void 0),d.set(this,void 0),y(this,u,[],"f"),y(this,d,[],"f");for(let t=0;t<g(v,c,"f",h);t++){const t=[];for(let e=0;e<g(v,c,"f",h);e++)t.push({shipId:-1,isFog:!0,isClear:!1});g(this,d,"f").push(t)}}get ships(){return g(this,u,"f")}get allAreSunk(){return g(this,u,"f").every((t=>t.isSunk))}randomize(t){for(const e of t){const t=new o(e);let n,i,r;do{n=Math.round(9*Math.random()),i=Math.round(9*Math.random()),r=Math.random()>.5?"horizontal":"vertical"}while(!g(this,l,"m",m).call(this,t,n,i,r));this.place(t,n,i,r)}}isShip(t,e){return g(this,d,"f")[t][e].shipId>=0}getState(t,e){g(this,l,"m",w).call(this,t,e);const n=g(this,d,"f")[t][e];return n.isFog?"fog":-1===n.shipId?"water":g(this,u,"f")[n.shipId].isSunk?"sunk":"hit"}place(t,e,n,i){if(g(this,l,"m",w).call(this,e,n),!g(this,l,"m",m).call(this,t,e,n,i))throw new Error(`Invalid ship placement: ${e}, ${n}`);g(this,u,"f").push(t);const r=g(this,u,"f").length-1;for(let s=0;s<t.length;s++)"horizontal"===i?g(this,d,"f")[e+s][n].shipId=r:g(this,d,"f")[e][n+s].shipId=r}attack(t,e){g(this,l,"m",w).call(this,t,e);const n=g(this,d,"f")[t][e];if(!n.isFog)throw new Error(`Cell already received an attack: ${t}, ${e}`);if(n.isFog=!1,n.shipId<0)return;const i=g(this,u,"f")[n.shipId];i.hit(),i.isSunk&&g(this,l,"m",f).call(this,t,e)}}function S(t,e,n){return function(t,e,n){const i=Math.min(...k(t));return function(t,e,n){return e>0&&n>0&&L(t,e-1,n-1)||e>0&&n<v.Size-1&&L(t,e-1,n+1)||n>0&&e<v.Size-1&&L(t,e+1,n-1)||e<v.Size-1&&n<v.Size-1&&L(t,e+1,n+1)}(t,e,n)||0===b(t,e,n,i)}(t,e,n)?-1/0:function(t,e,n){return e>0&&L(t,e-1,n)||n>0&&L(t,e,n-1)||e<v.Size-1&&L(t,e+1,n)||n<v.Size-1&&L(t,e,n+1)}(t,e,n)?1/0:function(t,e,n){let i=0;for(const r of k(t))i+=b(t,e,n,r)*r;return i}(t,e,n)}function b(t,e,n,i){if(i<o.minLength||i>o.maxLength)throw new Error("Length out of bounds: "+i);const r=Math.max(0,e-i+1),s=Math.max(0,n-i+1),a=Math.min(9,e+i-1),l=Math.min(9,n+i-1);let c=0,h=0;for(let e=r;e<=a;e++){const i=t.getState(e,n);"fog"===i||"hit"===i?c=++h>c?h:c:h=0}const u=Math.max(0,c-i+1);c=0,h=0;for(let n=s;n<=l;n++){const i=t.getState(e,n);"fog"===i||"hit"===i?c=++h>c?h:c:h=0}const d=Math.max(0,c-i+1);return Math.max(0,u+d)}function k(t){return t.ships.filter((t=>!t.isSunk)).map((t=>t.length))}function L(t,e,n){return"hit"===t.getState(e,n)}function x(t,e,n,i){const r=function(t,e,n){return t.find((t=>t.getAttribute("data-x")===""+e&&t.getAttribute("data-y")===""+n))}(e,n,i),s=t.getState(n,i);"hit"!==s&&"sunk"!==s||r.classList.add("cell--hit"),"sunk"===s&&E(t,e,r),"water"===s&&r.classList.add("cell--water"),r.classList.add("cell--cleared"),r.classList.remove("cell--clickable")}function E(t,e,n){n.classList.contains("cell--sunk")||(n.classList.add("cell--cleared"),n.classList.remove("cell--clickable"),n.classList.contains("cell--hit")?(n.classList.add("cell--sunk"),e.filter((t=>function(t,e){const n=t.getAttribute("data-x"),i=t.getAttribute("data-y"),r=e.getAttribute("data-x"),s=e.getAttribute("data-y");return Math.abs(+n-+r)<=1&&Math.abs(+i-+s)<=1}(n,t))).forEach((n=>E(t,e,n)))):n.classList.contains("water")||n.classList.add("cell--water"))}function M(t,e){e.innerHTML="";for(let n=0;n<t.length;n++){const i=document.createElement("div");i.classList.add("ship"),i.setAttribute("data-id",""+n),e.appendChild(i);for(let e=0;e<t[n].length;e++){const t=document.createElement("div");t.classList.add("square"),i.appendChild(t)}}}function A(t,e){for(let n=0;n<t.length;n++)t[n].isSunk&&e.querySelector(`.ship[data-id="${n}"`).classList.add("ship--sunk")}c=v,u=new WeakMap,d=new WeakMap,l=new WeakSet,f=function t(e,n){const i=g(this,d,"f")[e][n];if(!i.isClear&&(i.isFog=!1,i.isClear=!0,i.shipId>=0))for(const i of g(this,l,"m",p).call(this,e,n))g(this,l,"m",t).call(this,i.x,i.y)},p=function(t,e){const n=[];return t>0&&n.push({x:t-1,y:e}),t<g(v,c,"f",h)-1&&n.push({x:t+1,y:e}),e>0&&n.push({x:t,y:e-1}),e<g(v,c,"f",h)-1&&n.push({x:t,y:e+1}),t>0&&e>0&&n.push({x:t-1,y:e-1}),t>0&&e<g(v,c,"f",h)-1&&n.push({x:t-1,y:e+1}),t<g(v,c,"f",h)-1&&e<g(v,c,"f",h)-1&&n.push({x:t+1,y:e+1}),t<g(v,c,"f",h)-1&&e>0&&n.push({x:t+1,y:e-1}),n},m=function(t,e,n,i){const r="horizontal"===i;if(r&&e+t.length>g(v,c,"f",h)||!r&&n+t.length>g(v,c,"f",h))return!1;for(let i=-1;i<=t.length;i++)for(let t=-1;t<=1;t++){let s;try{s=r?g(this,d,"f")[e+i][n+t]:g(this,d,"f")[e+t][n+i]}catch(t){continue}if((null==s?void 0:s.shipId)>=0)return!1}return!0},w=function(t,e){if(t<0||e<0||t>=g(v,c,"f",h)||e>=g(v,c,"f",h))throw new Error(`Invalid coordinate: ${t}, ${e}`)},h={value:10};const z=document.querySelector("#player-board"),I=document.querySelector("#player-ships");let C;const T=document.querySelector("#computer-board"),q=document.querySelector("#computer-ships");let $;function P(t){const e=t.target;var n,i;e.classList.contains("cell--clickable")&&(n=+e.getAttribute("data-x"),i=+e.getAttribute("data-y"),D.attack(n,i),function(t,e,n){x(t,$,e,n),A(t.ships,q)}(D,n,i),D.allAreSunk?J():function(){const t=function(t){const e=[];let n=-1/0;for(let i=0;i<v.Size;i++)for(let r=0;r<v.Size;r++)if("fog"===t.getState(i,r)){const s=S(t,i,r);n=Math.max(n,s),e.push({x:i,y:r,evaluation:s})}return e.filter((t=>t.evaluation===n)).map((({x:t,y:e})=>({x:t,y:e})))}(Y),{x:e,y:n}=function(t){const e=t.length-1,n=t[Math.round(Math.random()*e)];return{x:n.x,y:n.y}}(t);Y.attack(e,n),function(t,e,n){x(t,C,e,n),A(t.ships,I)}(Y,e,n),Y.allAreSunk&&J()}())}const F=document.getElementById("game-over-dialog"),W=document.getElementById("close-button"),j=document.getElementById("result"),B=document.getElementById("new-game-button");W.addEventListener("click",(()=>null==F?void 0:F.close())),B.addEventListener("click",(function(){null==F||F.close(),G()}));const H=[5,4,3,3,2,2];let Y,D;function G(){Y=new v,D=new v,Y.randomize(H),D.randomize(H),function(t){z.innerHTML="";for(let e=0;e<v.Size;e++)for(let n=0;n<v.Size;n++){const i=document.createElement("div");i.classList.add("cell"),i.setAttribute("data-x",""+n),i.setAttribute("data-y",""+e),t.isShip(n,e)&&(i.classList.add("cell--ship"),i.classList.add("cell--player")),null==z||z.appendChild(i)}M(t.ships,I),C=Array.from(z.querySelectorAll(".cell"))}(Y),function(t){T.innerHTML="";for(let t=0;t<v.Size;t++)for(let e=0;e<v.Size;e++){const n=document.createElement("div");n.classList.add("cell"),n.setAttribute("data-x",""+e),n.setAttribute("data-y",""+t),n.classList.add("cell--clickable"),n.addEventListener("click",P),null==T||T.appendChild(n)}M(t.ships,q),$=Array.from(T.querySelectorAll(".cell"))}(D)}function J(){if(Y.allAreSunk&&D.allAreSunk)throw Error("Indecisive game result");var t;$.forEach((t=>t.classList.remove("cell--clickable"))),t=D.allAreSunk,null==F||F.showModal(),j.textContent=t?"You won!":"You lost!"}G()})();
//# sourceMappingURL=main.69e4e79d94589097aceb.js.map