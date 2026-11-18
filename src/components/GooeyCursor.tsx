import React, { useEffect, useRef, useState } from 'react'
import { animated, to, useSpringValue } from 'react-spring'
import type { SpringConfig } from 'react-spring'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import '../styles/GooeyCursor.css'

// Same physics as muhammadaamirmalik.com: the front bubble chases the mouse with a fast
// spring and the other two chase the bubble in front of them with a heavy, slow spring
const FAST = { tension: 1200, friction: 40 }
const SLOW = { mass: 10, tension: 200, friction: 50 }

// The ring closes 1/8 of the remaining distance per 60fps frame (react-animated-cursor's trailingSpeed)
const TRAILING_SPEED = 8
const FRAME_MS = 1000 / 60

// Pointer sizes in px: normal, over a clickable / mouse pressed, and pressing a clickable
const DOT_SIZE = 8
const RING_SIZE = 30
const DOT_ACTIVE_SIZE = 16
const DOT_PRESS_SIZE = 19

const CLICKABLES = [
  'a',
  'input[type="text"]',
  'input[type="email"]',
  'input[type="number"]',
  'input[type="submit"]',
  'input[type="image"]',
  'label[for]',
  'select',
  'textarea',
  'button',
  'svg',
  '.link',
].join(',')

const trans = (x: number, y: number) => `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`

// Touch screens have no mouse to follow, so the bubble wanders through the hero on its own:
// two sine waves per axis with unrelated speeds draw a smooth path that never quite repeats.
// Fractions of the hero's width and height, and the speed of each wave in radians per second.
const wanderPath = (seconds: number, width: number, height: number) => ({
  x: width * (0.5 + 0.3 * Math.sin(seconds * 0.41) + 0.12 * Math.sin(seconds * 1.07 + 1.3)),
  y: height * (0.5 + 0.26 * Math.sin(seconds * 0.29 + 0.6) + 0.1 * Math.sin(seconds * 0.83)),
})

// After a touch the bubble waits a moment where the finger left it, then drifts back to its path
const TOUCH_HOLD_MS = 1200
const TOUCH_RETURN_MS = 1500

const smoothstep = (k: number) => k * k * (3 - 2 * k)

// useSpringValue instead of useSpring: in react-spring 10, useSpring re-applies its initial
// values on every re-render, which snapped the bubbles back to the corner on hover.
// One spring per axis, which is how react-spring animates an [x, y] array anyway.
const useBubbleSpring = (config: SpringConfig) => ({
  x: useSpringValue(0, { config }),
  y: useSpringValue(0, { config }),
})

type GooeyCursorProps = {
  // 'pointer': the bubbles and the red pointer follow the mouse.
  // 'auto' (touch screens): only the bubbles, wandering on their own and following the finger.
  mode?: 'pointer' | 'auto'
}

