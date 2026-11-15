import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import '../styles/CastleBats.css';

/*
 * Castle bats: every few seconds a small group of pixel-art bats crosses the screen in the
 * dark theme, flapping and bobbing up and down like the bats in the GBA Castlevania games.
 * The sprite is original art drawn here, not a ripped game sprite.
 */

// --- Sprite --------------------------------------------------------------------------------

const SPRITE_W = 18;
const SPRITE_H = 12;

// k outline, b body, B body light, w wing, W wing bone, r eye
const PALETTE: Record<string, string> = {
  k: '#0E0716',
  b: '#3A1E5A',
  B: '#7048A4',
  w: '#2C1848',
  W: '#8464CE',
  r: '#FF4040',
};

// One body for every frame (columns 5-12), so the bat doesn't jump while it flaps
const BODY: Record<number, string> = {
  1: '.k....k.',
  2: 'kBk..kBk',
  3: 'kBbkkbBk',
  4: 'kbBbbBbk',
  5: 'kbrbbrbk',
  6: 'kbbBBbbk',
  7: '.kbbbbk.',
  8: '..kbbk..',
  9: '...kk...',
};

// Left wing per pose (columns 0-5), mirrored for the right wing; '.' keeps what is underneath
const WINGS: Record<'up' | 'mid' | 'down', Record<number, string>> = {
  up: { 0: 'k.....', 1: 'kk....', 2: 'kWk...', 3: 'kwWk..', 4: '.kwWk.', 5: '.kwwWk', 6: '..kwwW', 7: '..kkww', 8: '....kk' },
  mid: { 3: 'k.....', 4: 'kk..k.', 5: 'kWkkWW', 6: 'kwWWww', 7: '.kwwww', 8: '..kwkw', 9: '...k.k' },
  down: { 4: '....k.', 5: '...kWW', 6: '..kWww', 7: '.kWwww', 8: 'kWwwkw', 9: 'kwwk.k', 10: 'kkk...' },
};

// Flap cycle, one frame after another in the sheet (CSS steps through them)
const FLAP = ['up', 'mid', 'down', 'mid'] as const;

const drawSpriteSheet = () => {
  const canvas = document.createElement('canvas');
  canvas.width = SPRITE_W * FLAP.length;
  canvas.height = SPRITE_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const paint = (x: number, y: number, c: string) => {
    if (c === '.') return;
    ctx.fillStyle = PALETTE[c];
    ctx.fillRect(x, y, 1, 1);
  };

  FLAP.forEach((pose, frame) => {
    const left = frame * SPRITE_W;
    Object.entries(BODY).forEach(([y, row]) => [...row].forEach((c, i) => paint(left + 5 + i, Number(y), c)));
    Object.entries(WINGS[pose]).forEach(([y, row]) =>
      [...row].forEach((c, i) => {
        paint(left + i, Number(y), c);
        paint(left + SPRITE_W - 1 - i, Number(y), c);
      })
    );
  });
  return canvas.toDataURL('image/png');
};

// --- Flight --------------------------------------------------------------------------------

// Seconds between groups, and before the first one after switching to the dark theme
const FIRST_GROUP_S = 2.5;
const GROUP_GAP_S: [number, number] = [7, 15];
// Horizontal speed in px/s, bob height in px and seconds per half bob
const SPEED: [number, number] = [170, 250];
const AMPLITUDE: [number, number] = [14, 34];
const HALF_BOB_S: [number, number] = [0.45, 0.8];

type Bat = {
  id: number;
  rtl: boolean;
  top: number;
  delay: number;
  duration: number;
  amplitude: number;
  halfBob: number;
  scale: number;
};

const between = ([min, max]: [number, number]) => min + Math.random() * (max - min);

let nextBatId = 0;

// One to three bats (usually one or two) flying the same way, a little apart
const makeGroup = (): Bat[] => {
  const roll = Math.random();
  const count = roll < 0.45 ? 1 : roll < 0.85 ? 2 : 3;
  const rtl = Math.random() < 0.5;
  const scale = window.innerWidth < 640 ? 2 : 3;
  const baseTop = window.innerHeight * between([0.12, 0.6]);
  const duration = (window.innerWidth + SPRITE_W * scale * 2) / between(SPEED);

  return Array.from({ length: count }, (_, i) => ({
    id: nextBatId++,
    rtl,
    top: baseTop + (i === 0 ? 0 : between([-60, 60])),
    delay: i * between([0.35, 0.8]),
    duration: duration * between([0.92, 1.08]),
    amplitude: between(AMPLITUDE),
    halfBob: between(HALF_BOB_S),
    scale,
  }));
};

const BatFlock: React.FC = () => {
  const [sheet] = useState(drawSpriteSheet);
  const [bats, setBats] = useState<Bat[]>([]);

  useEffect(() => {
    let timeout = 0;
    const schedule = (seconds: number) => {
      timeout = window.setTimeout(() => {
        // No new bats while the tab is in the background; try again later
        if (document.visibilityState === 'visible') setBats(current => [...current, ...makeGroup()]);
        schedule(between(GROUP_GAP_S));
      }, seconds * 1000);
    };
    schedule(FIRST_GROUP_S);
    return () => window.clearTimeout(timeout);
  }, []);

  // A bat leaves the list once it has crossed the screen (the bob and the flap never end)
  const handleAnimationEnd = (id: number) => (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setBats(current => current.filter(bat => bat.id !== id));
  };

  return (
    <div className="castle-bats" aria-hidden="true">
      {bats.map(bat => (
        <div
          key={bat.id}
          className={`castle-bat${bat.rtl ? ' castle-bat--rtl' : ''}`}
          style={
            {
              top: bat.top,
              '--bat-width': `${SPRITE_W * bat.scale}px`,
              animationDuration: `${bat.duration}s`,
              animationDelay: `${bat.delay}s`,
            } as React.CSSProperties
          }
          onAnimationEnd={handleAnimationEnd(bat.id)}
        >
          <div
            className="castle-bat__bob"
            style={
              {
                '--bat-amplitude': `${bat.amplitude}px`,
                animationDuration: `${bat.halfBob}s`,
              } as React.CSSProperties
            }
          >
            <div
              className="castle-bat__sprite"
              style={{
                width: SPRITE_W * bat.scale,
                height: SPRITE_H * bat.scale,
                backgroundImage: `url(${sheet})`,
                backgroundSize: `${SPRITE_W * FLAP.length * bat.scale}px ${SPRITE_H * bat.scale}px`,
                '--bat-sheet-width': `${SPRITE_W * FLAP.length * bat.scale}px`,
              } as React.CSSProperties}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Component -----------------------------------------------------------------------------

const CastleBats: React.FC = () => {
  const { theme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  return theme === 'personal' && !reducedMotion ? <BatFlock /> : null;
};

export default CastleBats;
