// wireUtilities.js

// Assumes each wire object has a `start` and `end` point, each with `row` and `col`.
export const getInputWiresOnBoardObject = (wires, boardObject) => {
  return wires.filter(
    (wire) =>
      wire.end.row === boardObject.row && wire.end.col === boardObject.col,
  );
};

export const getOutputWiresOnBoardObject = (wires, boardObject) => {
  return wires.filter(
    (wire) =>
      wire.start.row === boardObject.row && wire.start.col === boardObject.col,
  );
};
