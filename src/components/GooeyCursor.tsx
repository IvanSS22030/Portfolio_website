'use client'

import React, { useEffect, useRef, useState } from 'react'
import '../styles/GooeyCursor.css'

const GooeyCursor: React.FC = () => {
  const cursorLineBoxRef = useRef<HTMLDivElement>(null)
  const redDotRef = useRef<HTMLDivElement>(null)
  const redCircleRef = useRef<HTMLDivElement>(null)
  const b1Ref = useRef<HTMLDivElement>(null)
  const b2Ref = useRef<HTMLDivElement>(null)
  const b3Ref = useRef<HTMLDivElement>(null)
  
  // State to track if we're in the hero section
  const [isInHeroSection, setIsInHeroSection] = useState(true)

  useEffect(() => {
    // Scroll detection to control gooey bubbles
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      // Consider hero section as roughly the first viewport height
      // Adjust this threshold based on your actual hero section height
      const heroSectionHeight = windowHeight * 0.8 // 80% of viewport height
      
      setIsInHeroSection(scrollY < heroSectionHeight)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e

      // Position cursor lines at mouse position
      if (cursorLineBoxRef.current) {
        cursorLineBoxRef.current.style.left = `${x}px`
        cursorLineBoxRef.current.style.top = `${y}px`
      }

      // Position red dot at mouse position (immediate follow) - ALWAYS ACTIVE
      if (redDotRef.current) {
        redDotRef.current.style.left = `${x}px`
        redDotRef.current.style.top = `${y}px`
      }

      // Position red circle at mouse position (slight lag) - ALWAYS ACTIVE
      if (redCircleRef.current) {
        redCircleRef.current.style.left = `${x}px`
        redCircleRef.current.style.top = `${y}px`
      }

      // Animate gooey bubbles with different lag and physics - ONLY IN HERO SECTION
      if (isInHeroSection) {
        if (b1Ref.current) {
          // Fastest bubble - direct follow
          b1Ref.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`
        }

        if (b2Ref.current) {
          // Medium lag bubble
          const currentTransform = b2Ref.current.style.transform
          const currentX = currentTransform.includes('translate3d') 
            ? parseFloat(currentTransform.split('translate3d(')[1]?.split('px')[0] || '0')
            : 0
          const currentY = currentTransform.includes('translate3d')
            ? parseFloat(currentTransform.split('px, ')[1]?.split('px')[0] || '0')
            : 0
          
          const deltaX = (x - currentX) * 0.08
          const deltaY = (y - currentY) * 0.08
          
          const newX = currentX + deltaX
          const newY = currentY + deltaY
          
          b2Ref.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate3d(-50%, -50%, 0)`
        }

        if (b3Ref.current) {
          // Slowest lag bubble
          const currentTransform = b3Ref.current.style.transform
          const currentX = currentTransform.includes('translate3d')
            ? parseFloat(currentTransform.split('translate3d(')[1]?.split('px')[0] || '0')
            : 0
          const currentY = currentTransform.includes('translate3d')
            ? parseFloat(currentTransform.split('px, ')[1]?.split('px')[0] || '0')
            : 0
          
          const deltaX = (x - currentX) * 0.04
          const deltaY = (y - currentY) * 0.04
          
          const newX = currentX + deltaX
          const newY = currentY + deltaY
          
          b3Ref.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate3d(-50%, -50%, 0)`
        }
      }
      // When not in hero section, bubbles don't move (they stay "stuck" in their last position)
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

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('scroll', handleScroll)
    document.body.style.cursor = 'none'

    // Initialize scroll position check
    handleScroll()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('scroll', handleScroll)
      document.body.style.cursor = 'auto'
    }
  }, []) // Removed isInHeroSection dependency to fix red cursor disappearing

  return (
    <>
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

      {/* Red Dot */}
      <div 
        ref={redDotRef}
        className="mk-red-dot"
      ></div>

      {/* Red Circle */}
      <div 
        ref={redCircleRef}
        className="mk-red-circle"
      ></div>

      {/* Gooey Bubbles */}
      <div className="mk-gooery">
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