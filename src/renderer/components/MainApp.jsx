import React from 'react';
import { useState, useEffect } from 'react';
import Menu from './Menu';
import MainComponent from './MainComponent';
import MidiListener from './MidiListener';
import { createDefaultProject, saveProject } from '../services/ProjectServices';

function MainApp() {
  const [data, setData] = useState({
    boardObjects: [],
    wires: [],
  });

  const [savedData, setSavedData] = useState({
    projects: [{ ...createDefaultProject() }],
  });

  const [sessionData, setSessionData] = useState({
    activeBoardObject: null,
    activeBoardObjectIndex: null,
    activeBoardObjectOptions: [],
    droppingItem: {
      isDroppingItem: false,
      item: null,
    },
    options: {
      open: false,
      currentEditItem: null,
    },
    events: {},
  });

  const handleSaveProject = async () => {
    await saveProject(data);
  };

  useEffect(() => {
    const loadSavedProjects = async () => {
      const projects = await window.electron.ipcRenderer.invoke(
        'read-saved-projects',
      );
      setSavedData({ projects });
    };
    loadSavedProjects();
  }, []);

  return (
    <div className="main-app">
      <MainComponent
        data={data}
        setData={setData}
        sessionData={sessionData}
        setSessionData={setSessionData}
      />
      <Menu
        data={data}
        setData={setData}
        sessionData={sessionData}
        setSessionData={setSessionData}
      />
      <MidiListener />
    </div>
  );
}

export default MainApp;
