import React from 'react';
import DefaultMenuOptions from './Menu/DefaultMenuOptions';
import BoardObjectOptions from './options/BoardObjectOptions';
import { startCreatingWire } from '../services/BoardObjectServices';
import { playCircuit } from '../controllers/CircuitController';

const Menu = ({ data, setData, sessionData, setSessionData }) => {
  return (
    <div className="menu">
      {/* Conditionally display options of the active board object */}
      {sessionData.options.open && sessionData.options.currentEditItem ? (
        <BoardObjectOptions
          sessionData={sessionData}
          setSessionData={setSessionData}
          data={data}
          setData={setData}
        />
      ) : (
        <DefaultMenuOptions
          sessionData={sessionData}
          setSessionData={setSessionData}
        />
      )}

      {/* Control options like play, create wire, cut wire */}
      <ControlMenuOptions
        sessionData={sessionData}
        setSessionData={setSessionData}
        data={data}
        setData={setData}
      />
    </div>
  );
};

export default Menu;

const ControlMenuOptions = ({ sessionData, setSessionData, data, setData }) => {
  const handleCreateWirePress = () => {
    startCreatingWire(sessionData, setSessionData);
  };

  const handlePlay = () => {
    // play the circuit
    playCircuit(data);
  };

  const toggleDisplayWires = () => {
    setSessionData({
      ...sessionData,
      displayWires: !sessionData.displayWires,
    });
  };

  return (
    // buttons for play, create wire, cut wire
    <div className="control-menu-options">
      <div className="default-button" onClick={handlePlay}>
        Play
      </div>
      <div
        className={
          'default-button' + (sessionData.isCreatingWire ? ' bio-on' : '')
        }
        onClick={handleCreateWirePress}
      >
        Create Wire
      </div>
      <div className="default-button" onClick={toggleDisplayWires}>
        Display Wires
      </div>
      {/* bpm slider */}
      <input
        type="range"
        min="60"
        max="240"
        step="1"
        value={data.bpm}
        onChange={(e) => setData({ ...data, bpm: e.target.value })}
      />
      {/* display bpm */}
      <div className="small-font">BPM: {data.bpm}</div>
    </div>
  );
};
