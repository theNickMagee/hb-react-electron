import {
  getInputWiresOnBoardObject,
  getOutputWiresOnBoardObject,
} from '../../../services/WireServices';
import React, { useEffect } from 'react';

const SwitchOptions = ({ sessionData, data }) => {
  const currentBoardObject = sessionData.options.currentEditItem;

  const inputWires = getInputWiresOnBoardObject(data.wires, currentBoardObject);
  const outputWires = getOutputWiresOnBoardObject(
    data.wires,
    currentBoardObject,
  );

  useEffect(() => {
    console.log('inputWires: ', inputWires);
    console.log('outputWires: ', outputWires);
  }, [inputWires, outputWires]);

  return (
    <div className="switch-options">
      <div className="input-object-selector">input wires</div>
      <div className="output-object-selector">output wires</div>
    </div>
  );
};

export default SwitchOptions;
