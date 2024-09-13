const getAllHeroes = ({ data }) => {
  // Assuming heroes are a type of board object
  return data.boardObjects.filter((obj) => obj.type === 'Hero');
};

const createHeroEventObject = (data) => {
  const path = [];
  const events = [];

  // Assuming data has a structure similar to the one used in getPathOfHeroEvent
  const heroEvents = getHeroEvents(data);

  const { boardObjects } = data;
  heroEvents.forEach((heroEvent) => {
    // Find the starting board object for the hero event
    const startBoardObject = boardObjects.find(
      (obj) => obj.id === heroEvent.targetBoardObjectId,
    );
    if (startBoardObject) {
      if (!path.includes(startBoardObject)) {
        path.push(startBoardObject);
      }

      // Assuming we want to find the path of the hero event
      const wires = data.wires || []; // Get wires if available
      const foundPaths = getPathOfHeroEvent(wires, boardObjects, heroEvent);

      // Add found paths to the path array if they're not already included
      foundPaths.forEach((foundPath) => {
        foundPath.forEach((obj) => {
          if (!path.includes(obj)) {
            path.push(obj);
          }
        });
      });

      // Add the hero event to the events array
      events.push(heroEvent);
    }
  });

  return { paths: [{ path, events }] };
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
      hero.options[0] &&
      hero.options[0].value &&
      hero.options[0].value.steps
    ) {
      hero.options[0].value.steps.forEach((step) => {
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

export {
  getAllHeroes,
  getPathOfHeroEvent,
  createHeroEventObject,
  getMasterTimeOfEvent,
};
