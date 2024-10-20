import { medusaAnimationCoords } from '../defaults/HeroAnimationDefaults';
import { gladiatorAnimationCoords } from '../defaults/HeroAnimationDefaults';
import {
  createAnimationStateChanges,
  getHeroById,
  getHeroNextFrame,
  getMasterTimeOfEvent,
  heroHasNextFrame,
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
  console.log('runHeroAnimations: ', heroEvents, bpm, data);

  let allStateChanges = createHeroStateChanges(heroEvents, bpm, data);

  console.log('runHeroAnimations stateChanges: ', allStateChanges);

  // Iterate through each level of the nested arrays in allStateChanges
  for (let i = 0; i < allStateChanges.length; i++) {
    for (let k = 0; k < allStateChanges[i].length; k++) {
      // Loop through the second level
      for (let j = 0; j < allStateChanges[i][k].length; j++) {
        // Loop through the innermost array
        setTimeout(() => {
          let hero = getHeroById(data, allStateChanges[i][k][j].heroId); // Correct access to heroId
          let newHero = { ...hero };
          newHero.options[0].currentFrame = allStateChanges[i][k][j].newFrame;
          newHero.options[0].currentState = allStateChanges[i][k][j].newState;

          setData((prevData) => {
            let newData = { ...prevData };
            let heroIndex = newData.boardObjects.findIndex(
              (obj) => obj.id === allStateChanges[i][k][j].heroId, // Correct access to heroId
            );
            newData.boardObjects[heroIndex] = newHero;
            return newData;
          });
        }, allStateChanges[i][k][j].time * 1000); // Correct access to time
      }
    }
  }
};

const createHeroStateChanges = (heroEvents, bpm, data) => {
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

  // for every measure, add sequence of idle animation if it doesnt already have an animation
  const numMeasures = data.timeline.measures;
  for (let i = 0; i < heroIds.length; i++) {
    for (let j = 0; j < numMeasures; j++) {
      let hero = getHeroById(data, heroIds[i]);
      let heroStateChanges = createAnimationStateChanges(
        hero.options[0].value,
        (j * 60) / bpm,
        'idle',
        0,
        null,
        hero.id,
      );
      stateChanges[i].push([...heroStateChanges]);
    }
  }

  for (let i = 0; i < allEvents.length; i++) {
    for (let j = 0; j < heroIds.length; j++) {
      const hero = getHeroById(data, allEvents[i].heroId);
      if (allEvents[i].heroId === heroIds[j]) {
        if (
          allEvents[i].event.action.startsWith('play path') ||
          allEvents[i].event.action.startsWith('set')
        ) {
          // add a 'MOVE' state change 0.1 seconds before the event
          // stateChanges[j].push(
          //   new HeroStateChange(
          //     allEvents[i].heroId,
          //     allEvents[i].time - 0.1,
          //     'move',
          //     0,
          //     allEvents[i].event.targetBoardObjectId,
          //   ),
          // );
          let heroMoveStateChanges = createAnimationStateChanges(
            hero.options[0].value,
            allEvents[i].time,
            'move',
            0,
            allEvents[i].event.targetBoardObjectId,
            hero.id,
          );
          console.log('heroMoveStateChanges: ', [...heroMoveStateChanges]);
          stateChanges[j].push([...heroMoveStateChanges]);
        }
      }
    }
  }

  return stateChanges;
};

const getCoordsFromFrameAndState = (heroName, state, frame) => {
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
