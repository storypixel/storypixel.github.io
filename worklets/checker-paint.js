class CheckerPainter {
    static get inputProperties() {
        return ['--checker-size', '--checker-hue', '--checker-warp'];
    }

    paint(ctx, geom, props) {
        const size = parseInt(props.get('--checker-size').toString()) || 20;
        const hue = parseInt(props.get('--checker-hue').toString()) || 220;
        const warp = parseFloat(props.get('--checker-warp').toString()) || 0;

        const cols = Math.ceil(geom.width / size) + 1;
        const rows = Math.ceil(geom.height / size) + 1;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const on = (r + c) % 2 === 0;
                const phase = Math.sin((r * 0.4 + c * 0.4)) * warp;
                const x = c * size + phase * size * 0.5;
                const y = r * size + phase * size * 0.5;
                const s = size - 1;
                const light = on ? 55 : 18;
                const sat = on ? 70 : 40;
                const h = (hue + (r * 4 + c * 4)) % 360;
                ctx.fillStyle = `hsl(${h}, ${sat}%, ${light}%)`;
                ctx.fillRect(x, y, s, s);
            }
        }
    }
}

registerPaint('checker', CheckerPainter);
