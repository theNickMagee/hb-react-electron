import React from 'react';
import { useState } from 'react';
import Menu from './Menu';
import MainComponent from './MainComponent';
import MidiListener from './MidiListener';

function MainApp() {
  const [data, setData] = useState({
    boardObjects: [],
    wires: [],
    bpm: 120,
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

  // on window load

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
