import FileExplorer from './FileExplorer';
import {
  getInputWiresOnBoardObject,
  getOutputWiresOnBoardObject,
} from '../../services/WireServices';
import PianoRoll from './boardObjectOptions/PianoRoll';

const BoardObjectOptions = ({ sessionData, setSessionData, data, setData }) => {
  if (!sessionData.options.currentEditItem) return null;

  const handleOptionChange = (index, filePath, fileData) => {
    const newBoardObjects = data.boardObjects.map((obj, idx) => {
      if (idx === sessionData.options.currentEditItemIndex) {
        const newOptions = obj.options.map((option, optionIndex) => {
          if (optionIndex === index) {
            return { ...option, file: filePath, fileData: fileData };
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

  const handleDeleteWire = (wireIndex) => {
    const newWires = [...data.wires];
    newWires.splice(wireIndex, 1);
    setData({ ...data, wires: newWires });
  };

  const currentBoardObject = sessionData.options.currentEditItem;

  const inputWires = getInputWiresOnBoardObject(data.wires, currentBoardObject);
  const outputWires = getOutputWiresOnBoardObject(
    data.wires,
    currentBoardObject,
  );

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
      <div
        className="default-button w-25 float-right"
        onClick={handleDeleteBoardObject}
      >
        Delete
      </div>
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
              onFileSelect={handleOptionChange}
              index={index}
            />
          )}
          {
            // if option.component === 'midiPattern'
            option.component === 'PianoRoll' && (
              <PianoRoll
                index={index}
                bpm={data.bpm}
                value={option.value}
                setValue={(value) => handleOptionChange(index, null, value)}
              />
            )
          }
        </div>
      ))}
      {sessionData.displayWires && (
        <div className="wire-section">
          <div className="small-font">Input Wires:</div>
          {inputWires.map((wire, idx) => (
            <div key={idx} className="wire-listing">
              <span>
                ({wire.start.row}, {wire.start.col}) ➔ ({wire.end.row},{' '}
                {wire.end.col})
              </span>
              <button
                className="delete-wire-button"
                onClick={() => handleDeleteWire(idx)}
              >
                X
              </button>
            </div>
          ))}
          <div className="small-font">Output Wires:</div>
          {outputWires.map((wire, idx) => (
            <div key={idx} className="wire-listing">
              <span>
                ({wire.start.row}, {wire.start.col}) ➔ ({wire.end.row},{' '}
                {wire.end.col})
              </span>
              <button
                className="delete-wire-button"
                onClick={() => handleDeleteWire(idx)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardObjectOptions;
