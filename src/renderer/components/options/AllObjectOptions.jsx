import { useEffect } from 'react';
import {
  defaultWavFile,
  defaultAmp,
  defaultOscillator,
  defaultMidi,
  defaultSwitch,
  defaultHero,
} from '../../defaults/BoardObjectDefaults';
import { generateRandomId } from '../../services/util';
import './styles/allObjectStyles.css';
const AllObjectOptions = ({ data, setData, sessionData, setSessionData }) => {
  const defaultBoardObjects = [
    { ...defaultWavFile },
    { ...defaultAmp },
    { ...defaultOscillator },
    { ...defaultMidi },
    { ...defaultSwitch },
    { ...defaultHero },
  ];

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

  useEffect(() => {
    console.log('sessionData', sessionData);
    console;
  }, [sessionData]);

  return (
    <div className="all-object-options">
      {defaultBoardObjects.map((boardObject) => (
        <div
          key={boardObject.name}
          className={
            `icon-button ` +
            (sessionData &&
            sessionData.droppingItem.item &&
            sessionData.droppingItem.item.type === boardObject.type
              ? 'border-soft-white'
              : '')
          }
          onClick={() => startDroppingBoardObject(boardObject)}
        >
          <img
            src={boardObject.icon}
            alt={boardObject.name}
            className="icon-image"
          />
        </div>
      ))}
    </div>
  );
};

export default AllObjectOptions;
