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
      <ControlMenuOptions />
    </div>
  );
};

export default Menu;

const ControlMenuOptions = () => {
  return (
    // buttons for play, create wire, cut wire
    <div className="control-menu-options">
      <div className="default-button">Play</div>
      <div className="default-button">Create Wire</div>
      <div className="default-button">Cut Wire</div>
    </div>
  );
};
