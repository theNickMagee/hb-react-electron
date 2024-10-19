import { medusaAnimationCoords } from '../defaults/HeroAnimationDefaults';
import { gladiatorAnimationCoords } from '../defaults/HeroAnimationDefaults';
import {
  getHeroById,
  getHeroNextFrame,
  getMasterTimeOfEvent,
} from '../services/HeroServices';

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

  // let stateChanges = createHeroStateChanges(heroEvents, bpm);

  // console.log('runHeroAnimations stateChanges: ', stateChanges);

  // will need to find hero and set options[0] currentFrame and currentState accordingly

  // to start, lets ignore createHeroStateChanges and just create stateChanges to increment the currentFrame of the hero
  let totalTime = data.timeline.measures * (60 / bpm) * 4;

  let fps = 20;

  // create state Change array for each hero
  let uniqueHeroIds = heroEvents.paths.map((path) =>
    path.events.map((event) => event.heroId),
  );
  // flatten the array
  uniqueHeroIds = uniqueHeroIds.flat();
  console.log('uniqueHeroIds: ', uniqueHeroIds, data);
  let idleStateChanges = [];
  for (let i = 0; i < uniqueHeroIds.length; i++) {
    idleStateChanges.push([]);
    let hero = getHeroById(data, uniqueHeroIds[i]);
    let nextFrame = getHeroNextFrame(hero.options[0].value, 'IDLE', 0);
    for (let j = 0; j < totalTime * fps; j++) {
      idleStateChanges[i].push(
        new HeroStateChange(uniqueHeroIds[i], j / fps, 'IDLE', j % 4, null),
      );
    }
  }

  console.log('runHeroAnimations idleStateChanges: ', idleStateChanges);

  // now for each idle change, setTimeout setData
};

const createHeroStateChanges = (heroEvents, bpm) => {
  let allEvents = [];

  const fps = 20;

  for (let i = 0; i < heroEvents.paths.length; i++) {
    for (let j = 0; j < heroEvents.paths[i].events.length; j++) {
      const currentEvent = heroEvents.paths[i].events[j];
      const masterEventStartTime = getMasterTimeOfEvent(currentEvent, bpm);

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
        if (
          allEvents[i].event.action.startsWith('play path') ||
          allEvents[i].event.action.startsWith('set')
        ) {
          // add a 'MOVE' state change 0.1 seconds before the event
          stateChanges[j].push(
            new HeroStateChange(
              allEvents[i].heroId,
              allEvents[i].time - 0.1,
              'MOVE',
              0,
              allEvents[i].event.targetBoardObjectId,
            ),
          );
          // then add one to IDLE based on FPS and number of frames in coords
          stateChanges[j].push(
            new HeroStateChange(
              allEvents[i].heroId,
              allEvents[i].time + 1 / fps,
              'IDLE',
              0,
              allEvents[i].event.targetBoardObjectId,
            ),
          );
        }
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
