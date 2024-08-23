import {
  getInputWiresOnBoardObject,
  getOutputWiresOnBoardObject,
} from '../../../services/WireServices';
import React, { useEffect } from 'react';
import './styles/switchOptions.css';

const SwitchOptions = ({ sessionData, data, setData, setSessionData }) => {

  const [inputWires, setInputWires] = React.useState([]);
  const [outputWires, setOutputWires] = React.useState([]);
  const [value, setValue] = React.useState(sessionData.options.currentEditItem.options[0].value);

  useEffect(() => {
    const currentBoardObject = sessionData.options.currentEditItem;

    const iw = getInputWiresOnBoardObject(data.wires, currentBoardObject);
    const ow = getOutputWiresOnBoardObject(
      data.wires,
      currentBoardObject,
    );

    setInputWires(iw);
    setOutputWires(ow);


    
  }, [sessionData.options.currentEditItem, data.wires])

  const setSwitchActiveInputWire = (wireId) => {
    console.log('Setting active input wire:', wireId);

    let currentBoardObject = sessionData.options.currentEditItem;
    
    // adjust options
    for (let i = 0; i < currentBoardObject.options.length; i++) {
      if (currentBoardObject.options[i].component === 'SwitchOptions') {
        currentBoardObject.options[i].value.activeInputWireId = wireId;
      }
    }

    // update data
    let newData = { ...data };
    newData.boardObjects = newData.boardObjects.map((obj) => {
      if (obj.id === currentBoardObject.id) {
        return currentBoardObject;
      }
      return obj;
    }
    );

    console.log('newData after setting active input wire:', newData);
    console.log('value in setSwitchActiveInputWire:', value);

    setData(newData);


  }

  const setSwitchActiveOutputWire = (wireId) => {
    
    let currentBoardObject = sessionData.options.currentEditItem;

    // adjust options
    for (let i = 0; i < currentBoardObject.options.length; i++) {
      if (currentBoardObject.options[i].component === 'SwitchOptions') {
        currentBoardObject.options[i].value.activeOutputWireId = wireId;
      }
    }

    // update data
    let newData = { ...data };
    newData.boardObjects = newData.boardObjects.map((obj) => {
      if (obj.id === currentBoardObject.id) {
        return currentBoardObject;
      }
      return obj;
    });

    console.log('newData after setting active output wire:', newData);
    console.log('value in setSwitchActiveOutputWire:', value);

    setData(newData);
    
  }

  useEffect(() => {
    console.log('value:', value);
    setValue(sessionData.options.currentEditItem.options[0].value);
  }, [sessionData.options.currentEditItem.options[0].value])

  return (
    <div className="switch-options">
       <div className="wire-section">
          <div className="small-font">Input Wires:</div>
          {inputWires.map((wire, idx) => (
            <div key={wire.id} className={`wire-b ${value.activeInputWireId === wire.id ? 'wb-active' : ''}`}>
              <span onClick={() => setSwitchActiveInputWire(wire.id)} className={`wire-button ${value.activeInputWireId === wire.id ? 'wb-active' : ''}`}>
                ({wire.start.col + 1}, {wire.start.row + 1}) ➔ ({wire.end.col + 1},{' '}
                {wire.end.row + 1})
              </span>
            </div>
          ))}
          <div className="small-font">Output Wires:</div>
          {outputWires.map((wire, idx) => (
            <div key={wire.id} className={ `wire-b ${value.activeOutputWireId === wire.id ? 'wb-active' : ''}`}>
              <span onClick={() => setSwitchActiveOutputWire(wire.id)} className='wire-button'>
                ({wire.start.col + 1}, {wire.start.row + 1}) ➔ ({wire.end.col + 1},{' '}
                {wire.end.row + 1})

              </span>
            </div>
          ))}
        </div>
    </div>
  );
};

export default SwitchOptions;
