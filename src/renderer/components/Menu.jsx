import React from 'react';
import DefaultMenuOptions from './Menu/DefaultMenuOptions';
import BoardObjectOptions from './options/BoardObjectOptions';
import { startCreatingWire } from '../services/BoardObjectServices';

const Menu = ({ data, setData, sessionData, setSessionData }) => {
  return (
    <div className="menu">
      {/* Conditionally display options of the active board object */}
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

      {/* Control options like play, create wire, cut wire */}
      <ControlMenuOptions
        sessionData={sessionData}
        setSessionData={setSessionData}
      />
    </div>
  );
};

export default Menu;

const ControlMenuOptions = ({ sessionData, setSessionData }) => {
  const handleCreateWirePress = () => {
    startCreatingWire(sessionData, setSessionData);
  };

  return (
    // buttons for play, create wire, cut wire
    <div className="control-menu-options">
      <div className="default-button">Play</div>
      <div
        className={
          'default-button' + (sessionData.isCreatingWire ? ' bio-on' : '')
        }
        onClick={handleCreateWirePress}
      >
        Create Wire
      </div>
      <div className="default-button">Cut Wire</div>
    </div>
  );
};
