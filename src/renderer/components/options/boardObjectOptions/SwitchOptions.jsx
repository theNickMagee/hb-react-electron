import {
  getInputWiresOnBoardObject,
  getOutputWiresOnBoardObject,
} from '../../../services/WireServices';

const SwitchOptions = ({ sessionData, data }) => {
  const currentBoardObject = sessionData.options.currentEditItem;

  const inputWires = getInputWiresOnBoardObject(data.wires, currentBoardObject);
  const outputWires = getOutputWiresOnBoardObject(
    data.wires,
    currentBoardObject,
  );

  return (
    <div className="switch-options">
      <div className="input-object-selector"></div>
      <div className="output-object-selector"></div>
    </div>
  );
};

export default SwitchOptions;
