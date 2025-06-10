document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');
    const cursorBubble = document.querySelector('.cursor-bubble');
    const customCursorContainer = document.querySelector('.custom-cursor');

    // Check for accessibility and touch devices
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    if (prefersReducedMotion || isTouchDevice) {
        // Disable custom cursor for users preferring reduced motion or on touch devices
        document.body.style.cursor = 'auto'; // Revert to default system cursor
        if (customCursorContainer) {
            customCursorContainer.style.display = 'none'; // Hide custom cursor elements
        }
        return; // Exit the script if custom cursor is disabled
    }

    // Show the custom cursor if not disabled
    if (customCursorContainer) {
        customCursorContainer.style.display = 'block';
    }

    // Mouse movement tracking
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;

        // Use requestAnimationFrame to optimize rendering performance
        requestAnimationFrame(() => {
            // Update the position of all cursor elements.
            // The transform property is used for smooth, GPU-accelerated animation.
            // The centering (translate(-50%, -50%)) is handled by the CSS,
            // and the transition property in CSS creates the lag/trail effect.
            cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
            cursorCircle.style.transform = `translate(${clientX}px, ${clientY}px)`;
            cursorBubble.style.transform = `translate(${clientX}px, ${clientY}px)`;
        });
    });

    // Click animation
    document.addEventListener('mousedown', () => {
        if (!cursorDot.classList.contains('click')) {
            cursorDot.classList.add('click');
            cursorCircle.classList.add('click');
        }
    });

    document.addEventListener('mouseup', () => {
        // Remove click class after a short delay to allow animation to play
        setTimeout(() => {
            cursorDot.classList.remove('click');
            cursorCircle.classList.remove('click');
        }, 300); // Match or slightly exceed CSS transition duration
    });

    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button'); // Select all links and buttons

    interactiveElements.forEach(element => {
        element.addEventListener('mouseover', () => {
            cursorCircle.classList.add('hover-active');
            cursorBubble.classList.add('hover-active');
        });

        element.addEventListener('mouseleave', () => {
            cursorCircle.classList.remove('hover-active');
            cursorBubble.classList.remove('hover-active');
        });
    });
}); 