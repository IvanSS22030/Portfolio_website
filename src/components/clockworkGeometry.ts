/*
 * Gear geometry for ClockworkGears: tooth outlines, openings and damage (snapped and worn
 * teeth, cracks, chunks torn out of the rim).
 * Units: gear-local SVG units, gear center at 0,0.
 */

// Both gears share the same tooth size (module), so their teeth mesh
export const MODULE = 20;
// Room around each gear for eroded edges
export const PAD = 40;

export const pitchRadius = (teeth: number) => (teeth * MODULE) / 2;
export const tipRadius = (teeth: number) => pitchRadius(teeth) + MODULE;
export const rootRadius = (teeth: number) => pitchRadius(teeth) - MODULE * 1.25;
export const rimRadius = (teeth: number) => pitchRadius(teeth) - MODULE * 2.6;
export const hubRadius = (teeth: number) => pitchRadius(teeth) * 0.2;

export const polar = (r: number, a: number): [number, number] => [r * Math.cos(a), r * Math.sin(a)];
export const point = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`;
export const rad = (deg: number) => (deg * Math.PI) / 180;

export type GearSpec = { id: 'big' | 'small'; teeth: number; spokes: number };

/*
 * broken: snapped teeth (tooth indexes); worn: tooth height factor (1 = intact);
 * chunks: pieces torn out of the rim (center as a tooth index, width in teeth);
 * cracks: how many cracks run inwards from the first chunk (or from random spots)
 */
export type Damage = {
  seed: number;
  broken?: number[];
  worn?: Record<number, number>;
  chunks?: Array<{ at: number; width: number }>;
  cracks?: number;
  missingRivets?: number[];
};

// Each tooth spans the first half of its step at the root and narrows towards the tip
export const teethPath = (teeth: number, { broken = [], worn = {} }: Partial<Damage> = {}) => {
  const root = rootRadius(teeth);
  const height = tipRadius(teeth) - root;
  const step = (Math.PI * 2) / teeth;
  let d = `M ${point(root, 0)} `;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    if (broken.includes(i)) {
      // Snapped tooth: a short jagged stump
      d += `L ${point(root + height * 0.38, a + step * 0.1)} L ${point(root + height * 0.18, a + step * 0.2)} `;
      d += `L ${point(root + height * 0.3, a + step * 0.3)} L ${point(root + height * 0.1, a + step * 0.4)} `;
      d += `L ${point(root, a + step * 0.5)} `;
    } else {
      const tip = root + height * (worn[i] ?? 1);
      d += `L ${point(tip, a + step * 0.12)} A ${tip} ${tip} 0 0 1 ${point(tip, a + step * 0.38)} `;
      d += `L ${point(root, a + step * 0.5)} `;
    }
    d += `A ${root} ${root} 0 0 1 ${point(root, a + step)} `;
  }
  return `${d}Z`;
};

export const circlePath = (r: number) => `M ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0 Z`;

// Openings between the spokes, as ring sectors
export const windowPaths = (teeth: number, spokes: number) => {
  const outer = rimRadius(teeth);
  const inner = hubRadius(teeth) + MODULE * 0.6;
  const spokeHalf = (MODULE * 0.9) / ((outer + inner) / 2);
  const step = (Math.PI * 2) / spokes;
  return Array.from({ length: spokes }, (_, i) => {
    const a0 = i * step + spokeHalf;
    const a1 = (i + 1) * step - spokeHalf;
    return `M ${point(outer, a0)} A ${outer} ${outer} 0 0 1 ${point(outer, a1)} L ${point(inner, a1)} A ${inner} ${inner} 0 0 0 ${point(inner, a0)} Z`;
  });
};

// Teeth, spoke openings and the axle hole, for an even-odd fill
export const gearBody = (gear: GearSpec, damage: Partial<Damage> = {}) =>
  [teethPath(gear.teeth, damage), ...windowPaths(gear.teeth, gear.spokes), circlePath(hubRadius(gear.teeth) * 0.45)].join(' ');

export const rivetPoints = (teeth: number) => {
  const r = (rimRadius(teeth) + rootRadius(teeth)) / 2;
  const count = Math.round(teeth / 2);
  return Array.from({ length: count }, (_, i) => polar(r, (i / count) * Math.PI * 2));
};

// Deterministic randomness (mulberry32) so damage looks the same on every visit
export const seededRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Jagged cracks running from the rim towards the hub
export const crackPaths = (teeth: number, seed: number, count: number, startAngle?: number) => {
  const rand = seededRandom(seed);
  const start = rootRadius(teeth) - 2;
  const end = hubRadius(teeth) * 1.2;
  return Array.from({ length: count }, () => {
    let a = startAngle === undefined ? rand() * Math.PI * 2 : startAngle + (rand() - 0.5) * 0.5;
    let r = start;
    const stopAt = end + (start - end) * rand() * 0.5;
    let d = `M ${point(r, a)}`;
    while (r > stopAt) {
      r = Math.max(stopAt, r - ((start - end) / 7) * (0.6 + rand() * 0.6));
      a += (rand() - 0.5) * 0.2;
      d += ` L ${point(r, a)}`;
    }
    return d;
  }).join(' ');
};

// A piece bitten out of the rim, deeper in the middle and jagged along the edge
export const breakChunk = (teeth: number, centerAngle: number, halfWidth: number, seed: number) => {
  const rand = seededRandom(seed);
  const outer = tipRadius(teeth) + PAD;
  const shallow = rootRadius(teeth) - MODULE * 0.2;
  const deepest = rimRadius(teeth) - MODULE * 0.6;
  const points = 8;
  let d = `M ${point(outer, centerAngle - halfWidth)} L ${point(outer, centerAngle + halfWidth)}`;
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const depth = shallow - (shallow - deepest) * Math.sin(t * Math.PI) * (0.55 + rand() * 0.45);
    d += ` L ${point(depth, centerAngle + halfWidth - t * 2 * halfWidth)}`;
  }
  return `${d} Z`;
};

// Chunk outlines and crack lines of a damaged gear
export const damagePaths = (gear: GearSpec, damage: Damage) => {
  const step = (Math.PI * 2) / gear.teeth;
  const chunks = (damage.chunks ?? []).map((chunk, i) =>
    breakChunk(gear.teeth, chunk.at * step, (chunk.width * step) / 2, damage.seed + i)
  );
  const firstChunk = damage.chunks?.[0];
  const cracks = crackPaths(gear.teeth, damage.seed * 3, damage.cracks ?? 0, firstChunk && firstChunk.at * step);
  return { chunks, cracks };
};

// How each dark-theme gear is damaged
export const DAMAGE: Record<GearSpec['id'], Damage> = {
  big: { seed: 11, broken: [14], worn: { 11: 0.6 }, chunks: [{ at: 3.25, width: 2.6 }], cracks: 3, missingRivets: [1, 2, 7] },
  small: { seed: 23, broken: [9], cracks: 1, missingRivets: [4] },
};
