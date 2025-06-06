import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Componente que maneja el fondo estilo Castlevania para el tema personal
 */
const CastlevaniaBackground: React.FC = () => {
  const { theme } = useTheme();
  
  useEffect(() => {
    // Solo aplicar estilos cuando el tema es personal
    if (theme === 'personal') {
      // Crear elemento de estilo
      const styleElement = document.createElement('style');
      styleElement.id = 'castlevania-bg-style';
      
      // Aplicar estilos exactamente como en la página original de Castlevania
      styleElement.textContent = `
        body.theme-personal {
          position: relative;
          height: 100%;
          color: #eee;
          word-wrap: break-word;
          overflow-wrap: break-word;
          background: #000;
        }
        
        body.theme-personal::before {
          content: "";
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('/images/background.png') top center / contain no-repeat;
          z-index: -1;
        }
        
        @media only screen and (min-width: 980px) {
          body.theme-personal::before {
            background: url('/images/background.png') top center / cover no-repeat;
          }
        }
      `;
      
      // Añadir el estilo al head
      document.head.appendChild(styleElement);
    } else {
      // Eliminar estilos si el tema no es personal
      const existingStyle = document.getElementById('castlevania-bg-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    }
    
    return () => {
      // Limpieza al desmontar
      const existingStyle = document.getElementById('castlevania-bg-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [theme]);
  
  // Este componente no renderiza nada visible
  return null;
};

export default CastlevaniaBackground;
