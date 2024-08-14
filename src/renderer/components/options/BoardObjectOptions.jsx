import FileExplorer from './FileExplorer';
import {
  getInputWiresOnBoardObject,
  getOutputWiresOnBoardObject,
} from '../../services/WireServices';
import PianoRoll from './boardObjectOptions/PianoRoll';
import './styles/boardObjectOptions.css';
import React, { useEffect } from 'react';
import SwitchOptions from './boardObjectOptions/SwitchOptions';

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

  const setValue = (index, newValue) => {
    const newBoardObjects = data.boardObjects.map((obj, idx) => {
      if (idx === sessionData.options.currentEditItemIndex) {
        const newOptions = obj.options.map((option, optionIndex) => {
          if (optionIndex === index) {
            return { ...option, value: newValue }; // Directly set new value
          }
          return option;
        });
        return { ...obj, options: newOptions };
      }
      return obj;
    });

    console.log('newBoardObjects after setValue:', newBoardObjects);
    setData({ ...data, boardObjects: newBoardObjects });
  };

  const toggleDisplayWires = () => {
    setSessionData({
      ...sessionData,
      displayWires: !sessionData.displayWires,
    });
  };

  return (
    <div className="board-object-options">
      <div className="default-row">
        <div className="default-button" onClick={toggleDisplayWires}>
          Display Wires
        </div>
        <div
          className="default-button w-25 float-right"
          onClick={handleDeleteBoardObject}
        >
          Delete
        </div>
      </div>
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
      <div className="board-object-option-container">
        {sessionData.options.currentEditItem.options.map((option, index) => (
          <div>
            {option.component === 'slider' && (
              <div className="option-container">
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
            {/* dropdown */}
            {option.component === 'dropdown' && (
              <div className="option-container">
                <label>{option.label}</label>
                <select
                  value={
                    data.boardObjects[sessionData.options.currentEditItemIndex]
                      .options[index].value
                  }
                  onChange={(e) => handleSliderChange(index, e.target.value)}
                >
                  {option.choices.map((choice, idx) => (
                    <option key={idx} value={choice}>
                      {choice}
                    </option>
                  ))}
                </select>
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
            {option.component === 'PianoRoll' && (
              <div className="h-100">
                <PianoRoll
                  index={index}
                  bpm={data.bpm}
                  value={
                    data.boardObjects[sessionData.options.currentEditItemIndex]
                      .options[index].value
                  }
                  setValue={(newValue) => setValue(index, newValue)}
                  key={option.value} // Add key prop to trigger re-render on value change
                />
              </div>
            )}
            {option.component === 'SwitchOptions' && (
              <SwitchOptions
                sessionData={sessionData}
                setSessionData={setSessionData}
                data={data}
                setData={setData}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardObjectOptions;
