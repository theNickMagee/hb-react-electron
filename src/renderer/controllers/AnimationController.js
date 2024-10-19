import { medusaAnimationCoords } from '../defaults/HeroAnimationDefaults';
import { gladiatorAnimationCoords } from '../defaults/HeroAnimationDefaults';
import { getMasterTimeOfEvent } from '../services/HeroServices';

class HeroStateChange {
  constructor(heroId, time, newState, newFrame, targetBoardObjectId) {
    this.heroId = heroId;
    this.time = time;
    this.newState = newState;
    this.newFrame = newFrame;
    this.targetBoardObjectId = targetBoardObjectId;
  }
}

const runHeroAnimations = (heroEvents, bpm, data, setData) => {
  // loop thru events and create prpoper state changes
  console.log('runHeroAnimations: ', heroEvents, bpm, data);
  // heroEvents is an odd object
  // {paths: [events: [{heroId, targetBoardObjectId, measure}]]}

  // we wil use only the events array

  let stateChanges = createHeroStateChanges(heroEvents, bpm);

  console.log('runHeroAnimations stateChanges: ', stateChanges);

  // will need to find hero and set options[0] currentFrame and currentState accordingly
};

const createHeroStateChanges = (heroEvents, bpm) => {
  let allEvents = [];

  for (let i = 0; i < heroEvents.paths.length; i++) {
    for (let j = 0; j < heroEvents.paths[i].events.length; j++) {
      const currentEvent = heroEvents.paths[i].events[j];
      const masterEventStartTime = getMasterTimeOfEvent(currentEvent, bpm);

      // create a new state change

      allEvents.push({
        heroId: currentEvent.heroId,
        time: masterEventStartTime,
        event: currentEvent,
      });
    }
  }

  // create double nested list of seperated by unique heroId
  let stateChanges = [];
  let heroIds = allEvents.map((event) => event.heroId);
  heroIds = [...new Set(heroIds)];

  for (let i = 0; i < heroIds.length; i++) {
    stateChanges.push([]);
  }

  for (let i = 0; i < allEvents.length; i++) {
    for (let j = 0; j < heroIds.length; j++) {
      if (allEvents[i].heroId === heroIds[j]) {
        stateChanges[j].push(
          new HeroStateChange(
            allEvents[i].heroId,
            allEvents[i].time,
            allEvents[i].event.action,
            allEvents[i].event.targetValue,
            allEvents[i].event.targetBoardObjectId,
          ),
        );
      }
    }
  }

  return stateChanges;
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
