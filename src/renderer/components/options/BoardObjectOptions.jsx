const BoardObjectOptions = ({ sessionData, setSessionData, data, setData }) => {
  if (!sessionData.options.currentEditItem) return null;

  const handleOptionChange = (index, newValue) => {
    const newBoardObjects = data.boardObjects.map((obj, idx) => {
      if (idx === sessionData.options.currentEditItemIndex) {
        const newOptions = obj.options.map((option, optionIndex) => {
          if (optionIndex === index) {
            return { ...option, value: newValue };
          }
          return option;
        });
        return { ...obj, options: newOptions };
      }
      return obj;
    });

    setData({ ...data, boardObjects: newBoardObjects });
  };

  const handleDeleteBoardObject = () => {
    const newBoardObjects = [...data.boardObjects];
    newBoardObjects.splice(sessionData.options.currentEditItemIndex, 1);
    setData({
      ...data,
      boardObjects: newBoardObjects,
    });
    setSessionData({
      ...sessionData,
      options: { open: false, currentEditItem: null },
    });
  };

  const currentBoardObject = sessionData.options.currentEditItem;

  return (
    <div className="board-object-options">
      {currentBoardObject.options.map((option, index) => (
        <div key={index}>
          {/* Placeholder for different option types */}
          {option.component === 'slider' && (
            <div>
              <label>{option.label}</label>
              <input
                type="range"
                min={option.min}
                max={option.max}
                step={option.step}
                value={option.value}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            </div>
          )}
          {/* Add other components as needed */}
        </div>
      ))}
      <div className="default-button" onClick={handleDeleteBoardObject}>
        Delete
      </div>
    </div>
  );
};

export default BoardObjectOptions;
```