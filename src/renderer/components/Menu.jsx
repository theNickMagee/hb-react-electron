import React from 'react';
import DefaultMenuOptions from './Menu/DefaultMenuOptions';
import BoardObjectOptions from './options/BoardObjectOptions';
import { startCreatingWire } from '../services/BoardObjectServices';
import { playCircuit } from '../controllers/CircuitController';

const Menu = ({ data, setData, sessionData, setSessionData }) => {
  return (
    <div className="menu">
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
    playCircuit(data);
  };

  return (
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

      <input
        type="range"
        min="60"
        max="240"
        step="1"
        value={data.bpm}
        onChange={(e) => setData({ ...data, bpm: parseInt(e.target.value) })}
      />
      <div className="small-font">BPM: {data.bpm}</div>
    </div>
  );
};
