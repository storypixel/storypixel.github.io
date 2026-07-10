# Product

## Register

brand

## Users

Three audiences, per the PRD: visual builders browsing and copying shapes without reading math; front-end developers including the CSS or importing the ESM generator; and coding agents consuming llms.txt, catalog.json, and the CLI. The demo page at iamnotsam.com/svhapes/ is the shop window for all three: a person lands, understands the library in seconds, copies a working snippet.

## Product Purpose

Svhapes turns smooth organic CSS `shape()` contours into a small public library: 18 curated silhouettes, a Catmull-Rom-to-Bézier generator, and agent-grade metadata. It exists so interesting container shapes stop being trapped in one-off demos. Success: someone includes one file or copies one card and ships a shape without adopting a framework.

## Brand Personality

Technical-minimal, precise, quietly funny. The engineering is the aesthetic: deterministic math, tangent continuity, stable IDs. Voice stays deadpan and confident ("No pointy little nipples", "shape() without the shape anxiety") inside an austere, instrument-like frame. Three words: precise, sparse, wry.

## Visual Direction (2026-07 restyle)

Reference: essential.com (Nothing's Essential). Confirmed choices:
- Flat light-gray canvas, near-black ink, strictly monochrome surfaces.
- Shapes render in near-black/grays with 1-bit halftone dither fills; exactly one yellow accent shape per view.
- Headlines in Doto (dot-matrix, Google Fonts) as the legal ndot stand-in; everything else Geist Mono, including 9px uppercase micro-captions.
- Recompose toward sparse, centered composition with big whitespace and tiny technical captions; keep all existing sections and copy.

## Anti-references

- The previous warm-cream editorial look with serif display type and six loud shape fills (being replaced).
- Generic SaaS component-library sites: gradient heroes, identical feature-card grids, glassmorphism.
- Dark-mode developer-tool cosplay; this stays light and paper-like.

## Design Principles

1. The shapes are the imagery. No illustrations, no screenshots; every visual is a live rendered svhape.
2. Instrument, not brochure. Captions read like spec labels; numbers and IDs are visible, monospaced, exact.
3. One accent, spent deliberately. A single yellow element per view; everything else earns attention through form.
4. Copy-paste is the hero action. Every shape's HTML/CSS/agent prompt is one click away, always visible, never buried.
5. Practice what we preach: the page itself uses svhapes clips and passes its own fallback story (rounded corners when shape() is unsupported).

## Accessibility & Inclusion

- Contrast: near-black on light gray passes AA for body; muted gray captions reserved for non-essential labels at large-enough sizes.
- Dot-matrix display font is decorative-tier: never used for body or instructions; real text under it stays selectable mono.
- Respect prefers-reduced-motion: scroll/hover effects degrade to static.
- Keyboard: all copy buttons and filters focusable with visible focus rings.
