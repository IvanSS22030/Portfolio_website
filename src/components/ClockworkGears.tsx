import React, { useEffect, useState } from 'react';
import { animated, useSpringValue } from 'react-spring';
import { useTheme } from '../context/ThemeContext';
import type { Theme } from '../types';
import '../styles/ClockworkGears.css';

/*
 * Clock Tower gears: a giant pair of interlocking gears behind the page, half outside the
 * right edge. They advance in clock ticks while you scroll, and the palette (background +
 * glow behind the gears) changes with every section.
 */

// Every 60px of scroll advances the mechanism one 6° tick; the spring gives each tick a small bounce
const TICK_PX = 60;
const TICK_DEG = 6;
const TICK_SPRING = { tension: 900, friction: 14 };

type Palette = { bg: string; gear: string; glow: string };

// Section ids in page order, with the palette each one switches to
const PALETTES: Record<Theme, Array<{ id: string } & Palette>> = {
  // Blueprint: cool blues and indigos
  professional: [
    { id: 'home', bg: '#EEF2FF', gear: '#4F46E5', glow: '#A5B4FC' },
    { id: 'about', bg: '#DBEAFE', gear: '#1D4ED8', glow: '#93C5FD' },
    { id: 'skills', bg: '#EDE9FE', gear: '#6D28D9', glow: '#C4B5FD' },
    { id: 'projects', bg: '#CFFAFE', gear: '#0E7490', glow: '#67E8F9' },
    { id: 'experience', bg: '#E0E7FF', gear: '#4338CA', glow: '#A5B4FC' },
    { id: 'contact', bg: '#E0F2FE', gear: '#0369A1', glow: '#7DD3FC' },
  ],
  // Castle zones: entrance, long library, clock tower, throne room, royal chapel
  personal: [
    { id: 'home', bg: '#05070D', gear: '#C8862F', glow: '#3B5BDB' },
    { id: 'about', bg: '#0B1530', gear: '#C8862F', glow: '#3B5BDB' },
    { id: 'skills', bg: '#1A0F2E', gear: '#C8862F', glow: '#7B3FE4' },
    { id: 'projects', bg: '#24170A', gear: '#C8862F', glow: '#D9902B' },
    { id: 'games', bg: '#2B0A12', gear: '#C8862F', glow: '#C0263D' },
    { id: 'contact', bg: '#0A1F1B', gear: '#C8862F', glow: '#2F9E8F' },
  ],
};

// --- Gear geometry -------------------------------------------------------------------------

// Both gears share the same tooth size (module), so their teeth mesh
const MODULE = 20;
const BIG_TEETH = 24;
const SMALL_TEETH = 14;
const RATIO = BIG_TEETH / SMALL_TEETH;
// Direction from the big gear to the small one (up-right, mirrored to up-left by the CSS)
const MESH_ANGLE = -40;

