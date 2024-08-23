import React from 'react';
import DefaultMenuOptions from './Menu/DefaultMenuOptions';
import BoardObjectOptions from './options/BoardObjectOptions';
import { startCreatingWire } from '../services/BoardObjectServices';
import { playCircuit } from '../controllers/CircuitController';
import ProjectDrawer from './options/ProjectDrawer';

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

  const saveCurrentProject = () => {
  }

  const toggleProjectDrawer = () => {
  }

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
      <div className="default-button" onClick={saveCurrentProject}>
        Save
      </div>
      <ProjectDrawer />
    </div>
  );
};
