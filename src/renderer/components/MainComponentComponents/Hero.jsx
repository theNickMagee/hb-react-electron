import { useEffect } from 'react';
import { getCoordsFromFrameAndState } from '../../controllers/AnimationController';

const Hero = ({ data, isHovered }) => {
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
    <img
      src={icon} // setAnimationData.sprite
      alt=""
      style={{
        // width: `${w}px`, // Width of the cropped section
        // height: `${h}px`, // Height of the cropped section
        objectFit: 'contain', // Ensures that the image is not scaled
        objectPosition: `-${x}px -${y}px`, // Positioning the image to show the desired section
        opacity: isHovered ? 0.5 : 1, // Change opacity on hover
      }}
    />
  );
};

export default Hero;
