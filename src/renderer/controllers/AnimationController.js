import { medusaAnimationCoords } from '../defaults/HeroAnimationDefaults';
import { gladiatorAnimationCoords } from '../defaults/HeroAnimationDefaults';

const runHeroAnimations = (heroEvents, bpm, setAnimationData) => {
  // set animation data to {
  //     heroId, state, frame
  // }

  console.log('runHeroAnimations: ', heroEvents);

  //
};

const getCoordsFromFrameAndState = (heroName, state, frame) => {
  console.log('getCoordsFromFrameAndState: ', heroName, state, frame);

  if (heroName === 'medusa') {
    const medusaState = medusaAnimationCoords[state];
    if (medusaState && frame < medusaState.frames) {
      return {
        ...medusaState.coords[frame],
        icon: medusaState.sprite, // Return the sprite (icon)
      };
    }
  }

  if (heroName === 'gladiator') {
    const gladiatorState = gladiatorAnimationCoords[state];
    if (gladiatorState && frame < gladiatorState.frames) {
      return {
        ...gladiatorState.coords[frame],
        icon: gladiatorState.sprite, // Return the sprite (icon)
      };
    }
  }

  // Default return if heroName, state, or frame is not valid
  return {
    x: 0,
    y: 0,
    w: 50,
    h: 50,
    icon: null, // Return null as default for the sprite
  };
};


export { runHeroAnimations, getCoordsFromFrameAndState };
