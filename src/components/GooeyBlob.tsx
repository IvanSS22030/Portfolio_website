import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/*
 * Touch-screen version of the hero's yellow gooey bubble (GooeyCursor is the mouse version).
 *
 * The mouse version blurs three circles with an SVG filter and cuts the blur at a threshold.
 * Phones draw that filter on the CPU at a lower resolution, so there the bubble looked frozen and
 * blurry. This version computes the same blurred-and-cut shape per pixel on the GPU (WebGL), at
 * the screen's real resolution: same yellow, same white highlights, same dark rim from the shadow.
 *
 * With no mouse to follow, the bubble wanders through the hero on its own. A touch pulls the
 * whole bubble to the finger, and after a moment it carries on wandering from there.
 */

// Same springs as the mouse version: the front bubble chases the target quickly and each of the
// other two chases the one in front of it with a heavy, slow spring
type SpringConfig = { tension: number; friction: number; mass: number };
const FAST: SpringConfig = { tension: 1200, friction: 40, mass: 1 };
const SLOW: SpringConfig = { tension: 200, friction: 50, mass: 10 };

// Back, middle and front bubble, as in GooeyCursor.css: diameter in vw / divisor, and the white
// highlight's offset from the center (up and left) and radius in the same units; null = none
const BUBBLES = [
  { diameter: 170, spot: { offset: -10, radius: 25 } },
  { diameter: 350, spot: null },
  { diameter: 200, spot: { offset: -25, radius: 25 } },
];
const divisorFor = (width: number) => (width <= 800 ? 5 : 8);

// The desktop look at 1280px: 30px blur and a 10px shadow under a 560px middle bubble.
// Both scale with the bubbles so the shape keeps its proportions on any screen.
const BLUR_PER_PX = 30 / 560;
const SHADOW_PER_PX = 10 / 560;

// Wandering: speed in px/s and how close to an edge (share of the hero) it turns back inside
const SPEED: [number, number] = [70, 140];
const EDGE_MARGIN = { x: 0.2, y: 0.18 };
// After a touch the bubble stays where the finger left it for a moment
const TOUCH_HOLD_MS = 1500;

const VERTEX_SHADER = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// Per pixel: blur each circle (and its shadow and highlight) analytically, stack them like the
// browser does, then apply the goo cut (alpha * 30 - 7) with a one-pixel anti-aliased edge.
const FRAGMENT_SHADER = `
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uCenter[3];
uniform float uRadius[3];
uniform vec3 uSpot[3];
uniform float uSigma;
uniform vec2 uShadow;
uniform float uDpr;
uniform float uHeight;

// Share of a blurred edge covering a point z blur-widths inside it (logistic approximation)
float edge(float z) { return 1.0 / (1.0 + exp(-1.702 * clamp(z, -12.0, 12.0))); }

void main() {
  vec2 p = vec2(gl_FragCoord.x, uHeight - gl_FragCoord.y) / uDpr;

  // Most of the hero is empty: skip pixels far from every bubble
  float reach = 4.0 * uSigma + length(uShadow);
  float nearest = 1e6;
  for (int i = 0; i < 3; i++) nearest = min(nearest, distance(p, uCenter[i]) - uRadius[i]);
  if (nearest > reach) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec3 yellow = vec3(0.961, 0.816, 0.380);
  float s2 = uSigma * uSigma;
  vec3 color = vec3(0.0);
  float alpha = 0.0;

  for (int i = 0; i < 3; i++) {
    float body = edge((uRadius[i] - distance(p, uCenter[i])) / uSigma);
    float shadow = edge((uRadius[i] - distance(p - uShadow, uCenter[i])) / uSigma);
    float rim = max(shadow - body, 0.0);
    float spot = 0.0;
    if (uSpot[i].z > 0.0) {
      float r = uSpot[i].z;
      float d = distance(p, uCenter[i] + uSpot[i].xy);
      spot = (1.0 - exp(-r * r / (2.0 * s2))) * exp(-d * d / (2.0 * s2 + r * r));
    }
    // Each bubble: yellow at 60% opacity, a white highlight inside, a black shadow outside
    vec3 c = 0.6 * (yellow * body + 0.8 * (vec3(1.0) - yellow) * spot);
    float a = 0.6 * (body + 0.75 * rim);
    color = c + (1.0 - a) * color;
    alpha = a + (1.0 - a) * alpha;
  }

  float level = 30.0 * alpha - 7.0;
#ifdef GL_OES_standard_derivatives
  float pixel = max(fwidth(level), 1e-4);
#else
  float pixel = 1.0;
#endif
  float cut = clamp((level - 0.5) / pixel + 0.5, 0.0, 1.0);
  vec3 rgb = color / max(alpha, 1e-4);
  gl_FragColor = vec4(rgb * cut, cut);
}
`;

type Body = { x: number; y: number; vx: number; vy: number };

