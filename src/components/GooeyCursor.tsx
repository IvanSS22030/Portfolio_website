'use client'

import React, { useEffect, useRef, useState } from 'react'
import { animated, to, useSpringValue } from 'react-spring'
import type { SpringConfig } from 'react-spring'
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

// useSpringValue instead of useSpring: in react-spring 10, useSpring re-applies its initial
// values on every re-render, which snapped the bubbles back to the corner on hover.
// One spring per axis, which is how react-spring animates an [x, y] array anyway.
const useBubbleSpring = (config: SpringConfig) => ({
  x: useSpringValue(0, { config }),
  y: useSpringValue(0, { config }),
})

const GooeyCursor: React.FC = () => {
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
  }, [front.x, front.y])

  const active = hovering || pressed
  const dotSize = hovering && pressed ? DOT_PRESS_SIZE : active ? DOT_ACTIVE_SIZE : DOT_SIZE
  const ringSize = active ? 0 : RING_SIZE

  return (
    <>
      {/* Red pointer - works over the whole site */}
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
