import {
  defaultWavFile,
  defaultAmp,
  defaultMidi,
  defaultOscillator,
  defaultSwitch,
} from '../defaults/BoardObjectDefaults';
import DefaultMenuOptions from './Menu/DefaultMenuOptions';
import { startCreatingWire } from '../services/BoardObjectServices';

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
