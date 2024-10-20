import { getOrderedPaths } from './CircuitServices';
import { medusaAnimationCoords } from '../defaults/HeroAnimationDefaults';
import { gladiatorAnimationCoords } from '../defaults/HeroAnimationDefaults';
import { HeroStateChange } from '../controllers/AnimationController';

const getAllHeroes = ({ data }) => {
  // Assuming heroes are a type of board object
  return data.boardObjects.filter((obj) => obj.type === 'Hero');
};

const createHeroEventObject = (data) => {
  const paths = [];
  const pathMap = new Map();

  const heroEvents = getHeroEvents(data);
  const { boardObjects, wires } = data;

  // Find all paths in the board
  const allPaths = getOrderedPaths(wires, boardObjects);

  // Iterate over each path
  allPaths.forEach((path) => {
    const pathKey = path.map((obj) => obj.id).join('-');
    if (!pathMap.has(pathKey)) {
      pathMap.set(pathKey, { path, events: [] });
    }

    // Check each board object in the path for hero events
    path.forEach((boardObject) => {
      heroEvents.forEach((heroEvent) => {
        if (boardObject.id === heroEvent.targetBoardObjectId) {
          pathMap.get(pathKey).events.push(heroEvent);
        }
      });
    });
  });

  pathMap.forEach((value) => paths.push(value));

  return { paths };
};

const getPathOfHeroEvent = (wires, boardObjects, heroEvent) => {
  console.log('Hero Event:', heroEvent); // Log the hero event being processed
  const paths = [];
  const visited = new Set();

  const findBoardObjectAt = ({ row, col }) =>
    boardObjects.find((obj) => obj.row === row && obj.col === col);

  const buildPath = (boardObject, path = []) => {
    const currentIndex = `${boardObject.row}-${boardObject.col}`;
    if (visited.has(currentIndex)) {
      return; // Stop if this board object has already been visited
    }

    visited.add(currentIndex);
    path.push(boardObject);

    const outgoingWires = wires.filter(
      (wire) =>
        wire.start.row === boardObject.row &&
        wire.start.col === boardObject.col,
    );

    if (outgoingWires.length === 0) {
      paths.push(path);
      return;
    }

    outgoingWires.forEach((wire) => {
      const nextBoardObject = findBoardObjectAt(wire.end);
      if (nextBoardObject) {
        buildPath(nextBoardObject, [...path]); // Pass a copy of the path to avoid mutations
      }
    });
  };

  boardObjects.forEach((boardObject) => {
    if (boardObject.id === heroEvent.targetBoardObjectId) {
      buildPath(boardObject);
    }
  });

  console.log('Paths found:', paths); // Log the paths found
  return paths;
};

const getHeroEvents = (data) => {
  // Assuming hero events are stored in the boardObjects with type 'Hero'
  const heroes = data.boardObjects.filter((obj) => obj.type === 'Hero');
  const heroEvents = [];

  heroes.forEach((hero) => {
    if (
      hero.options &&
      hero.options[1] &&
      hero.options[1].value &&
      hero.options[1].value.steps
    ) {
      hero.options[1].value.steps.forEach((step) => {
        heroEvents.push({
          heroId: hero.id,
          targetBoardObjectId: step.targetBoardObjectId,
          action: step.action,
          targetValue: step.targetValue,
          measure: step.measure,
        });
      });
    }
  });

  return heroEvents;
};

const getMasterTimeOfEvent = (event, bpm) => {
  // Convert measure to an integer
  const measureInt = parseInt(event.measure);

  // Assume 4/4 time, so 4 beats per measure
  const beatsPerMeasure = 4;

  // Convert the beat offset (if any) from the event
  const beatOffset = event.beatOffset || 0; // Default to 0 if no beat offset is provided

  // Total beats is measures * beats per measure + beatOffset
  const totalBeats = measureInt * beatsPerMeasure + beatOffset;

  // Convert beats to time in seconds
  const timeInSeconds = (totalBeats / bpm) * 60; // Since BPM is beats per minute, multiply by 60 to get seconds

  return timeInSeconds;
};

const getHeroById = (data, heroId) => {
  console.log('getHeroById: ', heroId);
  return data.boardObjects.find((obj) => obj.id === heroId);
};

const getHeroNextFrame = (heroName, currentState, currentFrame) => {
  if (heroName === 'medusa') {
    console.log(
      "looking for next frame in medusa's animation: ",
      currentState,
      currentFrame,
      medusaAnimationCoords[currentState.toLowerCase()],
      !medusaAnimationCoords[currentState.toLowerCase()][currentFrame + 1],
    );
    // if the next frame does not exist in the currentState, return 0
    if (!medusaAnimationCoords[currentState.toLowerCase()][currentFrame + 1]) {
      return 0;
    }
  }
  if (heroName === 'gladiator') {
    // if the next frame does not exist in the currentState, return 0
    if (
      !gladiatorAnimationCoords[currentState.toLowerCase()][currentFrame + 1]
    ) {
      return 0;
    }
  }
  return currentFrame + 1;
};

const heroHasNextFrame = (heroName, currentState, currentFrame) => {
  // console.log(
  //   'heroHasNextFrame: ',
  //   heroName,
  //   currentState,
  //   currentFrame,
  //   gladiatorAnimationCoords[currentState.toLowerCase()],
  // );
  if (heroName === 'medusa') {
    if (
      medusaAnimationCoords[currentState.toLowerCase()].coords[currentFrame + 1]
    ) {
      return true;
    }
  }
  if (heroName === 'gladiator') {
    if (
      gladiatorAnimationCoords[currentState.toLowerCase()].coords[
        currentFrame + 1
      ]
    ) {
      return true;
    }
  }

  return false;
};

const createAnimationStateChanges = (
  heroCharacter,
  time,
  state,
  initialFrame,
  targetBoardObjectId,
  heroId,
  heroRow,
  heroCol,
) => {
  console.log(
    'creating animation state changes for hero: ',
    heroCharacter,
    time,
    state,
    initialFrame,
    targetBoardObjectId,
    heroId,
  );
  // if the state is 'move', final frame should have offSetX and offsetY to targetBoardObject
  // if state is attack, all frames should be positioned left targetBoardObject
  // targetBoardObject has row and col
  // NEEDS - hero row and col
  // NEEDS - w and h of canvas
  if (heroCharacter === 'medusa') {
    // coords is an object not an array
    const medusaState = medusaAnimationCoords[state];
    const totalFrames = medusaState.frames;
    const stateChanges = [];
    for (let i = initialFrame; i < totalFrames; i++) {
      let stateChange = new HeroStateChange(
        heroId,
        time - 0.1 * (totalFrames - i),
        state,
        i,
        targetBoardObjectId,
      );
      stateChanges.push(stateChange);
    }
    return stateChanges;
  }
  if (heroCharacter === 'gladiator') {
    // coords is an object not an array
    const gladiatorState = gladiatorAnimationCoords[state];
    const totalFrames = gladiatorState.frames;
    const stateChanges = [];
    for (let i = initialFrame + 1; i < totalFrames + 1; i++) {
      let stateChange = new HeroStateChange(
        heroId,
        time,
        state,
        i,
        targetBoardObjectId,
      );
      stateChanges.push(stateChange);
    }
    return stateChanges;
  }
  return [];
};

export {
  getAllHeroes,
  getPathOfHeroEvent,
  createHeroEventObject,
  getMasterTimeOfEvent,
  getHeroById,
  getHeroNextFrame,
  heroHasNextFrame,
  createAnimationStateChanges,
};
