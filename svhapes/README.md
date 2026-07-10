# Svhapes

Smooth, copyable CSS shapes for people and coding agents. The misspelling is intentional.

Svhapes turns normalized anchor points into responsive CSS `shape()` contours using a closed Catmull–Rom-to-cubic-Bézier conversion. That keeps joins tangent-continuous while letting authors work with meaningful edge points instead of hand-tuning control handles.

**Demo:** [iamnotsam.com/svhapes](https://iamnotsam.com/svhapes/)

**Catalog:** [`dist/catalog.json`](./dist/catalog.json)

**Agent entrypoint:** [`llms.txt`](./llms.txt)

## Include the CSS

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/storypixel/svhapes@v0.1.0/dist/svhapes.min.css"
>
```

```html
<div class="svhape-shadow">
  <div class="svhape svhape--golden-tide svhape--padded">
    Your content
  </div>
</div>
```

- `svhape` applies the safe fallback and progressive enhancement.
- `svhape--golden-tide` selects a catalog shape.
- `svhape--padded` uses the shape's conservative safe inset.
- `svhape-shadow` belongs on a parent because `clip-path` clips ordinary box shadows.
- `svhape--desktop-only` returns to the rounded fallback below 640px.

Browse all 18 stable IDs in the [demo](https://iamnotsam.com/svhapes/) or run the CLI.

## Copy one shape instead

Every catalog entry has `snippets.standaloneCss`, a complete class containing both its rounded fallback and `@supports` enhancement. The demo's **CSS** button copies that form.

```bash
node bin/svhapes.js css golden-tide
```

## JavaScript API

```js
import { pointsToShape } from 'svhapes';

const clipPath = pointsToShape([
  [5, 8], [50, 3], [95, 8],
  [98, 50], [94, 92], [50, 97],
  [6, 92], [2, 50],
]);

element.style.clipPath = clipPath;
```

For a direct browser import:

```js
import { pointsToShape } from 'https://cdn.jsdelivr.net/gh/storypixel/svhapes@v0.1.0/dist/svhapes.js';
```

Useful exports:

- `pointsToShape(points, options)`
- `catmullRomToBezier(points, options)`
- `measureTangentContinuity(segments)`
- `makeEdgeShape(config)`
- `makeRadialShape(config)`
- `shapeToCss(shape, options)`
- `definitions` and `getDefinition(id)`

Coordinates use a `0..100` percentage reference box. `tension` ranges from `0` for the standard smooth conversion to `1`, which collapses the control handles onto their anchors and produces straight segments. Output precision defaults to three decimals.

`shapeToCss()` accepts generated `shape()` values, simple class selectors, and numeric CSS radius values. It rejects declaration delimiters and compound selector syntax; it is a serializer for developer-authored geometry, not a general-purpose CSS sanitizer.

## CLI and agents

Install directly from GitHub or use a clone:

```bash
npm install github:storypixel/svhapes
npx svhapes list --family frame --capacity dense
npx svhapes show golden-tide --format json
npx svhapes css golden-tide --shadow
npx svhapes prompt golden-tide --format json
```

Machine output is deterministic and wrapped in a stable envelope. The generated catalog publishes:

- Stable shape IDs and classes
- Family, use, aspect, capacity, balance, and edge-activity metadata
- Conservative safe insets
- Complete CSS paths and standalone snippets
- Source digests and curve settings
- Fixed agent prompts that prohibit invented paths

Agents should read [`llms.txt`](./llms.txt), then query [`dist/catalog.json`](./dist/catalog.json). They should not scrape the visual demo.

## Browser behavior

The CSS `shape()` function is a modern `<basic-shape>` value used by `clip-path`. Percentage coordinates remain responsive to the element's reference box. Svhapes wraps advanced clipping in `@supports`; older browsers receive the published `border-radius` fallback. See the [CSS Shapes specification](https://www.w3.org/TR/css-shapes/#shape-function) and [MDN's `shape()` reference](https://developer.mozilla.org/docs/Web/CSS/basic-shape/shape).

The silhouette must never be the only carrier of meaning. Keep interactive focus treatment on inner controls or an unclipped wrapper.

## Develop

```bash
npm run build
npm test
npm run check
npm run pack:check
```

Edit `src/definitions.js`, not generated files in `dist/`. See [`AGENTS.md`](./AGENTS.md) for contribution contracts.

## License

MIT © Sam Wilson
