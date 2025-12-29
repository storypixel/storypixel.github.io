(() => {
  const palette = [
    [0x0d, 0x2b, 0x45],
    [0x20, 0x3c, 0x56],
    [0x54, 0x4e, 0x68],
  ];

  const stops = [
    { t: 0.0, color: palette[0] },
    { t: 0.5, color: palette[1] },
    { t: 1.0, color: palette[2] },
  ];

  const pixelSize = 4;
  const maxWidth = 240;
  const maxHeight = 160;

  const canvas = document.createElement("canvas");
  canvas.id = "pixel-bg";
  canvas.setAttribute("aria-hidden", "true");

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function sampleStops(t) {
    const clamped = clamp(t, 0, 1);
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i];
      const b = stops[i + 1];
      if (clamped >= a.t && clamped <= b.t) {
        const local = (clamped - a.t) / (b.t - a.t);
        return [
          lerp(a.color[0], b.color[0], local),
          lerp(a.color[1], b.color[1], local),
          lerp(a.color[2], b.color[2], local),
        ];
      }
    }
    return stops[stops.length - 1].color;
  }

  function nearestColor(r, g, b) {
    let best = palette[0];
    let bestDist = Infinity;
    for (const [pr, pg, pb] of palette) {
      const dr = r - pr;
      const dg = g - pg;
      const db = b - pb;
      const dist = dr * dr + dg * dg + db * db;
      if (dist < bestDist) {
        bestDist = dist;
        best = [pr, pg, pb];
      }
    }
    return best;
  }

  function noise(x, y) {
    const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return value - Math.floor(value);
  }

  let offsetX = 0;
  let offsetY = 0;
  const FRAME_INTERVAL = 90;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function render(dx = 0, dy = 0) {
    const width = Math.min(maxWidth, Math.ceil(window.innerWidth / pixelSize));
    const height = Math.min(maxHeight, Math.ceil(window.innerHeight / pixelSize));
    canvas.width = width;
    canvas.height = height;

    if (!canvas.isConnected) {
      document.body.prepend(canvas);
    }

    const data = new Float32Array(width * height * 3);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const nx = width > 1 ? x / (width - 1) : 0;
        const ny = height > 1 ? y / (height - 1) : 0;
        const jitter = (noise(x, y) - 0.5) * 0.14;
        const t = clamp((nx + dx) * 0.55 + (ny + dy) * 0.45 + jitter, 0, 1);
        const [r, g, b] = sampleStops(t);
        const idx = (y * width + x) * 3;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
      }
    }

    const out = new Uint8ClampedArray(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 3;
        const r = clamp(data[idx], 0, 255);
        const g = clamp(data[idx + 1], 0, 255);
        const b = clamp(data[idx + 2], 0, 255);
        const [nr, ng, nb] = nearestColor(r, g, b);
        const outIdx = (y * width + x) * 4;
        out[outIdx] = nr;
        out[outIdx + 1] = ng;
        out[outIdx + 2] = nb;
        out[outIdx + 3] = 255;

        const errR = r - nr;
        const errG = g - ng;
        const errB = b - nb;

        if (x + 1 < width) {
          const i = (y * width + (x + 1)) * 3;
          data[i] += errR * (7 / 16);
          data[i + 1] += errG * (7 / 16);
          data[i + 2] += errB * (7 / 16);
        }
        if (y + 1 < height) {
          if (x > 0) {
            const i = ((y + 1) * width + (x - 1)) * 3;
            data[i] += errR * (3 / 16);
            data[i + 1] += errG * (3 / 16);
            data[i + 2] += errB * (3 / 16);
          }
          const i = ((y + 1) * width + x) * 3;
          data[i] += errR * (5 / 16);
          data[i + 1] += errG * (5 / 16);
          data[i + 2] += errB * (5 / 16);

          if (x + 1 < width) {
            const j = ((y + 1) * width + (x + 1)) * 3;
            data[j] += errR * (1 / 16);
            data[j + 1] += errG * (1 / 16);
            data[j + 2] += errB * (1 / 16);
          }
        }
      }
    }

    const imageData = new ImageData(out, width, height);
    ctx.putImageData(imageData, 0, 0);
  }

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => render(offsetX, offsetY), 120);
  });

  function animate(time) {
    if (!motionQuery.matches && time - lastFrame >= FRAME_INTERVAL) {
      offsetX = Math.sin(time * 0.00005) * 0.08;
      offsetY = Math.cos(time * 0.00004) * 0.08;
      render(offsetX, offsetY);
      lastFrame = time;
    }
    requestAnimationFrame(animate);
  }

  let lastFrame = 0;
  document.addEventListener("DOMContentLoaded", () => {
    render(0, 0);
    requestAnimationFrame(animate);
  });
})();
