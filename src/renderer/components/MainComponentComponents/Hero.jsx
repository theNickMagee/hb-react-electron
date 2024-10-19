import { useEffect } from 'react';
import { getCoordsFromFrameAndState } from '../../controllers/AnimationController';

const Hero = ({ data, isHovered, cellSize }) => {
  useEffect(() => {
    console.log('Hero data:', data);
  }, [data]);

  const { x, y, w, h, icon } = getCoordsFromFrameAndState(
    data.options[0].value,
    data.options[0].currentState,
    data.options[0].currentFrame,
  );

  console.log('hero coords:', x, y, w, h, icon);

  return (
    <div
      style={{
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        overflow: 'hidden',
      }}
    >
      {' '}
      {/* Added overflow: hidden */}
      <div
        style={{
          width: `${w}px`, // Width of the frame to display
          height: `${h}px`, // Height of the frame to display
          backgroundImage: `url(${icon})`, // Sprite sheet as background
          backgroundPosition: `-${x}px -${y}px`, // Position to show the correct frame
          backgroundRepeat: 'no-repeat', // Do not repeat the background image
          opacity: isHovered ? 0.5 : 1, // Adjust opacity on hover
          transform: `scale(${cellSize / w}, ${cellSize / h})`, // Scale to fit within 50x50 div
          transformOrigin: 'top left', // Keep the scale origin at the top-left corner
        }}
      />
    </div>
  );
};

export default Hero;