const GooeyCursor: React.FC<GooeyCursorProps> = ({ mode = 'pointer' }) => {
  const reducedMotion = usePrefersReducedMotion()
  const gooeyRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)

  const front = useBubbleSpring(FAST)
  const middle = useBubbleSpring(SLOW)
  const back = useBubbleSpring(SLOW)

  useEffect(() => {
    // Each slow bubble keeps chasing the bubble in front of it
    middle.x.start({ to: front.x })
    middle.y.start({ to: front.y })
    back.x.start({ to: middle.x })
    back.y.start({ to: middle.y })
  }, [front.x, front.y, middle.x, middle.y, back.x, back.y])

  useEffect(() => {
    if (mode !== 'pointer') return
    const target = { x: 0, y: 0 }
    const ring = { x: 0, y: 0 }
    let frame = 0
    let lastTime = performance.now()

    const handleMouseMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY

      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top = `${e.clientY}px`
      }

      // Bubbles live inside the hero, so use coordinates relative to it
      const rect = gooeyRef.current?.getBoundingClientRect()
      front.x.start({ to: e.clientX - (rect?.left ?? 0) })
      front.y.start({ to: e.clientY - (rect?.top ?? 0) })
    }

    // Scaled by elapsed time so the ring keeps its speed even when the page drops frames
    const animateRing = (now: number) => {
      const step = 1 - Math.pow(1 - 1 / TRAILING_SPEED, (now - lastTime) / FRAME_MS)
      lastTime = now
      ring.x += (target.x - ring.x) * step
      ring.y += (target.y - ring.y) * step
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.x}px`
        ringRef.current.style.top = `${ring.y}px`
      }
      frame = requestAnimationFrame(animateRing)
    }

    const handleMouseOver = (e: MouseEvent) => {
      setVisible(true)
      setHovering(!!(e.target as Element | null)?.closest?.(CLICKABLES))
    }

    // relatedTarget is null only when the mouse leaves the window
    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) setVisible(false)
    }

    const handleMouseDown = () => setPressed(true)
    const handleMouseUp = () => setPressed(false)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    frame = requestAnimationFrame(animateRing)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      cancelAnimationFrame(frame)
    }
  }, [mode, front.x, front.y])

  // Touch screens: the front bubble follows the wander path (or the finger), the others trail it.
  // The spring values are stable across renders; the { x, y } objects holding them are not.
  const { x: frontX, y: frontY } = front
  const { x: middleX, y: middleY } = middle
  const { x: backX, y: backY } = back
  useEffect(() => {
    if (mode !== 'auto') return
    const area = gooeyRef.current
    if (!area) return

    let frame = 0
    let onScreen = true
    let placed = false
    const start = performance.now()
    // Where the finger is (or was), and when it lifted; Infinity while it is still down
    let touch: { x: number; y: number; liftedAt: number } | null = null

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (!onScreen) return

      const { width, height } = area.getBoundingClientRect()
      // With reduced motion the bubble stays put and only moves when touched
      let { x, y } = wanderPath(reducedMotion ? 0 : (now - start) / 1000, width, height)

      if (touch) {
        const k = (now - touch.liftedAt - TOUCH_HOLD_MS) / TOUCH_RETURN_MS
        if (k >= 1) {
          touch = null
        } else {
          const blend = k <= 0 ? 0 : smoothstep(k)
          x = touch.x + (x - touch.x) * blend
          y = touch.y + (y - touch.y) * blend
        }
      }

      if (!placed) {
        // Start on the path instead of flying in from the corner
        placed = true
        ;[frontX, middleX, backX].forEach(spring => spring.set(x))
        ;[frontY, middleY, backY].forEach(spring => spring.set(y))
      }
      frontX.start({ to: x })
      frontY.start({ to: y })
    }

    const handleTouch = (e: TouchEvent) => {
      const point = e.touches[0]
      if (!point) return
      const rect = area.getBoundingClientRect()
      const x = point.clientX - rect.left
      const y = point.clientY - rect.top
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return
      touch = { x, y, liftedAt: Infinity }
    }

    const handleTouchEnd = () => {
      if (touch && touch.liftedAt === Infinity) touch.liftedAt = performance.now()
    }

    // No work while the hero is scrolled out of view
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
    })
    observer.observe(area)

    window.addEventListener('touchstart', handleTouch, { passive: true })
    window.addEventListener('touchmove', handleTouch, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchcancel', handleTouchEnd)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('touchstart', handleTouch)
      window.removeEventListener('touchmove', handleTouch)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [mode, reducedMotion, frontX, frontY, middleX, middleY, backX, backY])

  const active = hovering || pressed
  const dotSize = hovering && pressed ? DOT_PRESS_SIZE : active ? DOT_ACTIVE_SIZE : DOT_SIZE
  const ringSize = active ? 0 : RING_SIZE

  return (
    <>
      {/* Red pointer - works over the whole site; only with a mouse */}
      {mode === 'pointer' && (
        <>
          <div
            ref={ringRef}
            className="mk-red-circle"
            style={{ width: ringSize, height: ringSize, opacity: visible ? 1 : 0 }}
          ></div>
          <div
            ref={dotRef}
            className="mk-red-dot"
            style={{ width: dotSize, height: dotSize, opacity: visible ? 1 : 0 }}
          ></div>
        </>
      )}

      {/* Gooey bubbles - clipped to the hero section */}
      <div ref={gooeyRef} className="mk-gooery">
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="30" />
            <feColorMatrix
              in="blur"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 30 -7"
            />
          </filter>
        </svg>
        <div className="hooks-main">
          <div className="hooks-filter">
            <animated.div className="b1" style={{ transform: to([back.x, back.y], trans) }} />
            <animated.div className="b2" style={{ transform: to([middle.x, middle.y], trans) }} />
            <animated.div className="b3" style={{ transform: to([front.x, front.y], trans) }} />
          </div>
        </div>
      </div>
    </>
  )
}

export default GooeyCursor