const rad = (deg: number) => (deg * Math.PI) / 180;
const pitchRadius = (teeth: number) => (teeth * MODULE) / 2;
const point = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`;

const BIG_R = pitchRadius(BIG_TEETH);
const SMALL_R = pitchRadius(SMALL_TEETH);
const SMALL_CENTER = {
  x: (BIG_R + SMALL_R) * Math.cos(rad(MESH_ANGLE)),
  y: (BIG_R + SMALL_R) * Math.sin(rad(MESH_ANGLE)),
};

// At rest, a tooth of the big gear points at the small gear and sits in one of its gaps
const BIG_PHASE = MESH_ANGLE - 0.25 * (360 / BIG_TEETH);
const SMALL_PHASE = MESH_ANGLE + 180 - 0.75 * (360 / SMALL_TEETH);

const VIEW_BOX = '-270 -415 732 685';

// Each tooth spans the first half of its step at the root and narrows towards the tip
const teethPath = (teeth: number) => {
  const r = pitchRadius(teeth);
  const tip = r + MODULE;
  const root = r - MODULE * 1.25;
  const step = (Math.PI * 2) / teeth;
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    d += `${i === 0 ? 'M' : 'L'} ${point(root, a)} L ${point(tip, a + step * 0.12)} `;
    d += `A ${tip} ${tip} 0 0 1 ${point(tip, a + step * 0.38)} L ${point(root, a + step * 0.5)} `;
    d += `A ${root} ${root} 0 0 1 ${point(root, a + step)} `;
  }
  return `${d}Z`;
};

const circlePath = (r: number) => `M ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0 Z`;

// Openings between the spokes, as ring sectors
const windowPaths = (teeth: number, spokes: number) => {
  const r = pitchRadius(teeth);
  const outer = r - MODULE * 2.6;
  const inner = r * 0.2 + MODULE * 0.6;
  const spokeHalf = (MODULE * 0.9) / ((outer + inner) / 2);
  const step = (Math.PI * 2) / spokes;
  return Array.from({ length: spokes }, (_, i) => {
    const a0 = i * step + spokeHalf;
    const a1 = (i + 1) * step - spokeHalf;
    return `M ${point(outer, a0)} A ${outer} ${outer} 0 0 1 ${point(outer, a1)} L ${point(inner, a1)} A ${inner} ${inner} 0 0 0 ${point(inner, a0)} Z`;
  });
};

const Gear: React.FC<{ teeth: number; spokes: number; skin: Theme }> = ({ teeth, spokes, skin }) => {
  const r = pitchRadius(teeth);
  const rim = r - MODULE * 2.6;
  const hub = r * 0.2;
  const windows = windowPaths(teeth, spokes);

  if (skin === 'professional') {
    // Technical drawing: outlines, dashed pitch circle
    return (
      <g fill="none" stroke="currentColor">
        <path d={teethPath(teeth)} strokeWidth={3} fill="currentColor" fillOpacity={0.06} />
        <circle r={r} strokeWidth={1.5} strokeDasharray="10 8" opacity={0.6} />
        {windows.map((d, i) => (
          <path key={i} d={d} strokeWidth={2.5} />
        ))}
        <circle r={hub} strokeWidth={2.5} />
        <circle r={hub * 0.45} strokeWidth={2} />
      </g>
    );
  }

  // Gothic bronze: solid metal with the windows cut out and a ring of rivets
  const rivetRadius = (rim + r - MODULE * 1.25) / 2;
  const rivets = Math.round(teeth / 2);
  return (
    <g>
      <path
        d={[teethPath(teeth), ...windows, circlePath(hub * 0.45)].join(' ')}
        fillRule="evenodd"
        fill="url(#clockwork-bronze)"
        stroke="#1F1407"
        strokeWidth={4}
      />
      <circle r={rim} fill="none" stroke="#F3D08A" strokeOpacity={0.35} strokeWidth={3} />
      <circle r={hub} fill="none" stroke="#F3D08A" strokeOpacity={0.5} strokeWidth={4} />
      {Array.from({ length: rivets }, (_, i) => {
        const a = (i / rivets) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={rivetRadius * Math.cos(a)}
            cy={rivetRadius * Math.sin(a)}
            r={4.5}
            fill="#F3D08A"
            fillOpacity={0.55}
          />
        );
      })}
    </g>
  );
};

// --- Component -----------------------------------------------------------------------------

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(() => window.matchMedia?.(REDUCED_MOTION_QUERY).matches ?? false);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleChange = () => setReduced(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reduced;
};

const ClockworkGears: React.FC = () => {
  const { theme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const [sectionIndex, setSectionIndex] = useState(0);
  const angle = useSpringValue(0);

  const sections = PALETTES[theme];
  const palette = sections[Math.min(sectionIndex, sections.length - 1)];

  // Section backgrounds turn transparent while the gears are on, so the palette shows through
  useEffect(() => {
    document.documentElement.dataset.gears = 'on';
    return () => {
      delete document.documentElement.dataset.gears;
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      if (reducedMotion) {
        angle.start({ to: 0, immediate: true });
      } else {
        angle.start({ to: Math.round(window.scrollY / TICK_PX) * TICK_DEG, config: TICK_SPRING });
      }

      // Active section: the last one whose top has crossed the middle of the screen
      const middle = window.innerHeight / 2;
      let active = 0;
      sections.forEach((section, i) => {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= middle) active = i;
      });
      setSectionIndex(active);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      cancelAnimationFrame(frame);
    };
  }, [angle, reducedMotion, sections]);

  return (
    <div
      className="clockwork"
      data-skin={theme}
      style={{ backgroundColor: palette.bg, color: palette.gear }}
      aria-hidden="true"
    >
      <div className="clockwork__glow" style={{ color: palette.glow }} />
      <div className="clockwork__gears">
        <svg viewBox={VIEW_BOX}>
          <defs>
            <radialGradient id="clockwork-bronze" cx="35%" cy="35%" r="75%">
              <stop offset="0%" stopColor="#F0C674" />
              <stop offset="45%" stopColor="#B8863B" />
              <stop offset="80%" stopColor="#6E4A1C" />
              <stop offset="100%" stopColor="#3B2610" />
            </radialGradient>
          </defs>

          {theme === 'professional' && (
            // Blueprint center lines; they stay still while the gears turn
            <g stroke="currentColor" strokeWidth={1.5} strokeDasharray="28 8 4 8" opacity={0.5}>
              <line x1={-270} y1={0} x2={BIG_R + 60} y2={0} />
              <line x1={0} y1={-BIG_R - 60} x2={0} y2={270} />
              <line x1={SMALL_CENTER.x - SMALL_R - 50} y1={SMALL_CENTER.y} x2={462} y2={SMALL_CENTER.y} />
              <line x1={SMALL_CENTER.x} y1={-415} x2={SMALL_CENTER.x} y2={SMALL_CENTER.y + SMALL_R + 50} />
            </g>
          )}

          <animated.g transform={angle.to((a) => `rotate(${BIG_PHASE + a})`)}>
            <Gear teeth={BIG_TEETH} spokes={6} skin={theme} />
          </animated.g>
          <g transform={`translate(${SMALL_CENTER.x} ${SMALL_CENTER.y})`}>
            <animated.g transform={angle.to((a) => `rotate(${SMALL_PHASE - a * RATIO})`)}>
              <Gear teeth={SMALL_TEETH} spokes={5} skin={theme} />
            </animated.g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ClockworkGears;
