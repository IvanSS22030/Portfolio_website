import React, { useState } from 'react';
import { favoriteGames } from '../data/games';
import { useTheme } from '../context/ThemeContext';

const FavoriteGames: React.FC = () => {
  const { theme } = useTheme();
  const [activeGame, setActiveGame] = useState<number | null>(null);

  // Only render in personal mode
  if (theme !== 'personal') {
    return null;
  }

  // Function to determine if video is YouTube or local
  const isYouTubeVideo = (videoUrl: string) => {
    return videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  };

  return (
    <section id="games" className="py-20 bg-black bg-opacity-95">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-500 mb-12 font-serif">Legendary Games I love </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {favoriteGames.map((game) => (
            <div
              key={game.id}
              className="relative overflow-hidden rounded-lg border border-amber-900 shadow-lg h-80 group cursor-pointer"
              onMouseEnter={() => setActiveGame(game.id)}
              onMouseLeave={() => setActiveGame(null)}
            >
              {/* Game Image */}
              <img
                src={game.image}
                alt={game.title}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                style={{
                  opacity: activeGame === game.id ? 0 : 1,
                  objectPosition: game.title === "Resident Evil 4" ? "center 30%" : "center center"
                }}
              />
              
              {/* Video Layer (kept mounted to preserve playback position) */}
              {game.video && (
                <div
                  className={`absolute inset-0 w-full h-full bg-black z-10 transition-opacity duration-300 ${
                    activeGame === game.id ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden={activeGame === game.id ? 'false' : 'true'}
                >
                  {isYouTubeVideo(game.video) ? (
                    <iframe
                      title={game.title}
                      src={`${game.video}${game.video.includes('?') ? '&' : '?'}autoplay=1&mute=1&controls=0&loop=1&playlist=${encodeURIComponent(
                        game.video.split('/').pop() || ''
                      )}&modestbranding=1&iv_load_policy=3&rel=0&disablekb=1&fs=0&playsinline=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      loading="lazy"
                      allowFullScreen
                      className="w-full h-full pointer-events-none"
                    ></iframe>
                  ) : (
                    <video
                      key={game.id}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={game.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {/* Mask top area to visually hide YouTube's top bar */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-black/80"
                  />
                </div>
              )}
              
              {/* Game Info Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-6 text-white z-20 pointer-events-none">
                <h3 className="text-xl font-bold text-amber-400 font-serif mb-2">{game.title}</h3>
                <p className="text-amber-200">{game.description}</p>
              </div>
              
              {/* Hover indicator */}
              <div className="absolute top-4 right-4 bg-amber-900 text-amber-200 px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none">
                Hover to Preview
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FavoriteGames;