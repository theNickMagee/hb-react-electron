import React from 'react';
import { useState } from 'react';
import Menu from './Menu';
import MainComponent from './MainComponent';

function MainApp() {
  const [data, setData] = useState({
    boardObjects: [],
    wires: [],
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
  });

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
    </div>
  );
}

export default MainApp;
