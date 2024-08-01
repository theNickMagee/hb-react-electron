const { getOrderedPaths } = require('../services/CircuitServices');
import { loadWavData, createInitialWavData } from '../services/WavFileServices';

const playCircuit = (data) => {
  // console.log('data: ', JSON.stringify(data, null, 2));
  // play the circuit
  const orderedPaths = getOrderedPaths(data.wires, data.boardObjects);

  console.log('orderedPaths: ', orderedPaths);

  // for each ordered path, have a wavData object that stores wavData
  for (let i = 0; i < orderedPaths.length; i++) {
    const path = orderedPaths[i];
    let wavData = createInitialWavData();
    for (let j = 0; j < path.length; j++) {
      const boardObject = path[j];
      let newWavData = applyEffectOnWavData(boardObject, wavData);

      // if we are at the end fo the path, play the wavData
    }
  }
};

const applyEffectOnWavData = (boardObject, wavData) => {
  if (boardObject.type === 'WavFile') {
    console.log('boardObject wav: ', boardObject);
    return loadWavData(boardObject.options);
    // apply the wavFileData to wavData
  } else if (boardObject.type === 'Amp') {
    // apply the amp effect to wavData
  } else if (boardObject.type === 'Midi') {
    // apply the midi effect to wavData
  } else if (boardObject.type === 'Oscillator') {
    // apply the oscillator effect to wavData
  } else if (boardObject.type === 'Switch') {
    // apply the switch effect to wavData
  }
};

export { playCircuit };
