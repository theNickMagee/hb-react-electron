

const handleGridPress = (row, col, item, data, setData) => {
  console.log('handleGridPress', row, col, item);
    const newBoardObjects = [...data.boardObjects];
  newBoardObjects.push({
    ...item,
    row,
    col,
  });
  setData({
    ...data,
    boardObjects: newBoardObjects,
  });
}

export {
  handleGridPress}