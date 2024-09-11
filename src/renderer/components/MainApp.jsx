import React from 'react';
import { useState, useEffect } from 'react';
import Menu from './Menu';
import MainComponent from './MainComponent';
import MidiListener from './MidiListener';
import { createDefaultProject, saveProject } from '../services/ProjectServices';
import ToolTip from './tooltip/ToolTip';
import Timeline from './timeline/Timeline';

function MainApp() {
  const [data, setData] = useState({
    boardObjects: [],
    wires: [],
    timeline: {
      measures: 8,
      bpm: 120,
    },
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
    tooltip: {
      message: 'Hello',
    },
    timeline: {
      loop: false,
      loopStart: 0,
      loopEnd: 0,
      bpm: 120,
      numMeasures: 0,
      startingMeasure: 0,
    },
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
      <ToolTip
        sessionData={sessionData}
        data={data}
        setSessionData={setSessionData}
      />
      <Timeline
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
