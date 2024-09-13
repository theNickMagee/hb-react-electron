const getAllHeroes = ({ data }) => {
  // Assuming heroes are a type of board object
  return data.boardObjects.filter((obj) => obj.type === 'Hero');
};

const getPathOfHeroEvent = (wires, boardObjects, heroEvent) => {
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
      (wire) => wire.start.row === boardObject.row && wire.start.col === boardObject.col
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

  return paths;
};

export { getAllHeroes, getPathOfHeroEvent };
