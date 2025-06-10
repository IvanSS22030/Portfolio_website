'use client'

import React, { useEffect, useRef } from 'react'
import '../styles/GooeyCursor.css'

const GooeyCursor: React.FC = () => {
  const cursorLineBoxRef = useRef<HTMLDivElement>(null)
  const b1Ref = useRef<HTMLDivElement>(null)
  const b2Ref = useRef<HTMLDivElement>(null)
  const b3Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e

      // Position cursor lines at mouse position
      if (cursorLineBoxRef.current) {
        cursorLineBoxRef.current.style.left = `${x}px`
        cursorLineBoxRef.current.style.top = `${y}px`
      }

      // Animate gooey bubbles with different lag and physics
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

    const handleMouseDown = () => {
      if (cursorLineBoxRef.current) {
        cursorLineBoxRef.current.classList.add('active')
      }
    }

    const handleMouseUp = () => {
      if (cursorLineBoxRef.current) {
        cursorLineBoxRef.current.classList.remove('active')
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'auto'
    }
  }, [])

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