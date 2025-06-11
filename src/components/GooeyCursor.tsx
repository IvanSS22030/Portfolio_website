'use client'

import React, { useEffect, useRef, useState } from 'react'
import '../styles/GooeyCursor.css'

const GooeyCursor: React.FC = () => {
  const cursorLineBoxRef = useRef<HTMLDivElement>(null)
  const redDotRef = useRef<HTMLDivElement>(null)
  const redCircleRef = useRef<HTMLDivElement>(null)
  const goeryContainerRef = useRef<HTMLDivElement>(null)
  const bc1Ref = useRef<HTMLDivElement>(null) // Center bubble 1 (follows mouse directly)
  const bc2Ref = useRef<HTMLDivElement>(null) // Center bubble 2 (follows bc1)
  const bc3Ref = useRef<HTMLDivElement>(null) // Center bubble 3 (follows red circle for fluid animation)
  const b1Ref = useRef<HTMLDivElement>(null)
  const b2Ref = useRef<HTMLDivElement>(null)
  const b3Ref = useRef<HTMLDivElement>(null)
  
  // State to track if we should show gooey bubbles (only when scroll is 0)
  const [showGoeyBubbles, setShowGoeyBubbles] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      
      // Only show gooey bubbles when there's absolutely no scroll
      const shouldShowBubbles = scrollY === 0
      setShowGoeyBubbles(shouldShowBubbles)
      
      // Immediately hide the container when scrolling
      if (goeryContainerRef.current) {
        goeryContainerRef.current.style.display = shouldShowBubbles ? 'block' : 'none'
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e

      // Position cursor lines at mouse position (GLOBAL)
      if (cursorLineBoxRef.current) {
        cursorLineBoxRef.current.style.left = `${x}px`
        cursorLineBoxRef.current.style.top = `${y}px`
      }

      // Position red dot at mouse position (GLOBAL - always active)
      if (redDotRef.current) {
        redDotRef.current.style.left = `${x}px`
        redDotRef.current.style.top = `${y}px`
      }

      // Position red circle to follow red dot with more delay (GLOBAL - always active)
      if (redCircleRef.current) {
        const currentLeft = parseFloat(redCircleRef.current.style.left) || x
        const currentTop = parseFloat(redCircleRef.current.style.top) || y
        
        // Reduced speed to 50% for ultra smooth fluid animation (was 0.08, now 0.032)
        const deltaX = (x - currentLeft) * 0.025
        const deltaY = (y - currentTop) * 0.025
        
        const newX = currentLeft + deltaX
        const newY = currentTop + deltaY
        
        redCircleRef.current.style.left = `${newX}px`
        redCircleRef.current.style.top = `${newY}px`
      }

      // Animate gooey bubbles ONLY when we haven't scrolled at all
      if (showGoeyBubbles && window.scrollY === 0) {
        // Center bubble 1 - follows mouse with specified speed
        if (bc1Ref.current) {
          const currentTransform = bc1Ref.current.style.transform
          const currentX = currentTransform.includes('translate3d') 
            ? parseFloat(currentTransform.split('translate3d(')[1]?.split('px')[0] || '0')
            : x
          const currentY = currentTransform.includes('translate3d')
            ? parseFloat(currentTransform.split('px, ')[1]?.split('px')[0] || '0')
            : y
          
          // Original bubble: 0.025 speed
          const deltaX = (x - currentX) * 0.025
          const deltaY = (y - currentY) * 0.025
          
          const newX = currentX + deltaX
          const newY = currentY + deltaY
          
          bc1Ref.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate3d(-50%, -50%, 0)`
        }

        // Center bubble 2 - follows bc1 with slight delay (keep original behavior)
        if (bc2Ref.current) {
          const currentTransform = bc2Ref.current.style.transform
          const currentX = currentTransform.includes('translate3d') 
            ? parseFloat(currentTransform.split('translate3d(')[1]?.split('px')[0] || '0')
            : x
          const currentY = currentTransform.includes('translate3d')
            ? parseFloat(currentTransform.split('px, ')[1]?.split('px')[0] || '0')
            : y
          
          const deltaX = (x - currentX) * 0.15 // Moderate lag for fluid effect
          const deltaY = (y - currentY) * 0.15
          
          const newX = currentX + deltaX
          const newY = currentY + deltaY
          
          bc2Ref.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate3d(-50%, -50%, 0)`
        }

        // Center bubble 3 - clone of the original with specified speed
        if (bc3Ref.current && bc1Ref.current) {
          // Extract bc1 position from its transform
          const bc1Transform = bc1Ref.current.style.transform
          const bc1X = bc1Transform.includes('translate3d') 
            ? parseFloat(bc1Transform.split('translate3d(')[1]?.split('px')[0] || '0')
            : x
          const bc1Y = bc1Transform.includes('translate3d')
            ? parseFloat(bc1Transform.split('px, ')[1]?.split('px')[0] || '0')
            : y
          
          // Get current bc3 position
          const currentTransform = bc3Ref.current.style.transform
          const currentX = currentTransform.includes('translate3d') 
            ? parseFloat(currentTransform.split('translate3d(')[1]?.split('px')[0] || '0')
            : bc1X
          const currentY = currentTransform.includes('translate3d')
            ? parseFloat(currentTransform.split('px, ')[1]?.split('px')[0] || '0')
            : bc1Y
          
          // Clone bubble: temporarily increased to 0.015 for visibility testing
          const deltaX = (bc1X - currentX) * 0.015
          const deltaY = (bc1Y - currentY) * 0.015
          
          const newX = currentX + deltaX
          const newY = currentY + deltaY
          
          bc3Ref.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate3d(-50%, -50%, 0)`
          
          // Debug: log to verify bc3 is moving
          if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) {
            console.log('BC3 Clone moving:', { newX, newY, deltaX, deltaY })
          }
        }

        if (b1Ref.current) {
          // Fastest large bubble - follows mouse with slight delay
          const currentTransform = b1Ref.current.style.transform
          const currentX = currentTransform.includes('translate3d') 
            ? parseFloat(currentTransform.split('translate3d(')[1]?.split('px')[0] || '0')
            : x
          const currentY = currentTransform.includes('translate3d')
            ? parseFloat(currentTransform.split('px, ')[1]?.split('px')[0] || '0')
            : y
          
          const deltaX = (x - currentX) * 0.12
          const deltaY = (y - currentY) * 0.12
          
          const newX = currentX + deltaX
          const newY = currentY + deltaY
          
          b1Ref.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate3d(-50%, -50%, 0)`
        }

        if (b2Ref.current) {
          // Outside yellow bubble with specified speed
          const currentTransform = b2Ref.current.style.transform
          const currentX = currentTransform.includes('translate3d') 
            ? parseFloat(currentTransform.split('translate3d(')[1]?.split('px')[0] || '0')
            : x
          const currentY = currentTransform.includes('translate3d')
            ? parseFloat(currentTransform.split('px, ')[1]?.split('px')[0] || '0')
            : y
          
          // Outside yellow bubble: 0.015 speed
          const deltaX = (x - currentX) * 0.010
          const deltaY = (y - currentY) * 0.010
          
          const newX = currentX + deltaX
          const newY = currentY + deltaY
          
          b2Ref.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate3d(-50%, -50%, 0)`
        }

        if (b3Ref.current) {
          // Slowest lag bubble
          const currentTransform = b3Ref.current.style.transform
          const currentX = currentTransform.includes('translate3d')
            ? parseFloat(currentTransform.split('translate3d(')[1]?.split('px')[0] || '0')
            : x
          const currentY = currentTransform.includes('translate3d')
            ? parseFloat(currentTransform.split('px, ')[1]?.split('px')[0] || '0')
            : y
          
          const deltaX = (x - currentX) * 0.04
          const deltaY = (y - currentY) * 0.04
          
          const newX = currentX + deltaX
          const newY = currentY + deltaY
          
          b3Ref.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate3d(-50%, -50%, 0)`
        }
      }
    }

    const handleMouseDown = () => {
      if (cursorLineBoxRef.current) {
        cursorLineBoxRef.current.classList.add('active')
      }
      if (redDotRef.current) {
        redDotRef.current.classList.add('click')
      }
      if (redCircleRef.current) {
        redCircleRef.current.classList.add('click')
      }
    }

    const handleMouseUp = () => {
      if (cursorLineBoxRef.current) {
        cursorLineBoxRef.current.classList.remove('active')
      }
      if (redDotRef.current) {
        redDotRef.current.classList.remove('click')
      }
      if (redCircleRef.current) {
        redCircleRef.current.classList.remove('click')
      }
    }

    // Use requestAnimationFrame for smooth animation
    let animationFrameId: number
    const animate = (e: MouseEvent) => {
      handleMouseMove(e)
      animationFrameId = requestAnimationFrame(() => animate(e))
    }
    
    const onMouseMove = (e: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      animate(e)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('scroll', handleScroll)
    document.body.style.cursor = 'none'

    // Initialize scroll position check
    handleScroll()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('scroll', handleScroll)
      document.body.style.cursor = 'auto'
    }
  }, [showGoeyBubbles])

  return (
    <>
      {/* Global Cursor Elements - Work everywhere on the website */}
      
      {/* Cursor Lines */}
      <div 
        ref={cursorLineBoxRef}
        className="mk-cursor-line-box" 
        style={{ top: 0, left: 0 }}
      >
        <div className="mk-cursor-line-right-1"></div>
        <div className="mk-cursor-line-right-2"></div>
        <div className="mk-cursor-line-bottom-1"></div>
        <div className="mk-cursor-line-bottom-2"></div>
      </div>

      {/* Red Dot - Global Cursor */}
      <div 
        ref={redDotRef}
        className="mk-red-dot"
      ></div>

      {/* Red Circle - Global Cursor */}
      <div 
        ref={redCircleRef}
        className="mk-red-circle"
      ></div>

      {/* Hero Section Only - Gooey Bubbles (Completely hidden when scrolled) */}
      <div 
        ref={goeryContainerRef}
        className="mk-gooery"
        style={{ display: showGoeyBubbles ? 'block' : 'none' }}
      >
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
            {/* Center bubbles - create the main fluid animation */}
            <div 
              ref={bc1Ref}
              className="bc1" 
              style={{ transform: 'translate3d(0px, 0px, 0) translate3d(-50%, -50%, 0)' }}
            ></div>
            <div 
              ref={bc2Ref}
              className="bc2" 
              style={{ transform: 'translate3d(0px, 0px, 0) translate3d(-50%, -50%, 0)' }}
            ></div>
            <div 
              ref={bc3Ref}
              className="bc3" 
              style={{ transform: 'translate3d(0px, 0px, 0) translate3d(-50%, -50%, 0)' }}
            ></div>
            {/* Large decorative bubbles */}
            <div 
              ref={b1Ref}
              className="b1" 
              style={{ transform: 'translate3d(0px, 0px, 0) translate3d(-50%, -50%, 0)' }}
            ></div>
            <div 
              ref={b2Ref}
              className="b2" 
              style={{ transform: 'translate3d(0px, 0px, 0) translate3d(-50%, -50%, 0)' }}
            ></div>
            <div 
              ref={b3Ref}
              className="b3" 
              style={{ transform: 'translate3d(0px, 0px, 0) translate3d(-50%, -50%, 0)' }}
            ></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GooeyCursor 