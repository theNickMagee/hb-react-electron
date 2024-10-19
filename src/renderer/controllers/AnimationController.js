import { medusaAnimationCoords } from '../defaults/HeroAnimationDefaults';
import { gladiatorAnimationCoords } from '../defaults/HeroAnimationDefaults';

class HeroStateChange {
  constructor(heroId, time, newState, newFrame) {
    this.heroId = heroId;
    this.time = time;
    this.newState = newState;
    this.newFrame = newFrame;
  }
}

const runHeroAnimations = (heroEvents, bpm, data, setData) => {
  // loop thru events and create prpoper state changes

  // heroEvents is an odd object
  // [{events: [{heroId, targetBoardObjectId, measure}], path: []

  let stateChanges = [];

  console.log('runHeroAnimations: ', heroEvents);

  // will need to find hero and set options[0] currentFrame and currentState accordingly
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
