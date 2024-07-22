import React from 'react';
import { useState } from 'react';
import Menu from './Menu';
import MainComponent from './MainComponent';

function MainApp() {
  const [data, setData] = useState({
    boardObjects: [],
  });

  const [sessionData, setSessionData] = useState({
    activeBoardObject: null,
    activeBoardObjectIndex: null,
    activeBoardObjectOptions: [],
  });

  return (
    <div className="main-app">
      <MainComponent />
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
