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
  
  // Ref to track the hero section for constraint bounds
  const heroSectionRef = useRef<HTMLElement | null>(null)
  
  // Position history buffer for bc3 delayed following (1 second delay)
  const positionHistoryRef = useRef<Array<{x: number, y: number, timestamp: number}>>([])
  const DELAY_TIME =5 // 1 second in milliseconds
  
  // Helper function to constrain positions within hero section (for professional theme)
  const constrainPosition = (x: number, y: number) => {
    const isProfessionalTheme = document.body.classList.contains('cursor-none-active')
    
    if (!isProfessionalTheme || !heroSectionRef.current) {
      return { x, y } // No constraints for personal theme or if hero section not found
    }
    
    // Con el nuevo posicionamiento absoluto, las coordenadas del ratón (e.clientY)
    // deben ajustarse por el scroll de la página para que coincidan con la posición
    // del contenedor de las burbujas.
    const scrollY = window.scrollY
    const adjustedY = y + scrollY

    const heroRect = heroSectionRef.current.getBoundingClientRect()
    
    // Los límites ahora son relativos al propio contenedor de la sección hero,
    // que es de 100vh de alto.
    const marginTop = 50
    const marginBottom = 0
    const marginSides = 50
    
    const heroTop = marginTop
    // La pared blanca es la altura de la sección menos el margen inferior.
    const heroBottom = heroRect.height - marginBottom
    const heroLeft = marginSides
    const heroRight = heroRect.width - marginSides
    
    const constrainedX = Math.max(heroLeft, Math.min(x, heroRight))
    // Usamos el 'adjustedY' que considera el scroll.
    const constrainedY = Math.max(heroTop, Math.min(adjustedY, heroBottom))
    
    return { x: constrainedX, y: constrainedY }
  }

  useEffect(() => {
    // Find the hero section for constraint bounds
    heroSectionRef.current = document.getElementById('home')
    
    const handleScroll = () => {
      const scrollY = window.scrollY
      
      // Always show gooey bubbles in professional theme, only hide on scroll for personal theme
      const shouldShowBubbles = scrollY === 0
      setShowGoeyBubbles(shouldShowBubbles)
      
      // For professional theme, always keep bubbles visible but constrained to hero area
      // For personal theme, hide when scrolling
      if (goeryContainerRef.current) {
        const isProfessionalTheme = document.body.classList.contains('cursor-none-active')
        if (isProfessionalTheme) {
          goeryContainerRef.current.style.display = 'block'
        } else {
          goeryContainerRef.current.style.display = shouldShowBubbles ? 'block' : 'none'
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e

      // Para el nuevo posicionamiento absoluto, necesitamos la posición del ratón
      // relativa al elemento #home, no a la ventana.
      const heroRect = heroSectionRef.current?.getBoundingClientRect()
      const relativeX = x - (heroRect?.left || 0)
      const relativeY = y - (heroRect?.top || 0)

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

      // Animate gooey bubbles - always for professional theme, only at scroll=0 for personal theme
      const isProfessionalTheme = document.body.classList.contains('cursor-none-active')
      const shouldAnimateBubbles = isProfessionalTheme || (showGoeyBubbles && window.scrollY === 0)
      
      if (shouldAnimateBubbles) {
        // Center bubble 1 - follows mouse with specified speed
        if (bc1Ref.current) {
          const currentTransform = bc1Ref.current.style.transform
          const currentX = currentTransform.includes('translate3d') 
            ? parseFloat(currentTransform.split('translate3d(')[1]?.split('px')[0] || '0')
            : relativeX
          const currentY = currentTransform.includes('translate3d')
            ? parseFloat(currentTransform.split('px, ')[1]?.split('px')[0] || '0')
            : relativeY
          
          // Original bubble: 0.025 speed with constraints
          const deltaX = (relativeX - currentX) * 0.025
          const deltaY = (relativeY - currentY) * 0.025
          
          const targetX = currentX + deltaX
          const targetY = currentY + deltaY
          
          // Apply constraints for professional theme
          const constrainedPos = constrainPosition(targetX, targetY)
          const newX = constrainedPos.x
          const newY = constrainedPos.y
          
          bc1Ref.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate3d(-50%, -50%, 0)`
          
          // Save bc1 position to history for bc3 delayed following
          const currentTime = Date.now()
          positionHistoryRef.current.push({
            x: newX,
            y: newY,
            timestamp: currentTime
          })
          
          // Clean old positions (older than delay time + 500ms buffer)
          positionHistoryRef.current = positionHistoryRef.current.filter(
            pos => currentTime - pos.timestamp <= DELAY_TIME + 150
          )
        }

        // Center bubble 2 - follows bc1 with slight delay (keep original behavior)
        if (bc2Ref.current) {
          const currentTransform = bc2Ref.current.style.transform
          const currentX = currentTransform.includes('translate3d') 
            ? parseFloat(currentTransform.split('translate3d(')[1]?.split('px')[0] || '0')
            : relativeX
          const currentY = currentTransform.includes('translate3d')
            ? parseFloat(currentTransform.split('px, ')[1]?.split('px')[0] || '0')
            : relativeY
          
          const deltaX = (relativeX - currentX) * 0.15 // Moderate lag for fluid effect
          const deltaY = (relativeY - currentY) * 0.15
          
          const targetX = currentX + deltaX
          const targetY = currentY + deltaY
          
          // Apply constraints for professional theme
          const constrainedPos = constrainPosition(targetX, targetY)
          const newX = constrainedPos.x
          const newY = constrainedPos.y
          
          bc2Ref.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate3d(-50%, -50%, 0)`
        }

        // Center bubble 3 - clone with 1 second delay following bc1's old trajectory
        if (bc3Ref.current) {
          const currentTime = Date.now()
          
          // Find the position from 1 second ago
          const targetPosition = positionHistoryRef.current.find(
            pos => currentTime - pos.timestamp >= DELAY_TIME
          )
          
          if (targetPosition) {
            // Get current bc3 position
            const currentTransform = bc3Ref.current.style.transform
            const currentX = currentTransform.includes('translate3d') 
              ? parseFloat(currentTransform.split('translate3d(')[1]?.split('px')[0] || '0')
              : targetPosition.x
            const currentY = currentTransform.includes('translate3d')
              ? parseFloat(currentTransform.split('px, ')[1]?.split('px')[0] || '0')
              : targetPosition.y
            
            // bc3 follows the 1-second-old position of bc1
            const deltaX = (targetPosition.x - currentX) * 0.08
            const deltaY = (targetPosition.y - currentY) * 0.08
            
            const targetX = currentX + deltaX
            const targetY = currentY + deltaY
            
            // Apply constraints for professional theme
            const constrainedPos = constrainPosition(targetX, targetY)
            const newX = constrainedPos.x
            const newY = constrainedPos.y
            
            bc3Ref.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate3d(-50%, -50%, 0)`
          } else {
            // If no history yet, follow bc1 directly (fallback for first second)
            const bc1Transform = bc1Ref.current?.style.transform || ''
            const bc1X = bc1Transform.includes('translate3d') 
              ? parseFloat(bc1Transform.split('translate3d(')[1]?.split('px')[0] || '0')
              : relativeX
            const bc1Y = bc1Transform.includes('translate3d')
              ? parseFloat(bc1Transform.split('px, ')[1]?.split('px')[0] || '0')
              : relativeY
            
            const currentTransform = bc3Ref.current.style.transform
            const currentX = currentTransform.includes('translate3d') 
              ? parseFloat(currentTransform.split('translate3d(')[1]?.split('px')[0] || '0')
              : bc1X
            const currentY = currentTransform.includes('translate3d')
              ? parseFloat(currentTransform.split('px, ')[1]?.split('px')[0] || '0')
              : bc1Y
            
            const deltaX = (bc1X - currentX) * 0.015
            const deltaY = (bc1Y - currentY) * 0.015
            
            const targetX = currentX + deltaX
            const targetY = currentY + deltaY
            
            // Apply constraints for professional theme
            const constrainedPos = constrainPosition(targetX, targetY)
            const newX = constrainedPos.x
            const newY = constrainedPos.y
            
            bc3Ref.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate3d(-50%, -50%, 0)`
          }
        }

        if (b1Ref.current) {
          // Fastest large bubble - follows mouse with slight delay
          const currentTransform = b1Ref.current.style.transform
          const currentX = currentTransform.includes('translate3d') 
            ? parseFloat(currentTransform.split('translate3d(')[1]?.split('px')[0] || '0')
            : relativeX
          const currentY = currentTransform.includes('translate3d')
            ? parseFloat(currentTransform.split('px, ')[1]?.split('px')[0] || '0')
            : relativeY
          
          // Fast bubble: 0.08 speed with constraints
          const deltaX = (relativeX - currentX) * 0.08
          const deltaY = (relativeY - currentY) * 0.08
          
          const targetX = currentX + deltaX
          const targetY = currentY + deltaY
          
          // Apply constraints for professional theme
          const constrainedPos = constrainPosition(targetX, targetY)
          const newX = constrainedPos.x
          const newY = constrainedPos.y
          
          b1Ref.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate3d(-50%, -50%, 0)`
        }

        if (b2Ref.current) {
          // Medium speed large bubble - follows mouse with more delay
          const currentTransform = b2Ref.current.style.transform
          const currentX = currentTransform.includes('translate3d') 
            ? parseFloat(currentTransform.split('translate3d(')[1]?.split('px')[0] || '0')
            : relativeX
          const currentY = currentTransform.includes('translate3d')
            ? parseFloat(currentTransform.split('px, ')[1]?.split('px')[0] || '0')
            : relativeY
          
          // Medium speed bubble: 0.04 speed with constraints
          const deltaX = (relativeX - currentX) * 0.04
          const deltaY = (relativeY - currentY) * 0.04
          
          const targetX = currentX + deltaX
          const targetY = currentY + deltaY
          
          // Apply constraints for professional theme
          const constrainedPos = constrainPosition(targetX, targetY)
          const newX = constrainedPos.x
          const newY = constrainedPos.y
          
          b2Ref.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate3d(-50%, -50%, 0)`
        }

        if (b3Ref.current) {
          // Slowest large bubble - very delayed follow
          const currentTransform = b3Ref.current.style.transform
          const currentX = currentTransform.includes('translate3d') 
            ? parseFloat(currentTransform.split('translate3d(')[1]?.split('px')[0] || '0')
            : relativeX
          const currentY = currentTransform.includes('translate3d')
            ? parseFloat(currentTransform.split('px, ')[1]?.split('px')[0] || '0')
            : relativeY
          
          // Slow bubble: 0.02 speed with constraints
          const deltaX = (relativeX - currentX) * 0.02
          const deltaY = (relativeY - currentY) * 0.02
          
          const targetX = currentX + deltaX
          const targetY = currentY + deltaY
          
          // Apply constraints for professional theme
          const constrainedPos = constrainPosition(targetX, targetY)
          const newX = constrainedPos.x
          const newY = constrainedPos.y
          
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