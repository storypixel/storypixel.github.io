import{b as l,j as e,m as n,L as c}from"./vendor-D4QWGx82.js";import{N as m,p as h}from"./index-oNIHUdaz.js";import{C as x,a as o,u as y}from"./three-BVmfxcVG.js";const v=()=>{const t=l.useRef(),a=l.useMemo(()=>({uTime:{value:0},uColor1:{value:new o("#1a1a2e")},uColor2:{value:new o("#4a90a4")},uColor3:{value:new o("#7b68ee")},uColor4:{value:new o("#20b2aa")},uColor5:{value:new o("#2d1b69")}}),[]),s=`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,r=`
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        uniform vec3 uColor5;
        varying vec2 vUv;

        // Simplex-style noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                               -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                dot(x12.zw, x12.zw)), 0.0);
            m = m * m;
            m = m * m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
            vec3 g;
            g.x = a0.x * x0.x + h.x * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        void main() {
            float t = uTime * 0.08;

            // Layered noise for organic movement
            float n1 = snoise(vUv * 2.0 + vec2(t * 0.7, t * 0.5));
            float n2 = snoise(vUv * 3.5 + vec2(-t * 0.4, t * 0.8));
            float n3 = snoise(vUv * 1.5 + vec2(t * 0.3, -t * 0.6));

            // Blend noise into UV distortion
            vec2 distorted = vUv + vec2(n1 * 0.15, n2 * 0.15);

            // Create gradient regions
            float region1 = smoothstep(0.0, 1.0, distorted.x + n3 * 0.3);
            float region2 = smoothstep(0.0, 1.0, distorted.y + n1 * 0.3);
            float region3 = smoothstep(0.2, 0.8, sin(distorted.x * 3.14 + t) * 0.5 + 0.5);

            // Mix colors through regions
            vec3 color = mix(uColor1, uColor2, region1);
            color = mix(color, uColor3, region2 * 0.6);
            color = mix(color, uColor4, region3 * 0.4);
            color = mix(color, uColor5, (n1 * 0.5 + 0.5) * 0.3);

            // Subtle vignette
            float vignette = 1.0 - length((vUv - 0.5) * 1.2);
            vignette = smoothstep(0.0, 0.7, vignette);
            color *= 0.85 + vignette * 0.15;

            gl_FragColor = vec4(color, 1.0);
        }
    `;return y((p,d)=>{t.current&&(t.current.material.uniforms.uTime.value+=d)}),e.jsxs("mesh",{ref:t,children:[e.jsx("planeGeometry",{args:[2,2]}),e.jsx("shaderMaterial",{vertexShader:s,fragmentShader:r,uniforms:a})]})},g=()=>(l.useEffect(()=>(document.body.style.backgroundColor="transparent",()=>{document.body.style.backgroundColor=""}),[]),e.jsx("div",{style:{position:"fixed",inset:0,width:"100vw",height:"100vh",zIndex:0},children:e.jsx(x,{camera:{position:[0,0,1],fov:90},gl:{antialias:!1,alpha:!1},dpr:[1,1.5],children:e.jsx(v,{})})})),i=({title:t,children:a,delay:s,illustration:r})=>e.jsxs(n.div,{className:"content-grid about-section-block",initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{delay:s,duration:.8},style:{paddingTop:"4rem",paddingBottom:"4rem",borderTop:"1px solid var(--border-color)",borderBottom:"1px solid var(--border-color)",position:"relative",overflow:"hidden"},children:[e.jsx("h3",{className:"section-label",children:t}),e.jsx("div",{className:"section-content",style:{display:"flex",flexDirection:"column",gap:"1.5rem",maxWidth:"50ch",position:"relative",zIndex:1},children:a}),r&&e.jsx("img",{src:r,alt:"",className:"section-illustration",style:{position:"absolute",bottom:"-15%",right:"5%",width:"400px",height:"auto",opacity:1,pointerEvents:"none",filter:"brightness(0)"}})]}),w=()=>e.jsxs(e.Fragment,{children:[e.jsx(g,{}),e.jsxs("article",{style:{minHeight:"100vh",paddingBottom:"10vh",position:"relative",zIndex:1,background:"transparent"},children:[e.jsx(m,{}),e.jsxs("div",{style:{paddingTop:"8rem"},children:[e.jsx("div",{className:"page-grid",style:{marginBottom:"4rem"},children:e.jsx(n.h1,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.8,ease:[.16,1,.3,1]},style:{gridColumn:"1 / -1",fontSize:"clamp(3rem, 6vw, 5rem)",lineHeight:1.1,fontWeight:400},children:"Facts."})}),e.jsx("div",{style:{padding:"0 var(--spacing-container)",marginBottom:"6rem",maxWidth:"65ch"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3rem"},children:[e.jsxs(n.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.3,duration:.8},children:[e.jsx("p",{style:{fontSize:"1.25rem",lineHeight:1.6,marginBottom:"1.5rem"},children:"I am Sam Wilson, a creative technologist living in Austin, Texas. The calligraphy on the office whiteboards is my fault."}),e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.6,marginBottom:"1.5rem"},children:"I work at H-E-B Digital where I help craft online experiences which connect our customers to their goals. It is a wonderful place to work because people genuinely just want to do right by the customers."}),e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.6},children:"My real name is Jeremy. My grandmother just called me Sam so much I thought it was my name."})]}),e.jsxs(n.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.4,duration:.8},children:[e.jsx("h3",{style:{fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"1.5rem",color:"var(--text-secondary)"},children:"Expertise"}),e.jsxs("ul",{style:{listStyle:"none",display:"flex",flexDirection:"column",gap:"0.75rem",fontSize:"1rem"},children:[e.jsx("li",{children:"Android Development"}),e.jsx("li",{children:"iOS / Swift Development"}),e.jsx("li",{children:"React & Vue"}),e.jsx("li",{children:"User Experience"}),e.jsx("li",{children:"Web Development"})]})]}),e.jsxs(n.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.5,duration:.8},children:[e.jsx("h3",{style:{fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"1.5rem",color:"var(--text-secondary)"},children:"Contact"}),e.jsx("a",{href:"mailto:sam@iamnotsam.com",style:{fontSize:"1rem",textDecoration:"underline",textUnderlineOffset:"3px"},children:"sam@iamnotsam.com"})]})]})}),e.jsxs("div",{style:{padding:"0 var(--spacing-container)"},children:[e.jsxs(i,{title:"Code",delay:.1,illustration:"/images/flash.svg",children:[e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.7},children:"Even in the editor, I have the user in mind. JavaScript is the means, but good experience is always my goal. Currently enjoying React, Vue, WebAssembly, Mithril, and Android development."}),e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.7},children:"I started app development at a concierge kiosk startup in 2001. My Flash interface was in local news footage. I was over the moon."}),e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.7},children:"In 2004 I transitioned from Flash to JavaScript, HTML, and CSS. About ten years later I was hired to EllisLab's small remote team. There is something to be said for the pocket cultures within the tech and design space. I learned a lot and met some great folks."})]}),e.jsxs(i,{title:"Random",delay:.2,illustration:"/images/puff.svg",children:[e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.7},children:"I used to have a dog named Puff and he had issues with chronic licking."}),e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.7},children:"In my early twenties, most nights I'd lose track of time while working. Afterwards I'd go to Wendy's because it was next to the office, and get a burger and fries. One day I was doing pull-ups casually and passed out. This was the moment that got me into fitness and nutrition."}),e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.7},children:"The sun makes me sneeze. This is called Photic Sneeze Reflex. I don't think of it as a problem though, sneezing rules."})]}),e.jsxs(i,{title:"Creative Habits",delay:.3,illustration:"/images/fig8.svg",children:[e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.7},children:"For me, the harder the creative work is to start, the less likely it is I'll do it. It's why I love calligraphy. It's easy to do something cool quickly."}),e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.7},children:"Cooking, especially baking, is something I really enjoy and a creative outlet. My best cookies involve sage and apricot."}),e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.7},children:"One of my happy spaces is Figure 8 coffee shop, and not just because I'm addicted to three espressos per diem. Which I totally am."})]}),e.jsxs(i,{title:"Recreation",delay:.4,illustration:"/images/motorcycle.svg",children:[e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.7},children:"Exercise is underrated. Training from Jhonphillip Yonan (not a misspelling) gave me back the command of my body."}),e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.7},children:"I broke my wrist skateboarding down a long hill in Glasgow, Kentucky. This was a hard way to learn about the power of the long tail."}),e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.7},children:"I play on a dodgeball team in Austin Social Sports League."}),e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.7},children:"I am not Sam, but I go by that name and I make apps and stuff on the internet. Thanks for visiting my site."})]}),e.jsxs(i,{title:"Writing",delay:.5,children:[e.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.7},children:"Older posts live here. AI roundups, a cookie recipe I have been making since 2004, and whatever else was on my mind that week."}),e.jsx("ul",{style:{listStyle:"none",padding:0,display:"flex",flexDirection:"column",gap:"0.75rem",marginTop:"0.5rem"},children:h.map(t=>e.jsx("li",{children:e.jsxs(c,{to:`/thoughts/${t.slug}`,style:{display:"flex",justifyContent:"space-between",gap:"1.5rem",paddingBottom:"0.5rem",borderBottom:"1px solid var(--border-color)",fontSize:"0.95rem"},children:[e.jsx("span",{children:t.title}),e.jsx("span",{style:{color:"var(--text-secondary)",flexShrink:0},children:t.dateDisplay})]})},t.slug))}),e.jsx(c,{to:"/thoughts",style:{display:"inline-block",marginTop:"0.5rem",fontSize:"0.9rem",borderBottom:"1px solid #444",paddingBottom:"4px"},children:"All writing"})]})]})]})]})]});export{w as default};
