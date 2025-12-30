(() => {
  console.log("Vector field script loading...");

  // WebGL-based flow field inspired by fieldplay
  // Using your color palette
  const colors = [
    [84/255, 78/255, 104/255, 0.8],   // #544e68
    [141/255, 105/255, 122/255, 0.7], // #8d697a
    [208/255, 129/255, 89/255, 0.6],  // #d08159
    [255/255, 170/255, 94/255, 0.5],  // #ffaa5e
    [255/255, 212/255, 163/255, 0.4], // #ffd4a3
    [255/255, 236/255, 214/255, 0.3]  // #ffecd6
  ];

  const canvas = document.createElement("canvas");
  canvas.id = "vector-field-bg";
  canvas.setAttribute("aria-hidden", "true");

  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
  if (!gl) {
    console.error("WebGL not supported - falling back to Canvas2D");
    return;
  }
  console.log("WebGL initialized successfully");

  let width, height;
  const particleCount = 10000; // Many more particles with WebGL!
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Vertex shader - positions particles
  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;

    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      gl_PointSize = 2.5;
      v_color = a_color;
    }
  `;

  // Fragment shader - colors particles
  const fragmentShaderSource = `
    precision mediump float;
    varying vec4 v_color;

    void main() {
      gl_FragColor = v_color;
    }
  `;

  function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
  }

  gl.useProgram(program);

  // Get attribute locations
  const positionLocation = gl.getAttribLocation(program, "a_position");
  const colorLocation = gl.getAttribLocation(program, "a_color");

  // Create buffers
  const positionBuffer = gl.createBuffer();
  const colorBuffer = gl.createBuffer();

  // Initialize particle data
  const positions = new Float32Array(particleCount * 2);
  const velocities = new Float32Array(particleCount * 2);
  const particleColors = new Float32Array(particleCount * 4);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 2] = Math.random() * 2 - 1;
    positions[i * 2 + 1] = Math.random() * 2 - 1;
    velocities[i * 2] = 0;
    velocities[i * 2 + 1] = 0;

    const color = colors[Math.floor(Math.random() * colors.length)];
    particleColors[i * 4] = color[0];
    particleColors[i * 4 + 1] = color[1];
    particleColors[i * 4 + 2] = color[2];
    particleColors[i * 4 + 3] = color[3];
  }

  let time = 0;

  // Simplex noise for smooth flow
  function noise(x, y, t) {
    const X = Math.floor(x * 3 + t * 0.1) * 12.9898;
    const Y = Math.floor(y * 3 + t * 0.1) * 78.233;
    return (Math.sin(X + Y) * 43758.5453) % 1.0;
  }

  function flowField(x, y, t) {
    const scale = 2.0;
    const n1 = noise(x * scale, y * scale, t);
    const n2 = noise(x * scale + 100, y * scale + 100, t);

    const angle = n1 * Math.PI * 4;
    const speed = 0.003;

    return {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    };
  }

  function updateParticles() {
    for (let i = 0; i < particleCount; i++) {
      const x = positions[i * 2];
      const y = positions[i * 2 + 1];

      const field = flowField(x, y, time);

      velocities[i * 2] = field.vx;
      velocities[i * 2 + 1] = field.vy;

      positions[i * 2] += velocities[i * 2];
      positions[i * 2 + 1] += velocities[i * 2 + 1];

      // Wrap around
      if (positions[i * 2] < -1) positions[i * 2] = 1;
      if (positions[i * 2] > 1) positions[i * 2] = -1;
      if (positions[i * 2 + 1] < -1) positions[i * 2 + 1] = 1;
      if (positions[i * 2 + 1] > 1) positions[i * 2 + 1] = -1;

      // Fade particles randomly for dynamic effect
      if (Math.random() < 0.001) {
        particleColors[i * 4 + 3] *= 0.95;
        if (particleColors[i * 4 + 3] < 0.1) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          particleColors[i * 4 + 3] = color[3];
        }
      }
    }
  }

  function render() {
    if (motionQuery.matches) {
      requestAnimationFrame(render);
      return;
    }

    // Clear with full transparency to see pixel background
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    updateParticles();
    time += 1;

    // Update position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Update color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, particleColors, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, particleCount);

    requestAnimationFrame(render);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }

  function init() {
    console.log("Init called");
    if (!canvas.isConnected) {
      document.body.prepend(canvas);
      console.log("Canvas added to DOM");
    }
    resize();
    console.log("Starting render loop");
    render();
  }

  window.addEventListener("resize", resize);
  document.addEventListener("DOMContentLoaded", init);
})();
