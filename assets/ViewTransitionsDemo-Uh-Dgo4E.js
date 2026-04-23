import{b as a,j as e}from"./vendor-D4QWGx82.js";import{I as s}from"./IsolatedFrame-BCqEn53j.js";const i=typeof document<"u"&&typeof document.startViewTransition=="function",l=()=>{if(typeof navigator>"u")return"your browser";const t=navigator.userAgent;return/Firefox\//.test(t)?"Firefox":/Edg\//.test(t)?"Edge":/Chrome\//.test(t)?"Chrome":/Safari\//.test(t)?"Safari":"your browser"},c=[{id:1,color:"#ef4444",title:"Red"},{id:2,color:"#f59e0b",title:"Amber"},{id:3,color:"#10b981",title:"Emerald"},{id:4,color:"#3b82f6",title:"Blue"},{id:5,color:"#8b5cf6",title:"Violet"},{id:6,color:"#ec4899",title:"Pink"}],m=`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
    :root { color-scheme: dark; }
    html, body {
        margin: 0;
        padding: 0;
        min-height: 100%;
        background: #0a0a0a;
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    }
    body { padding: 2rem; box-sizing: border-box; }
    h2 { font-size: 1.5rem; font-weight: 400; margin: 0 0 0.5rem 0; }
    p.lede { color: #aaa; margin: 0 0 2rem 0; font-size: 0.95rem; max-width: 60ch; }
    code { background: rgba(255,255,255,0.06); padding: 0.1em 0.35em; border-radius: 3px; font-size: 0.9em; }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1rem;
        max-width: 1000px;
    }
    .tile {
        aspect-ratio: 1;
        border-radius: 12px;
        border: none;
        color: #fff;
        font-family: inherit;
        font-size: 0.9rem;
        cursor: pointer;
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
        padding: 1rem;
    }

    .detail-wrap { max-width: 1000px; }
    .back {
        background: transparent;
        border: 1px solid rgba(255,255,255,0.2);
        color: #fff;
        padding: 0.5rem 1rem;
        border-radius: 999px;
        font-size: 0.85rem;
        cursor: pointer;
        font-family: inherit;
        margin-bottom: 1.5rem;
    }
    .detail-img {
        width: 100%;
        aspect-ratio: 16/9;
        border-radius: 16px;
    }
    .detail-title { font-size: 2rem; font-weight: 400; margin: 1.5rem 0 0.5rem 0; }
    .detail-body { color: #aaa; margin: 0; }

    /* View transition tuning: disable the root cross-fade so only the hero element morphs. */
    ::view-transition-old(root),
    ::view-transition-new(root) {
        animation: none;
    }
    ::view-transition-group(hero) {
        animation-duration: 0.4s;
        animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    }
    .tile.active, .detail-img { view-transition-name: hero; }
</style>
</head>
<body>
<div id="app"></div>
<script>
    const images = ${JSON.stringify(c)};

    const app = document.getElementById('app');
    let active = null;

    function el(tag, props = {}, children = []) {
        const node = document.createElement(tag);
        for (const [k, v] of Object.entries(props)) {
            if (k === 'style') node.setAttribute('style', v);
            else if (k === 'class') node.className = v;
            else if (k === 'dataset') Object.assign(node.dataset, v);
            else if (k === 'onClick') node.addEventListener('click', v);
            else node.setAttribute(k, v);
        }
        for (const child of children) {
            if (child == null) continue;
            node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
        }
        return node;
    }

    function parseHtml(html) {
        const t = document.createElement('template');
        t.innerHTML = html;
        return t.content;
    }

    function renderGrid() {
        app.replaceChildren();
        app.appendChild(el('h2', {}, ['Click a tile']));
        const lede = el('p', { class: 'lede' });
        // Static copy with one <code> element; safe to construct in pieces.
        lede.append(
            'The tile morphs into the detail view via ',
            el('code', {}, ['document.startViewTransition()']),
            '. The browser diffs the DOM and animates position, size, and contents between matching ',
            el('code', {}, ['view-transition-name']),
            ' elements.'
        );
        app.appendChild(lede);

        const grid = el('div', { class: 'grid' });
        for (const img of images) {
            const btn = el('button', {
                class: 'tile',
                style: 'background: ' + img.color + ';',
                dataset: { id: String(img.id) },
                onClick: () => go(img.id, btn),
            }, [img.title]);
            grid.appendChild(btn);
        }
        app.appendChild(grid);
    }

    function renderDetail() {
        const img = images.find(i => i.id === active);
        app.replaceChildren();
        const wrap = el('div', { class: 'detail-wrap' });
        wrap.appendChild(el('button', { class: 'back', onClick: () => go(null) }, ['← Back to grid']));
        wrap.appendChild(el('div', {
            class: 'detail-img',
            style: 'background: ' + img.color + ';',
        }));
        wrap.appendChild(el('h2', { class: 'detail-title' }, [img.title]));
        const body = el('p', { class: 'detail-body' });
        body.append(
            'This element shares a ',
            el('code', {}, ['view-transition-name']),
            ' with the tile you clicked. The browser captured the old position, the new position, and morphed between them.'
        );
        wrap.appendChild(body);
        app.appendChild(wrap);
    }

    function render() {
        if (active === null) renderGrid(); else renderDetail();
    }

    function go(next, clickedEl) {
        if (!document.startViewTransition) {
            active = next;
            render();
            return;
        }
        // Only tag the clicked tile as "hero" so the browser pairs exactly
        // that tile with the detail image — no other tiles get animated.
        if (clickedEl) clickedEl.classList.add('active');
        document.startViewTransition(() => {
            active = next;
            render();
        });
    }

    render();
<\/script>
</body>
</html>`,h=()=>{const[t,d]=a.useState(!1);a.useEffect(()=>{if(typeof window>"u"||!window.matchMedia)return;const n=window.matchMedia("(prefers-reduced-motion: reduce)"),r=()=>d(n.matches);return r(),n.addEventListener("change",r),()=>n.removeEventListener("change",r)},[]);const o=l();return e.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",color:"#fff",background:"#0a0a0a"},children:[(!i||t)&&e.jsxs("div",{style:{padding:"0.75rem 1rem",background:i?"rgba(245, 158, 11, 0.12)":"rgba(239, 68, 68, 0.12)",border:i?"1px solid rgba(245, 158, 11, 0.4)":"1px solid rgba(239, 68, 68, 0.4)",color:i?"#fcd34d":"#fca5a5",margin:"1rem 2rem 0",borderRadius:"6px",fontSize:"0.9rem",flexShrink:0},children:[!i&&e.jsxs(e.Fragment,{children:[o," does not implement ",e.jsx("code",{children:"document.startViewTransition"}),". Demo still works, but without the morph. Needs Chrome/Edge 111+ or Safari 18+."]}),i&&t&&e.jsxs(e.Fragment,{children:["Your OS has ",e.jsx("strong",{children:"Reduce Motion"})," enabled, so ",o," is skipping the transition animation. Turn it off in System Settings → Accessibility → Display to see the morph."]})]}),e.jsx("div",{style:{flex:1,minHeight:0},children:e.jsx(s,{html:m,title:"View Transitions demo"})})]})};export{h as default};
