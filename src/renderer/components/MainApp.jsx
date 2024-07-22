import React from 'react';
import { useState } from 'react';

function MainApp() {
  const [data, setData] = useState({
    boardObjects: [],
  });

  return (
    <div>
      <h1>Hello from main app</h1>
    </div>
  );
}

export default MainApp;
