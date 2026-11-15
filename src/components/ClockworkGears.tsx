import React, { useEffect, useState } from 'react';
import { animated, useSpringValue } from 'react-spring';
import { useTheme } from '../context/ThemeContext';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import type { Theme } from '../types';
import { BlueprintGearSvg, PixelGear } from './ClockworkGearArt';
import { PAD, pitchRadius, tipRadius } from './clockworkGeometry';
import type { GearSpec } from './clockworkGeometry';
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

// --- Layout --------------------------------------------------------------------------------

const BIG_TEETH = 24;
const SMALL_TEETH = 14;
const RATIO = BIG_TEETH / SMALL_TEETH;
// Direction from the big gear to the small one (up-right, mirrored to up-left by the CSS)
const MESH_ANGLE = -40;

const rad = (deg: number) => (deg * Math.PI) / 180;

const BIG_R = pitchRadius(BIG_TEETH);
const SMALL_R = pitchRadius(SMALL_TEETH);
const SMALL_CENTER = {
  x: (BIG_R + SMALL_R) * Math.cos(rad(MESH_ANGLE)),
  y: (BIG_R + SMALL_R) * Math.sin(rad(MESH_ANGLE)),
};

// At rest, a tooth of the big gear points at the small gear and sits in one of its gaps
const BIG_PHASE = MESH_ANGLE - 0.25 * (360 / BIG_TEETH);
const SMALL_PHASE = MESH_ANGLE + 180 - 0.75 * (360 / SMALL_TEETH);

// Area covered by the pair, in gear units (the big gear's center is the origin)
const AREA = { x: -270, y: -415, w: 732, h: 685 };

type PlacedGear = GearSpec & { cx: number; cy: number; phase: number; factor: number };

const GEARS: PlacedGear[] = [
  { id: 'big', teeth: BIG_TEETH, spokes: 6, cx: 0, cy: 0, phase: BIG_PHASE, factor: 1 },
  {
    id: 'small',
    teeth: SMALL_TEETH,
    spokes: 5,
    cx: SMALL_CENTER.x,
    cy: SMALL_CENTER.y,
    phase: SMALL_PHASE,
    factor: -RATIO,
  },
];

// Each gear gets its own layer, placed by percentages of the pair's area
const gearBox = ({ teeth, cx, cy }: PlacedGear): React.CSSProperties => {
  const half = tipRadius(teeth) + PAD;
  return {
    left: `${((cx - half - AREA.x) / AREA.w) * 100}%`,
    top: `${((cy - half - AREA.y) / AREA.h) * 100}%`,
    width: `${((half * 2) / AREA.w) * 100}%`,
    height: `${((half * 2) / AREA.h) * 100}%`,
  };
};

// --- Component -----------------------------------------------------------------------------

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
        {theme === 'professional' && (
          // Blueprint center lines; they stay still while the gears turn
          <svg
            className="clockwork__lines"
            viewBox={`${AREA.x} ${AREA.y} ${AREA.w} ${AREA.h}`}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeDasharray="28 8 4 8"
            opacity={0.5}
          >
            <line x1={AREA.x} y1={0} x2={BIG_R + 60} y2={0} />
            <line x1={0} y1={-BIG_R - 60} x2={0} y2={270} />
            <line x1={SMALL_CENTER.x - SMALL_R - 50} y1={SMALL_CENTER.y} x2={AREA.x + AREA.w} y2={SMALL_CENTER.y} />
            <line x1={SMALL_CENTER.x} y1={AREA.y} x2={SMALL_CENTER.x} y2={SMALL_CENTER.y + SMALL_R + 50} />
          </svg>
        )}

        {GEARS.map((gear) =>
          theme === 'personal' ? (
            // Pixel-art gears rotate inside their own canvas
            <div key={gear.id} className="clockwork__gear" style={gearBox(gear)}>
              <PixelGear gear={gear} angle={angle} phase={gear.phase} factor={gear.factor} />
            </div>
          ) : (
            <animated.div
              key={gear.id}
              className="clockwork__gear"
              style={{
                ...gearBox(gear),
                transform: angle.to((a) => `rotate(${gear.phase + a * gear.factor}deg)`),
              }}
            >
              <BlueprintGearSvg gear={gear} />
            </animated.div>
          )
        )}
      </div>
    </div>
  );
};

export default ClockworkGears;