// Semi-implicit spring step, split in two so the stiff front spring stays stable
const stepSpring = (body: Body, tx: number, ty: number, config: SpringConfig, dt: number) => {
  const h = dt / 2;
  for (let i = 0; i < 2; i++) {
    body.vx += ((-config.tension * (body.x - tx) - config.friction * body.vx) / config.mass) * h;
    body.vy += ((-config.tension * (body.y - ty) - config.friction * body.vy) / config.mass) * h;
    body.x += body.vx * h;
    body.y += body.vy * h;
  }
};

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.warn('GooeyBlob shader:', gl.getShaderInfoLog(shader));
  return null;
};

const createProgram = (gl: WebGLRenderingContext) => {
  gl.getExtension('OES_standard_derivatives');
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
};

const GooeyBlob: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', { premultipliedAlpha: true, antialias: false });
    const program = gl && createProgram(gl);
    // No WebGL: no bubble on this device rather than a broken one
    if (!canvas || !gl || !program) return;

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const u = {
      center: uniform('uCenter'),
      radius: uniform('uRadius'),
      spot: uniform('uSpot'),
      sigma: uniform('uSigma'),
      shadow: uniform('uShadow'),
      dpr: uniform('uDpr'),
      height: uniform('uHeight'),
    };

    // Size of the hero in CSS px, and everything that depends on the screen width
    let width = 0;
    let height = 0;
    let dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      // 2x is already sharp for a soft blob; 3x would mean 2.25 times the pixels to compute
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);

      const unit = window.innerWidth / 100 / divisorFor(window.innerWidth);
      const middle = BUBBLES[1].diameter * unit;
      gl.uniform1fv(u.radius, BUBBLES.map(b => (b.diameter * unit) / 2));
      gl.uniform3fv(
        u.spot,
        BUBBLES.flatMap(b => (b.spot ? [b.spot.offset * unit, b.spot.offset * unit, b.spot.radius * unit] : [0, 0, 0]))
      );
      gl.uniform1f(u.sigma, BLUR_PER_PX * middle);
      gl.uniform2f(u.shadow, SHADOW_PER_PX * middle, SHADOW_PER_PX * middle);
      gl.uniform1f(u.dpr, dpr);
      gl.uniform1f(u.height, canvas.height);
    };
    resize();

    // The wandering target, and the three bubbles chasing it (back, middle, front)
    const target = { x: width * 0.62, y: height * 0.62, heading: Math.random() * Math.PI * 2 };
    const bodies: Body[] = [0, 1, 2].map(() => ({ x: target.x, y: target.y, vx: 0, vy: 0 }));
    let holdUntil = 0;
    let fingerDown = false;

    const wander = (dt: number, seconds: number) => {
      // The direction turns slowly and unevenly; near an edge it turns back toward the middle
      target.heading += (0.9 * Math.sin(seconds * 0.63) + 0.6 * Math.sin(seconds * 1.37 + 2.1)) * dt;
      const nearEdge =
        target.x < width * EDGE_MARGIN.x ||
        target.x > width * (1 - EDGE_MARGIN.x) ||
        target.y < height * EDGE_MARGIN.y ||
        target.y > height * (1 - EDGE_MARGIN.y);
      if (nearEdge) {
        const inward = Math.atan2(height / 2 - target.y, width / 2 - target.x);
        const turn = Math.atan2(Math.sin(inward - target.heading), Math.cos(inward - target.heading));
        target.heading += turn * Math.min(1, 2.5 * dt);
      }
      const speed = SPEED[0] + (SPEED[1] - SPEED[0]) * (0.5 + 0.5 * Math.sin(seconds * 0.45));
      target.x = Math.min(width, Math.max(0, target.x + Math.cos(target.heading) * speed * dt));
      target.y = Math.min(height, Math.max(0, target.y + Math.sin(target.heading) * speed * dt));
    };

    const draw = () => {
      gl.uniform2fv(u.center, bodies.flatMap(b => [b.x, b.y]));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let frame = 0;
    let last = performance.now();
    let onScreen = true;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!onScreen) return;

      if (!reducedMotion && !fingerDown && now > holdUntil) wander(dt, now / 1000);
      const [back, middle, front] = bodies;
      stepSpring(front, target.x, target.y, FAST, dt);
      stepSpring(middle, front.x, front.y, SLOW, dt);
      stepSpring(back, middle.x, middle.y, SLOW, dt);
      draw();
    };

    // A touch inside the hero pulls the bubble to the finger
    const handleTouch = (e: TouchEvent) => {
      const point = e.touches[0];
      if (!point) return;
      const rect = canvas.getBoundingClientRect();
      const x = point.clientX - rect.left;
      const y = point.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      target.x = x;
      target.y = y;
      fingerDown = true;
    };
    const handleTouchEnd = () => {
      if (!fingerDown) return;
      fingerDown = false;
      holdUntil = performance.now() + TOUCH_HOLD_MS;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    // No work while the hero is scrolled out of view
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    visibility.observe(canvas);
    const handleContextLost = () => cancelAnimationFrame(frame);
    canvas.addEventListener('webglcontextlost', handleContextLost);
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [reducedMotion]);

  // Same place as the mouse version: fills the hero, behind its content
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" aria-hidden="true" />;
};

export default GooeyBlob;
