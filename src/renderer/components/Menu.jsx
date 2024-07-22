import {
  defaultWavFile,
  defaultAmp,
  defaultMidi,
  defaultOscillator,
  defaultSwitch,
} from '../defaults/BoardObjectDefaults';
import DefaultMenuOptions from './Menu/DefaultMenuOptions';

const Menu = ({ data, setData, sessionData, setSessionData }) => {
  return (
    <div className="menu">
      {/* display options of activeBoardObject */}
      <DefaultMenuOptions
        sessionData={sessionData}
        setSessionData={setSessionData}
      />
      {/* if not, displayboardObjects as options  */}
      {/* always display - play, create wire, cut wire */}
      <ControlMenuOptions sessionData={sessionData} setSessionData={setSessionData} />
    </div>
  );
};

export default Menu;

const ControlMenuOptions = ({ sessionData, setSessionData }) => {

  const startCreatingWire = () => {
    // if already on, turn off
    if (sessionData.isCreatingWire) {
      setSessionData({
        ...sessionData,
        isCreatingWire: false,
        pendingWire: {
          start: null,
          end: null,
        },
      });
      return;
    }
    let newSessionData = { ...sessionData };
    // set dropping item to null
    newSessionData.droppingItem = {
      isDroppingItem: false,
      item: null,
    };
    // start creating wire
    newSessionData.isCreatingWire = true;
    newSessionData.pendingWire ={
      start: null,
      end: null,
    }
    setSessionData(newSessionData);
  };



  return (
    // buttons for play, create wire, cut wire
    <div className="control-menu-options">
      <div className="default-button">Play</div>
      <div className={"default-button" + (sessionData.isCreatingWire ? " bio-on" : "")}
      onClick={startCreatingWire}>Create Wire</div>
      <div className="default-button">Cut Wire</div>
    </div>
  );
};
