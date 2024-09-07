import { addProjectToBoard } from "./ProjectServices";
import { generateRandomId } from "./util";

const handleGridPress = (
  row,
  col,
  sessionData,
  data,
  setData,
  setSessionData,
) => {
  console.log('Grid pressed at:', row, col);

  const boardObject = data.boardObjects.find(
    (obj) => obj.row === row && obj.col === col,
  );
  const boardObjectIndex = data.boardObjects.findIndex(
    (obj) => obj.row === row && obj.col === col,
  );

  const isSameObjectClicked =
    sessionData.options?.currentEditItem &&
    sessionData.options.currentEditItem.row === row &&
    sessionData.options.currentEditItem.col === col;

  if (sessionData.droppingItem.isDroppingItem) {
    console.log('Dropping item at:', row, col);
    placeItem(row, col, sessionData, data, setData, setSessionData);
  } else if (sessionData.isDroppingProject) {
    console.log("dropping: ", sessionData.droppingProjectData);
    addProjectToBoard(sessionData.droppingProjectData, sessionData, setSessionData, setData, row, col);
  } else if (sessionData.isCreatingWire) {
    console.log('Dropping wire at:', row, col);
    dropWire(row, col, sessionData, setSessionData, data, setData);
  } else if (boardObject && !sessionData.droppingItem.isDroppingItem) {
    if (isSameObjectClicked) {
      console.log('Toggling edit options off for:', boardObject);
      setSessionData({
        ...sessionData,
        options: {
          open: false,
          currentEditItem: null,
          currentEditItemIndex: null,
        },
      });
    } else {
      console.log('Opening edit options for:', boardObject);
      setSessionData({
        ...sessionData,
        options: {
          open: true,
          currentEditItem: boardObject,
          currentEditItemIndex: boardObjectIndex,
        },
      });
    }
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
    id: generateRandomId(),
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

const startDroppingBoardObject = (item, sessionData, setSessionData) => {
  // if already on, turn off
  if (
    sessionData?.droppingItem.isDroppingItem &&
    sessionData?.droppingItem.item.type === item.type
  ) {
    setSessionData({
      ...sessionData,
      droppingItem: {
        isDroppingItem: false,
        item: null,
      },
    });
    return;
  }
  setSessionData({
    ...sessionData,
    droppingItem: {
      isDroppingItem: true,
      item: { ...item, id: generateRandomId() },
    },
  });
};

export { handleGridPress, startCreatingWire };
