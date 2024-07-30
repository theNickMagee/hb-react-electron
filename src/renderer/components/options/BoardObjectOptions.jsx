import FileExplorer from './FileExplorer';

const BoardObjectOptions = ({ sessionData, setSessionData, data, setData }) => {
  if (!sessionData.options.currentEditItem) return null;

  const handleOptionChange = (index, filePath) => {
    const newBoardObjects = data.boardObjects.map((obj, idx) => {
      if (idx === sessionData.options.currentEditItemIndex) {
        const newOptions = obj.options.map((option, optionIndex) => {
          if (optionIndex === index) {
            return { ...option, file: filePath }; // Update the file path
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

  const handleSliderChange = (index, value) => {
    const newBoardObjects = data.boardObjects.map((obj, idx) => {
      if (idx === sessionData.options.currentEditItemIndex) {
        const newOptions = obj.options.map((option, optionIndex) => {
          if (optionIndex === index) {
            return { ...option, value: value };
          }
          return option;
        });
        return { ...obj, options: newOptions };
      }
      return obj;
    });
    setData({ ...data, boardObjects: newBoardObjects });
  };
  return (
    <div className="board-object-options">
      {currentBoardObject.options.map((option, index) => (
        <div key={index}>
          {option.component === 'slider' && (
            <div>
              <label>{option.label}</label>
              <input
                type="range"
                min={option.min}
                max={option.max}
                step={option.step}
                value={
                  data.boardObjects[sessionData.options.currentEditItemIndex]
                    .options[index].value
                }
                onChange={(e) => handleSliderChange(index, e.target.value)}
              />
            </div>
          )}
          {option.component === 'FileExplorer' && (
            <FileExplorer
              initialFileName={
                option.file ? option.file.split('/').pop() : undefined
              }
              onFileSelect={(path) => handleOptionChange(index, path)}
            />
          )}
        </div>
      ))}
      <div className="default-button" onClick={handleDeleteBoardObject}>
        Delete
      </div>
    </div>
  );
};

export default BoardObjectOptions;
