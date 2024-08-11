import {
  defaultWavFile,
  defaultAmp,
  defaultOscillator,
  defaultMidi,
  defaultSwitch,
} from '../../defaults/BoardObjectDefaults';

const AllObjectOptions = ({ data, setData, sessionData, setSessionData }) => {
  const defaultBoardObjects = [
    { ...defaultWavFile },
    { ...defaultAmp },
    { ...defaultOscillator },
    { ...defaultMidi },
    { ...defaultSwitch },
  ];

  return (
    <div className="all-object-options">
      {defaultBoardObjects.map((boardObject) => (
        <div
          key={boardObject.name}
          className="default-button"
          onClick={() => startDroppingBoardObject(boardObject)}
        >
          {boardObject.name}
        </div>
      ))}
    </div>
  );
};
