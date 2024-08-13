import {
  defaultWavFile,
  defaultAmp,
  defaultMidi,
  defaultOscillator,
  defaultSwitch,
} from '../../defaults/BoardObjectDefaults';
import AllObjectOptions from '../options/AllObjectOptions';

const DefaultMenuOptions = ({ sessionData, setSessionData }) => {
  const toggleAllObjects = () => {
    // if path is allObjects, turn off
    if (sessionData?.options.path === 'allObjects') {
      setSessionData({
        ...sessionData,
        options: {
          ...sessionData.options,
          path: '',
        },
      });
      return;
    }
    setSessionData({
      ...sessionData,
      options: {
        ...sessionData.options,
        path: 'allObjects',
      },
    });
  };

  return (
    // buttons for wavFile, Amp, Midi, Oscillator, Switch
    <div className="default-menu-options">
      {/* <BoardItemOption
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
      /> */}
      {/* display 7 most recent boRDoBJECTS USED */}
      <div className="default-button" onClick={toggleAllObjects}>
        All Objects
      </div>
      {/* if path === allObjects */}
      {sessionData?.options.path === 'allObjects' && (
        <AllObjectOptions
          data={sessionData}
          setData={setSessionData}
          sessionData={sessionData}
          setSessionData={setSessionData}
        />
      )}
      {/* button to display all board objects */}
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
