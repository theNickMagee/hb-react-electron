const handleGridPress = (
  row,
  col,
  sessionData,
  data,
  setData,
  setSessionData,
) => {
  console.log('Grid pressed at:', row, col);
  if (sessionData.droppingItem.isDroppingItem) {
    console.log('Dropping item at:', row, col);
    // if dropping item, place item
    placeItem(row, col, sessionData, data, setData, setSessionData);
  } else if (sessionData.isCreatingWire) {
    // if creating wire, drop wire
    console.log('Dropping wire at:', row, col);
    dropWire(row, col, sessionData, setSessionData, data, setData);
  }
};

const placeItem = (row, col, sessionData, data, setData, setSessionData) => {
  let newSessionData = { ...sessionData };
  let newBoardObjects = [...data.boardObjects];
  // create new board object
  let newBoardObject = {
    ...sessionData.droppingItem.item,
    row,
    col,
  };
  newBoardObjects.push(newBoardObject);
  // set dropping item to null
  newSessionData.droppingItem = {
    isDroppingItem: false,
    item: null,
  };
  // set data
  setData({
    ...data,
    boardObjects: newBoardObjects,
  });
  setSessionData(newSessionData);
};

const startCreatingWire = (sessionData, setSessionData) => {
  // if already on, turn off
  if (sessionData.isCreatingWire) {
    setSessionData({
      ...sessionData,
      isCreatingWire: false,
      pendingWire: {
        start: null,
        end: null,
      },
    });
    return;
  }
  let newSessionData = { ...sessionData };
  // set dropping item to null
  newSessionData.droppingItem = {
    isDroppingItem: false,
    item: null,
  };
  // start creating wire
  newSessionData.isCreatingWire = true;
  newSessionData.pendingWire = {
    start: null,
    end: null,
  };
  setSessionData(newSessionData);
};

const checkIfDroppingWire = (sessionData) => {
  return sessionData.isCreatingWire;
};

const dropWire = (row, col, sessionData, setSessionData, data, setData) => {
  if (!checkIfDroppingWire(sessionData)) {
    return;
  }
  let newSessionData = { ...sessionData };
  if (!newSessionData.pendingWire.start) {
    newSessionData.pendingWire.start = { row, col };
  } else {
    newSessionData.pendingWire.end = { row, col };
    console.log('Wire created:', newSessionData.pendingWire);
    // push wire to data.wires
    let newWires = [...data.wires];
    newWires.push(newSessionData.pendingWire);
    setData({
      ...data,
      wires: newWires,
    });
    // stop creating wire
    newSessionData.isCreatingWire = false;
  }
  setSessionData(newSessionData);
};

export { handleGridPress, startCreatingWire };
