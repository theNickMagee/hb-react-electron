import {
  defaultWavFile,
  defaultAmp,
  defaultMidi,
  defaultOscillator,
  defaultSwitch,
} from '../../defaults/BoardObjectDefaults';
import { generateRandomId } from '../../services/util';

const DefaultMenuOptions = ({ sessionData, setSessionData }) => {
  const startDroppingBoardObject = (item) => {
    // if already on, turn off
    if (
      sessionData?.droppingItem.isDroppingItem &&
      sessionData?.droppingItem.item.type === item.type
    ) {
      setSessionData({
        ...sessionData,
        droppingItem: {
          isDroppingItem: false,
          item: null,
        },
      });
      return;
    }
    setSessionData({
      ...sessionData,
      droppingItem: {
        isDroppingItem: true,
        item: { ...item, id: generateRandomId() },
      },
    });
  };
  return (
    // buttons for wavFile, Amp, Midi, Oscillator, Switch
    <div className="default-menu-options">
      <BoardItemOption
        title="WavFile"
        on={
          sessionData?.droppingItem.isDroppingItem &&
          sessionData?.droppingItem.item.type === 'WavFile'
        }
        onClick={() => startDroppingBoardObject(defaultWavFile)}
      />
      <BoardItemOption
        title="Amp"
        on={
          sessionData?.droppingItem.isDroppingItem &&
          sessionData?.droppingItem.item.type === 'Amp'
        }
        onClick={() => startDroppingBoardObject(defaultAmp)}
      />
      <BoardItemOption
        title="Midi"
        on={
          sessionData?.droppingItem.isDroppingItem &&
          sessionData?.droppingItem.item.type === 'Midi'
        }
        onClick={() => startDroppingBoardObject(defaultMidi)}
      />
      <BoardItemOption
        title="Oscillator"
        on={
          sessionData?.droppingItem.isDroppingItem &&
          sessionData?.droppingItem.item.type === 'Oscillator'
        }
        onClick={() => startDroppingBoardObject(defaultOscillator)}
      />
      <BoardItemOption
        title="Switch"
        on={
          sessionData?.droppingItem.isDroppingItem &&
          sessionData?.droppingItem.item.type === 'Switch'
        }
        onClick={() => startDroppingBoardObject(defaultSwitch)}
      />
    </div>
  );
};

export default DefaultMenuOptions;

const BoardItemOption = ({ image, title, on, onColor, offColor, onClick }) => {
  return (
    <div onClick={onClick} className={`default-button ${on ? 'bio-on' : ''}`}>
      {title}
    </div>
  );
};
