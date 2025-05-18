import React, { useState, useEffect, useRef } from 'react';

interface ImageCarouselProps {
  images: string[];
  className?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  hoverOverlayOpacity?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  className = '',
  overlayColor = 'black',
  overlayOpacity = 0,
  hoverOverlayOpacity = 0
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered || images.length <= 1) return;

    const timer = setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentImageIndex, isHovered, images.length]);

  // Calculate the aspect ratio of the first image to maintain consistency
  const [containerStyle, setContainerStyle] = useState<React.CSSProperties>({
    paddingBottom: '56.25%', // 16:9 aspect ratio as default
    position: 'relative',
    width: '100%',
    overflow: 'hidden'
  });
  
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    if (img && img.naturalWidth && img.naturalHeight) {
      const aspectRatio = (img.naturalHeight / img.naturalWidth) * 100;
      setContainerStyle(prev => ({
        ...prev,
        paddingBottom: `${Math.min(Math.max(aspectRatio, 40), 100)}%`
      }));
    }
  };

  const overlayStyle: React.CSSProperties = {
    backgroundColor: overlayColor,
    opacity: isHovered ? (hoverOverlayOpacity || 0) : (overlayOpacity || 0),
    transition: 'opacity 300ms ease-in-out',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: 'none' as const
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div 
        className="relative w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIndex(0);
        }}
      >
        {(overlayOpacity > 0 || hoverOverlayOpacity > 0) && (
          <div style={overlayStyle} />
        )}
        <div style={containerStyle} className="flex items-center justify-center">
          {images.map((image, index) => (
            <img
              key={index}
              ref={index === 0 ? imgRef : null}
              src={image}
              alt={`Project view ${index + 1}`}
              onLoad={index === 0 ? handleImageLoad : undefined}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                objectFit: 'contain',
                maxHeight: '100%',
                maxWidth: '100%',
                margin: '0 auto',
                display: 'block'
              }}
            />
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 w-4 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;
