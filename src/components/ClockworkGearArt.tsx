import React, { useEffect, useRef } from 'react';
import type { SpringValue } from 'react-spring';
import {
  DAMAGE,
  PAD,
  damagePaths,
  gearBody,
  hubRadius,
  pitchRadius,
  rad,
  rimRadius,
  rivetPoints,
  teethPath,
  tipRadius,
  windowPaths,
} from './clockworkGeometry';
import type { GearSpec } from './clockworkGeometry';

/*
 * Gear artwork for ClockworkGears: the blueprint gear of the light theme and the rusted,
 * broken pixel-art gear of the dark theme.
 */

// --- Light theme ---------------------------------------------------------------------------

// Technical drawing: outlines and a dashed pitch circle. One SVG per gear; the parent layer
// rotates it with CSS.
export const BlueprintGearSvg: React.FC<{ gear: GearSpec }> = ({ gear: { teeth, spokes } }) => {
  const half = tipRadius(teeth) + PAD;
  const hub = hubRadius(teeth);
  return (
    <svg viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`} overflow="visible">
      <g fill="none" stroke="currentColor">
        <path d={teethPath(teeth)} strokeWidth={3} fill="currentColor" fillOpacity={0.06} />
        <circle r={pitchRadius(teeth)} strokeWidth={1.5} strokeDasharray="10 8" opacity={0.6} />
        {windowPaths(teeth, spokes).map((d, i) => (
          <path key={i} d={d} strokeWidth={2.5} />
        ))}
        <circle r={hub} strokeWidth={2.5} />
        <circle r={hub * 0.45} strokeWidth={2} />
      </g>
    </svg>
  );
};

// --- Dark theme ----------------------------------------------------------------------------

const OUTLINE = '#140904';

// Gear units per sprite pixel
const PIXEL_UNITS = 4;

/*
 * Rusted iron with a noise texture (rust blotches, pitting, eaten edges), a chunk torn out of
 * the rim, cracks, snapped teeth and lost rivets. Drawn as a regular SVG, turned into an image
 * once, then sampled at low resolution by PixelGear.
 */
const RustTextureSvg: React.FC<{ gear: GearSpec; svgRef: React.RefObject<SVGSVGElement> }> = ({ gear, svgRef }) => {
  const damage = DAMAGE[gear.id];
  const half = tipRadius(gear.teeth) + PAD;
  const size = half * 2;
  const body = gearBody(gear, damage);
  const { chunks, cracks } = damagePaths(gear, damage);
  // Unique per gear: both hidden SVGs live in the same document
  const id = (name: string) => `cw-${gear.id}-${name}`;
  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`${-half} ${-half} ${size} ${size}`}
    >
      <defs>
        <radialGradient id={id('iron')} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#8A4520" />
          <stop offset="50%" stopColor="#5E2D12" />
          <stop offset="85%" stopColor="#3A1A0A" />
          <stop offset="100%" stopColor="#220F06" />
        </radialGradient>
        {/* Rust blotches + dark pitting, clipped to the gear, then edges eaten away */}
        <filter id={id('rust')} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={4} seed={3} result="noise" />
          <feColorMatrix in="noise" type="matrix" result="rust" values="0 0 0 0 0.66  0 0 0 0 0.29  0 0 0 0 0.1  4 0 0 0 -2.2" />
          <feColorMatrix in="noise" type="matrix" result="pits" values="0 0 0 0 0.05  0 0 0 0 0.02  0 0 0 0 0.01  0 -5 0 0 1.75" />
          <feMerge result="textured">
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="rust" />
            <feMergeNode in="pits" />
          </feMerge>
          <feComposite in="textured" in2="SourceGraphic" operator="in" result="clipped" />
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={8} result="edge" />
          <feDisplacementMap in="clipped" in2="edge" scale={7} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <mask id={id('chunks')} maskUnits="userSpaceOnUse" x={-half} y={-half} width={size} height={size}>
          <rect x={-half} y={-half} width={size} height={size} fill="white" />
          {chunks.map((d, i) => (
            <path key={i} d={d} fill="black" />
          ))}
        </mask>
        <clipPath id={id('body')}>
          <path d={body} clipRule="evenodd" />
        </clipPath>
      </defs>

      <g mask={`url(#${id('chunks')})`}>
        <g filter={`url(#${id('rust')})`}>
          <path d={body} fillRule="evenodd" fill={`url(#${id('iron')})`} stroke={OUTLINE} strokeWidth={6} />
          <circle r={rimRadius(gear.teeth)} fill="none" stroke="#24100A" strokeWidth={9} />
          <circle r={hubRadius(gear.teeth)} fill="none" stroke="#24100A" strokeWidth={8} />
          {rivetPoints(gear.teeth).map(([x, y], i) =>
            damage.missingRivets?.includes(i) ? (
              <circle key={i} cx={x} cy={y} r={4} fill="#0D0603" />
            ) : (
              <circle key={i} cx={x} cy={y} r={6} fill="#3A1A0B" stroke="#9A4A1E" strokeWidth={2} />
            )
          )}
          <path d={cracks} fill="none" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        </g>
      </g>
      {/* Dark jagged edge where the metal snapped */}
      <g clipPath={`url(#${id('body')})`}>
        {chunks.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={OUTLINE} strokeWidth={8} strokeLinejoin="round" />
        ))}
      </g>
    </svg>
  );
};

/*
 * Dark-theme gear: redrawn at low resolution on every turn, like a rotating GBA sprite, then
 * scaled up without smoothing (see .clockwork__pixel).
 */
export const PixelGear: React.FC<{
  gear: GearSpec;
  angle: SpringValue<number>;
  phase: number;
  factor: number;
}> = ({ gear, angle, phase, factor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const svg = svgRef.current;
    if (!canvas || !ctx || !svg) return;

    const half = tipRadius(gear.teeth) + PAD;
    const size = Math.round((half * 2) / PIXEL_UNITS);
    const scale = size / (half * 2);
    canvas.width = size;
    canvas.height = size;

    let source: HTMLCanvasElement | null = null;
    let lastDeg = NaN;
    let frame = 0;

    const image = new Image();
    image.onload = () => {
      // Rasterize the textured SVG once at full size; each frame samples it with nearest-neighbor
      source = document.createElement('canvas');
      source.width = half * 2;
      source.height = half * 2;
      source.getContext('2d')?.drawImage(image, 0, 0);
      lastDeg = NaN;
    };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;

    const draw = () => {
      const deg = phase + angle.get() * factor;
      if (source && deg !== lastDeg) {
        lastDeg = deg;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = false;
        ctx.setTransform(scale, 0, 0, scale, size / 2, size / 2);
        ctx.rotate(rad(deg));
        ctx.drawImage(source, -half, -half);
      }
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [angle, factor, gear, phase]);

  return (
    <>
      <canvas ref={canvasRef} className="clockwork__pixel" />
      <div hidden>
        <RustTextureSvg gear={gear} svgRef={svgRef} />
      </div>
    </>
  );
};
