import React from 'react';
import { useState, useEffect } from 'react';
import Menu from './Menu';
import MainComponent from './MainComponent';
import MidiListener from './MidiListener';
import { createDefaultProject } from '../services/ProjectServices';

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
    // if there is an output wire, deliver audio to output wire. if there is no output wire, and it is a 'PLAY' event, play audio. if it is a 'RENDER' event, render audio.
    // you need a source before the midi
    events: {},
  });

  const saveProject = async () => {
    const result = await window.electron.ipcRenderer.invoke(
      'save-project',
      data,
    );
    if (result.success) {
      console.log(`Project saved to ${result.filePath}`);
    } else {
      console.error('Failed to save project:', result.error);
    }
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
