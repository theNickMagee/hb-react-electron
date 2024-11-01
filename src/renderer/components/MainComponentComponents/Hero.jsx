import { useEffect } from 'react';
import { getCoordsFromFrameAndState } from '../../controllers/AnimationController';

const Hero = ({ data, isHovered, cellSize }) => {
  const { x, y, w, h, icon } = getCoordsFromFrameAndState(
    data.options[0].value,
    data.options[0].currentState,
    data.options[0].currentFrame,
  );

  const hasOffset =
    data.options[0].offsetX !== undefined &&
    data.options[0].offsetY !== undefined;

  return (
    <div
      style={{
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        overflow: 'hidden',
        position: hasOffset ? 'fixed' : 'relative',
        left: hasOffset ? `${data.options[0].offsetX}px` : '0',
        top: hasOffset ? `${data.options[0].offsetY}px` : '0',
        zIndex: hasOffset ? 1000 : 1,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: `${w}px`,
          height: `${h}px`,
          backgroundImage: `url(${icon})`,
          backgroundPosition: `-${x}px -${y}px`,
          backgroundRepeat: 'no-repeat',
          opacity: isHovered ? 0.5 : 1,
          transform: `scale(${cellSize / w}, ${cellSize / h})`,
          transformOrigin: 'top left',
        }}
      />
    </div>
  );
};

export default Hero;
