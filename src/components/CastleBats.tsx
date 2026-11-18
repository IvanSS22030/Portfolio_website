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

// --- Death ---------------------------------------------------------------------------------

// A shot bat bursts into flames: a 16x16 fireball that grows, hollows out and fades in 6 frames
const BURST_SIZE = 16;
const BURST_FRAMES = 6;
const BURST_COLORS = ['#5C1428', '#C8302C', '#FF8A2A', '#FFE066', '#FFFFFF']; // coolest to hottest
const BURST_RADIUS = [2.5, 4.5, 6, 7, 7.6, 7.9];
const BURST_HOLE = [0, 0, 1.5, 3.5, 5.2, 6.6]; // the middle burns out first
const BURST_DENSITY = [1, 0.95, 0.85, 0.6, 0.4, 0.2]; // share of pixels still lit

// Fixed noise, so every burst looks the same
const noise = (x: number, y: number, frame: number) => {
  const s = Math.sin(x * 12.9898 + y * 78.233 + frame * 37.719) * 43758.5453;
  return s - Math.floor(s);
};

const drawBurstSheet = () => {
  const canvas = document.createElement('canvas');
  canvas.width = BURST_SIZE * BURST_FRAMES;
  canvas.height = BURST_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  for (let frame = 0; frame < BURST_FRAMES; frame++) {
    for (let y = 0; y < BURST_SIZE; y++) {
      for (let x = 0; x < BURST_SIZE; x++) {
        const d = Math.hypot(x + 0.5 - BURST_SIZE / 2, y + 0.5 - BURST_SIZE / 2);
        const n = noise(x, y, frame);
        if (d > BURST_RADIUS[frame] || n > BURST_DENSITY[frame]) continue;
        if (d < BURST_HOLE[frame] && n > 0.15) continue;
        // Hotter in the middle and early on
        const heat = 1 - (d / BURST_RADIUS[frame]) * 0.55 - frame * 0.13 + (n - 0.5) * 0.2;
        const color = Math.min(BURST_COLORS.length - 1, Math.max(0, Math.floor(heat * BURST_COLORS.length)));
        ctx.fillStyle = BURST_COLORS[color];
        ctx.fillRect(frame * BURST_SIZE + x, y, 1, 1);
      }
    }
  }
  return canvas.toDataURL('image/png');
};

// A short 8-bit death cry made on the spot: a falling square-wave screech over a burst of noise
let audioContext: AudioContext | null = null;
const playDeathSound = () => {
  try {
    audioContext ??= new AudioContext();
    const ctx = audioContext;
    if (ctx.state === 'suspended') void ctx.resume();
    const t = ctx.currentTime;

    const volume = ctx.createGain();
    volume.gain.value = 0.1;
    volume.connect(ctx.destination);

    const screech = ctx.createOscillator();
    const screechGain = ctx.createGain();
    screech.type = 'square';
    screech.frequency.setValueAtTime(1200, t);
    screech.frequency.exponentialRampToValueAtTime(90, t + 0.22);
    screechGain.gain.setValueAtTime(0.5, t);
    screechGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    screech.connect(screechGain).connect(volume);
    screech.start(t);
    screech.stop(t + 0.26);

    const length = Math.floor(ctx.sampleRate * 0.3);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2;
    const crackle = ctx.createBufferSource();
    const crackleGain = ctx.createGain();
    crackle.buffer = buffer;
    crackleGain.gain.value = 0.6;
    crackle.connect(crackleGain).connect(volume);
    crackle.start(t);
  } catch {
    // No Web Audio: the bat dies in silence
  }
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
  dead?: boolean;
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
  const [burstSheet] = useState(drawBurstSheet);
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

  const removeBat = (id: number) => setBats(current => current.filter(bat => bat.id !== id));

  // A bat leaves the list once it has crossed the screen (the bob and the flap never end)
  const handleAnimationEnd = (id: number) => (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) removeBat(id);
  };

  // Click or tap: the bat freezes in the air, flashes and bursts; it leaves when the flames die out
  const killBat = (id: number) => {
    playDeathSound();
    setBats(current => current.map(bat => (bat.id === id ? { ...bat, dead: true } : bat)));
  };

  return (
    <div className="castle-bats" aria-hidden="true">
      {bats.map(bat => (
        <div
          key={bat.id}
          className={`castle-bat${bat.rtl ? ' castle-bat--rtl' : ''}${bat.dead ? ' castle-bat--dead' : ''}`}
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
              onPointerDown={bat.dead ? undefined : () => killBat(bat.id)}
            />
            {bat.dead && (
              <div
                className="castle-bat__burst"
                style={{
                  left: ((SPRITE_W - BURST_SIZE) / 2) * bat.scale,
                  top: ((SPRITE_H - BURST_SIZE) / 2) * bat.scale,
                  width: BURST_SIZE * bat.scale,
                  height: BURST_SIZE * bat.scale,
                  backgroundImage: `url(${burstSheet})`,
                  backgroundSize: `${BURST_SIZE * BURST_FRAMES * bat.scale}px ${BURST_SIZE * bat.scale}px`,
                  '--burst-sheet-width': `${BURST_SIZE * BURST_FRAMES * bat.scale}px`,
                } as React.CSSProperties}
                onAnimationEnd={() => removeBat(bat.id)}
              />
            )}
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
