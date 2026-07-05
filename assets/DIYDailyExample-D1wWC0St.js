const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/jszip.min-D8sN6T41.js","assets/vendor-CI4CKsaM.js"])))=>i.map(i=>d[i]);
import{u as v,b as k,j as E,N as C}from"./vendor-CI4CKsaM.js";import{f as A,a as L}from"./diyDailyData-BcI1kRKb.js";import{_ as M}from"./three-BP8UH71Q.js";async function y(o){if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(o);return}const t=document.createElement("textarea");t.value=o,t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)}function P(o,t){const e=URL.createObjectURL(o),n=document.createElement("a");n.href=e,n.download=t,document.body.appendChild(n),n.click(),document.body.removeChild(n),setTimeout(()=>URL.revokeObjectURL(e),1500)}async function U(o){const{default:t}=await M(async()=>{const{default:n}=await import("./jszip.min-D8sN6T41.js").then(r=>r.j);return{default:n}},__vite__mapDeps([0,1])),e=new t;return e.file("index.html",o),e.generateAsync({type:"blob"})}function S(o){return new URL(o,window.location.origin).toString().split("?")[0]}function D(){const{exampleId:o}=v(),t=A(o);return k.useEffect(()=>{if(!t)return;let e=!1;const n=L(t.id);return fetch(n).then(r=>{if(!r.ok)throw new Error(`Failed to load example: ${r.status}`);return r.text()}).then(r=>{if(e)return;const s=new DOMParser().parseFromString(r,"text/html").documentElement;if(!s)return;const l=document.adoptNode(s);document.replaceChild(l,document.documentElement),z({exampleId:t.id,html:r,sourceUrl:n})}).catch(()=>{e||window.location.replace(n)}),()=>{e=!0}},[t]),t?null:E.jsx(C,{to:"/clients/diy-daily",replace:!0})}function z({exampleId:o,html:t,sourceUrl:e}){if(document.getElementById("diy-export-root"))return;const n=S(e),r=document.createElement("style");r.id="diy-export-style",r.textContent=`
    #diy-export-root {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 2147483600;
      font: 500 13px/1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI',
        'Helvetica Neue', Arial, sans-serif;
      letter-spacing: 0.01em;
      color: #f7f4ed;
    }
    #diy-export-root *, #diy-export-root *::before, #diy-export-root *::after {
      box-sizing: border-box;
    }
    #diy-export-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: rgba(23, 47, 61, 0.92);
      color: #e7c97a;
      border: 0;
      border-radius: 999px;
      cursor: pointer;
      backdrop-filter: blur(6px) saturate(120%);
      -webkit-backdrop-filter: blur(6px) saturate(120%);
      box-shadow: 0 6px 22px -8px rgba(8, 18, 26, 0.55),
        0 1px 0 rgba(255, 255, 255, 0.06) inset;
      transition: transform 160ms ease, background 160ms ease;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      font-size: 11.5px;
    }
    #diy-export-pill:hover { background: rgba(31, 60, 76, 0.95); transform: translateY(-1px); }
    #diy-export-pill:focus-visible { outline: 2px solid #e7c97a; outline-offset: 3px; }
    #diy-export-pill svg { width: 12px; height: 12px; transition: transform 200ms ease; }
    #diy-export-root[data-open="true"] #diy-export-pill svg { transform: rotate(180deg); }
    #diy-export-menu {
      position: absolute;
      bottom: calc(100% + 10px);
      right: 0;
      min-width: 220px;
      padding: 6px;
      background: rgba(23, 47, 61, 0.96);
      backdrop-filter: blur(10px) saturate(120%);
      -webkit-backdrop-filter: blur(10px) saturate(120%);
      border-radius: 14px;
      box-shadow: 0 18px 40px -16px rgba(8, 18, 26, 0.6),
        0 1px 0 rgba(255, 255, 255, 0.06) inset;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transform: translateY(6px) scale(0.98);
      transform-origin: 100% 100%;
      pointer-events: none;
      transition: opacity 140ms ease, transform 160ms ease;
    }
    #diy-export-root[data-open="true"] #diy-export-menu {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .diy-export-action {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: transparent;
      border: 0;
      border-radius: 10px;
      color: #f7f4ed;
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition: background 120ms ease, color 120ms ease;
    }
    .diy-export-action:hover,
    .diy-export-action:focus-visible {
      background: rgba(231, 201, 122, 0.14);
      color: #e7c97a;
      outline: none;
    }
    .diy-export-action svg { width: 16px; height: 16px; flex: 0 0 16px; opacity: 0.85; }
    .diy-export-action span { flex: 1; }
    .diy-export-action small {
      color: rgba(247, 244, 237, 0.55);
      font-weight: 500;
      letter-spacing: 0.02em;
    }
    #diy-export-toast {
      position: absolute;
      bottom: calc(100% + 10px);
      right: 0;
      padding: 10px 14px;
      background: #e7c97a;
      color: #172f3d;
      font-weight: 600;
      letter-spacing: 0.04em;
      border-radius: 999px;
      box-shadow: 0 10px 24px -10px rgba(8, 18, 26, 0.5);
      opacity: 0;
      transform: translateY(6px);
      pointer-events: none;
      transition: opacity 160ms ease, transform 200ms ease;
    }
    #diy-export-toast.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
    @media print { #diy-export-root { display: none !important; } }
    @media (prefers-reduced-motion: reduce) {
      #diy-export-pill, #diy-export-menu, #diy-export-toast,
      #diy-export-pill svg { transition: none; }
    }
    @media (max-width: 480px) {
      #diy-export-root { right: 12px; bottom: 12px; }
      #diy-export-menu { min-width: 200px; }
    }
  `,document.head.appendChild(r);const a=document.createElement("div");a.id="diy-export-root",a.dataset.open="false";const s=document.createElement("div");s.id="diy-export-toast",s.setAttribute("role","status"),s.setAttribute("aria-live","polite");const l=document.createElement("div");l.id="diy-export-menu",l.setAttribute("role","menu"),l.setAttribute("aria-label","Export options");const w=[{id:"copy-url",label:"Copy URL",sub:"· for Mailchimp Import-from-URL",icon:T},{id:"copy-html",label:"Copy HTML",sub:"· paste into Code-your-own",icon:j},{id:"download-zip",label:"Download .zip",sub:"· Mailchimp template upload",icon:N}];for(const i of w){const d=document.createElement("button");d.type="button",d.className="diy-export-action",d.dataset.action=i.id,d.setAttribute("role","menuitem"),d.appendChild(h(i.icon));const c=document.createElement("span");c.textContent=`${i.label} `;const u=document.createElement("small");u.textContent=i.sub,c.appendChild(u),d.appendChild(c),l.appendChild(d)}const p=document.createElement("button");p.id="diy-export-pill",p.type="button",p.setAttribute("aria-haspopup","true"),p.setAttribute("aria-expanded","false"),p.appendChild(document.createTextNode("Export ")),p.appendChild(h(R)),a.appendChild(s),a.appendChild(l),a.appendChild(p),document.body.appendChild(a);let b=null;const f=i=>{a.dataset.open=i?"true":"false",p.setAttribute("aria-expanded",i?"true":"false")},m=i=>{s.textContent=i,s.classList.add("is-visible"),b&&clearTimeout(b),b=setTimeout(()=>{s.classList.remove("is-visible")},1900)};p.addEventListener("click",i=>{i.stopPropagation(),f(a.dataset.open!=="true")}),document.addEventListener("click",i=>{a.contains(i.target)||f(!1)}),document.addEventListener("keydown",i=>{i.key==="Escape"&&f(!1)}),l.addEventListener("click",async i=>{const d=i.target.closest("[data-action]");if(!d)return;const c=d.dataset.action;f(!1);try{if(c==="copy-url")await y(n),m("URL copied");else if(c==="copy-html")await y(t),m("HTML copied");else if(c==="download-zip"){m("Building zip…");const u=await U(t);P(u,`diy-daily-${o}.zip`),m("Zip downloaded")}}catch(u){m("Action failed"),console.warn("Export action failed",u)}})}const g="http://www.w3.org/2000/svg";function h(o){const t=document.createElementNS(g,"svg");t.setAttribute("viewBox","0 0 16 16"),t.setAttribute("fill","none"),t.setAttribute("aria-hidden","true");for(const e of o())t.appendChild(e);return t}function x(o,t={}){const e=document.createElementNS(g,"path");e.setAttribute("d",o),e.setAttribute("stroke","currentColor"),e.setAttribute("stroke-width","1.5"),e.setAttribute("stroke-linecap","round"),e.setAttribute("stroke-linejoin","round");for(const[n,r]of Object.entries(t))e.setAttribute(n,r);return e}function R(){return[x("M4 6.5l4 4 4-4",{"stroke-width":"1.6"})]}function T(){return[x("M6.5 9.5l3-3 M9 5h2a3 3 0 0 1 0 6H9 M7 11H5a3 3 0 0 1 0-6h2")]}function j(){return[x("M5 4.5L1.5 8 5 11.5 M11 4.5L14.5 8 11 11.5 M9.5 3l-3 10")]}function N(){const o=[x("M3 2h7l3 3v9H3V2z",{"stroke-width":"1.4"})];for(const t of[6,8,10,12])o.push(x(`M7.5 ${t}h1`,{"stroke-width":"1.2"}));return o}export{D as default};
