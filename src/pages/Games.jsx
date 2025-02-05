// Games1.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/games/mario-bg.svg";
import soil from "../assets/games/soil.svg";
import piranha from "../assets/games/piranha.svg";
import pipe from "../assets/games/pipe.svg";
import mole from "../assets/games/mole.svg";

const Games1 = ({ onComplete }) => {
  const navigate = useNavigate();
  const [molePosition, setMolePosition] = useState(-1);
  const [plantPosition, setPlantPosition] = useState(-1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const molePosRef = useRef(-1);
  const plantPosRef = useRef(-1);
  const clickedMole = useRef(false);

  useEffect(() => {
    if (gameOver || score >= 100) return;

    const moleInterval = setInterval(() => {
      let newMole;
      do {
        newMole = Math.floor(Math.random() * 9);
      } while (newMole === plantPosRef.current);
      
      molePosRef.current = newMole;
      setMolePosition(newMole);
      clickedMole.current = false;
    }, 750);

    const plantInterval = setInterval(() => {
      let newPlant;
      do {
        newPlant = Math.floor(Math.random() * 9);
      } while (newPlant === molePosRef.current);
      
      plantPosRef.current = newPlant;
      setPlantPosition(newPlant);
    }, 1000);

    return () => {
      clearInterval(moleInterval);
      clearInterval(plantInterval);
    };
  }, [gameOver, score]);

  const handleTileClick = (index) => {
    if (gameOver || score >= 100 || clickedMole.current) return;

    if (index === molePosRef.current) {
      clickedMole.current = true;
      const newScore = score + 10;
      setScore(newScore);
      
      setMolePosition(-1);
      molePosRef.current = -1;
      
      if (newScore >= 100) {
        setGameOver(true);
      }
    } else if (index === plantPosRef.current) {
      setGameOver(true);
    }
  };

  const handleRetry = () => {
    setScore(0);
    setGameOver(false);
    molePosRef.current = -1;
    plantPosRef.current = -1;
    setMolePosition(-1);
    setPlantPosition(-1);
  };

  // Ketika score mencapai 100, panggil onComplete untuk routing ke mindmap.
  useEffect(() => {
    if (score >= 100 && onComplete) {
      // Opsional: delay sebelum redirect (misalnya 2 detik)
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [score, onComplete]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center gap-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <h1 className="text-4xl font-bold text-white">Whac a Mole</h1>
      
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-semibold text-white">
          {score >= 100 ? "LEVEL COMPLETE! 🎉" : gameOver ? `GAME OVER: ${score}` : score}
        </h2>
        
        {(gameOver || score >= 100) && (
          <div className="flex gap-4">
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Try Again
            </button>
            {/* Jika diperlukan, tombol ini juga bisa memicu onComplete secara manual */}
            {score < 100 && (
              <button
                onClick={onComplete}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go to Mindmap →
              </button>
            )}
          </div>
        )}
      </div>

      <div 
        className="w-[540px] h-[540px] border-4 border-white rounded-2xl flex flex-wrap"
        style={{ 
          backgroundImage: `url(${soil})`,
          backgroundSize: 'cover'
        }}
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="w-1/3 h-1/3 cursor-pointer bg-cover flex items-center justify-center"
            style={{ backgroundImage: `url(${pipe})` }}
            onClick={() => handleTileClick(index)}
          >
            {index === molePosition && (
              <img 
                src={mole} 
                className="w-[100px] h-[100px] select-none pointer-events-none animate-bounce" 
                alt="mole" 
              />
            )}
            {index === plantPosition && (
              <img 
                src={piranha} 
                className="w-[100px] h-[100px] select-none pointer-events-none" 
                alt="plant" 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games1;
