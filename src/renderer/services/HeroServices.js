const getAllHeroes = ({ data }) => {
  // Assuming heroes are a type of board object
  return data.boardObjects.filter(obj => obj.type === 'Hero');
};

export { getAllHeroes };