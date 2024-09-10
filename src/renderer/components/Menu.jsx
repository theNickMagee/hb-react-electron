import React from 'react';
import DefaultMenuOptions from './Menu/DefaultMenuOptions';
import BoardObjectOptions from './options/BoardObjectOptions';
import { startCreatingWire } from '../services/BoardObjectServices';
import { playCircuit } from '../controllers/CircuitController';
import ProjectDrawer from './options/ProjectDrawer';
import { saveProject } from '../services/ProjectServices';

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
        saveProject={saveProject}
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

  const saveCurrentProject = async () => {
    await saveProject(data);
  };

  const toggleProjectDrawer = () => {
    setSessionData({
      ...sessionData,
      isProjectDrawerOpen: !sessionData.isProjectDrawerOpen,
    });
  };

  const setProjectDrawer = async () => {
    const folderPath =
      await window.electron.ipcRenderer.invoke('set-project-drawer');
    // set local storage
    if (folderPath) {
      localStorage.setItem('projectDrawerPath', folderPath);
      setSessionData({
        ...sessionData,
        projectDrawerPath: folderPath,
      });
    }
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
      <div className="default-button" onClick={saveCurrentProject}>
        Save Project
      </div>
      <div className="default-button" onClick={setProjectDrawer}>
        Set Drawer
      </div>
      <ProjectDrawer
        sessionData={sessionData}
        setSessionData={setSessionData}
        data={data}
        setData={setData}
      />
    </div>
  );
};
