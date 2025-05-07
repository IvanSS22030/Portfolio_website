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

  return (
    <section id="games" className="py-20 bg-black bg-opacity-95">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-500 mb-12 font-serif">Legendary Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {favoriteGames.map((game) => (
            <div
              key={game.id}
              className="relative overflow-hidden rounded-lg border border-amber-900 shadow-lg h-80 group"
              onMouseEnter={() => setActiveGame(game.id)}
              onMouseLeave={() => setActiveGame(null)}
            >
              {/* Game Image */}
              <img
                src={game.image}
                alt={game.title}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                style={{ opacity: activeGame === game.id ? 0 : 1 }}
              />
              
              {/* Hover Video */}
              {activeGame === game.id && (
                <div className="absolute inset-0 w-full h-full bg-black">
                  <iframe
                    title={game.title}
                    src={`${game.video}?autoplay=1&mute=1&controls=0&loop=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              )}
              
              {/* Game Info Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold text-amber-400 font-serif mb-2">{game.title}</h3>
                <p className="text-amber-200">{game.description}</p>
              </div>
              
              {/* Hover indicator */}
              <div className="absolute top-4 right-4 bg-amber-900 text-amber-200 px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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