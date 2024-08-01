const getOrderedPaths = (wires, boardObjects) => {
  const paths = [];
  const visited = new Set(); // To track visited board objects

  // Find board objects at a specific position
  const findBoardObjectAt = ({ row, col }) =>
    boardObjects.find((obj) => obj.row === row && obj.col === col);

  // Determine if a board object has any incoming wires
  const hasIncomingWires = (boardObject) =>
    wires.some(
      (wire) =>
        wire.end.row === boardObject.row && wire.end.col === boardObject.col,
    );

  // Recursive function to follow the path
  const buildPath = (boardObject, path = []) => {
    const currentIndex = `${boardObject.row}-${boardObject.col}`;
    if (visited.has(currentIndex)) {
      return; // Stop if this board object has already been visited
    }

    visited.add(currentIndex);
    path.push(boardObject);

    // Find all outgoing wires from the current board object
    const outgoingWires = wires.filter(
      (wire) =>
        wire.start.row === boardObject.row &&
        wire.start.col === boardObject.col,
    );

    // If no outgoing wires, complete the path
    if (outgoingWires.length === 0) {
      paths.push(path);
      return;
    }

    // Follow each wire to the next board object
    outgoingWires.forEach((wire) => {
      const nextBoardObject = findBoardObjectAt(wire.end);
      if (nextBoardObject) {
        buildPath(nextBoardObject, [...path]); // Pass a copy of the path to avoid mutations
      }
    });
  };

  // Initialize path building for each board object that does not have any incoming wires
  boardObjects.forEach((boardObject) => {
    if (!hasIncomingWires(boardObject)) {
      buildPath(boardObject);
    }
  });

  return paths;
};

export { getOrderedPaths };
