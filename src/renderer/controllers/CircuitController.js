const { getOrderedPaths } = require('../services/CircuitServices');
import {
  loadWavData,
  createInitialWavData,
  playWavData,
} from '../services/WavFileServices';
import { applyAmp } from '../services/AmpServices';
import { applyMidiEvents, handleNoteOn } from '../services/MidiServices';
import { processOscillator } from '../services/OscillatorServices';
import { processSwitch } from '../services/SwitchServices';

// handleMidiMessage
const handleMidiMessage = (midiMessage) => {
  // find the listening/live midi input - could be single key or keyboard
  // if keyboard, find the key that was pressed and play the corresponding note
  // if single key, play the note
  console.log('midi message: ', midiMessage);
  // if command is 128 it is noteoff
  // if command is 144 it is noteon
  const { command, note, velocity } = midiMessage;
  if (command === 144) {
    // find previous path and process it, getting inputWavData
    // handle note on
    // then process rest of the path
    handleNoteOn(note, velocity);
  } else if (command === 128) {
    console.log('note off');
  }
};

const applyEffectOnWavData = (boardObject, wavData) => {
  if (boardObject.type === 'WavFile') {
    return loadWavData(boardObject.options);
    // apply the wavFileData to wavData
  } else if (boardObject.type === 'Amp') {
    return applyAmp(boardObject.options, wavData);
    // apply the amp effect to wavData
  } else if (boardObject.type === 'Midi') {
    return applyMidiEvents(boardObject.options, wavData);
    // apply the midi effect to wavData
  } else if (boardObject.type === 'Oscillator') {
    return processOscillator(boardObject.options, wavData);
    // apply the oscillator effect to wavData
  } else if (boardObject.type === 'Switch') {
    // apply the switch effect to wavData
    return processSwitch(boardObject.options, wavData);
  }
};

const playCircuit = async (data) => {
  // console.log('data: ', JSON.stringify(data, null, 2));
  // play the circuit
  const orderedPaths = getOrderedPaths(data.wires, data.boardObjects);

  // for each ordered path, have a wavData object that stores wavData
  for (let i = 0; i < orderedPaths.length; i++) {
    const path = orderedPaths[i];
    let wavData = createInitialWavData();
    for (let j = 0; j < path.length; j++) {
      const boardObject = path[j];
      const newWavData = await applyEffectOnWavData(boardObject, wavData);

      // if we are at the end fo the path, play the wavData
      if (j === path.length - 1) {
        playWavData(newWavData);
      }
      wavData = newWavData;
    }
  }
};

const renderTimeline = async (data) => {
  // Calculate the total time of the timeline
  const bpm = data.timeline.bpm;
  const measures = data.timeline.measures;
  const timePerMeasure = 60 / bpm * 4; // Assuming 4 beats per measure
  const totalTime = timePerMeasure * measures;

  // Sort hero events
  const sortedHeroes = data.boardObjects
    .filter((obj) => obj.type === 'Hero')
    .sort((a, b) => a.options[0].value.steps[0].time - b.options[0].value.steps[0].time);

  // Initialize an array to hold all wavData
  let allWavData = [];

  // Process each play path after
  for (const hero of sortedHeroes) {
    const steps = hero.options[0].value.steps;
    for (const step of steps) {
      if (step.action === 'play path after') {
        const orderedPaths = getOrderedPaths(data.wires, data.boardObjects);
        for (let i = 0; i < orderedPaths.length; i++) {
          const path = orderedPaths[i];
          let wavData = createInitialWavData();
          for (let j = 0; j < path.length; j++) {
            const boardObject = path[j];
            const newWavData = await applyEffectOnWavData(boardObject, wavData);

            // Check for 'Set Level' or other "set" hero events
            if (boardObject.type === 'Hero' && boardObject.options[0].value.steps.some(s => s.action.startsWith('Set'))) {
              // Split the path at this point
              allWavData.push(newWavData);
              wavData = createInitialWavData(); // Reset wavData for the next segment
            } else {
              wavData = newWavData;
            }

            // if we are at the end of the path, add the wavData to allWavData
            if (j === path.length - 1) {
              allWavData.push(newWavData);
            }
          }
        }
      }
    }
  }

  // Combine all wavData into one big wav
  const combinedWavData = combineWavData(allWavData);

  // Play the combined wavData
  playWavData(combinedWavData);
};

// Helper function to combine multiple wavData objects into one
const combineWavData = (wavDataArray) => {
  if (wavDataArray.length === 0) return createInitialWavData();

  const sampleRate = wavDataArray[0].sampleRate;
  const numChannels = wavDataArray[0].numChannels;
  const bitsPerSample = wavDataArray[0].bitsPerSample;

  // Calculate the total length of the combined audio data
  const totalLength = wavDataArray.reduce((sum, wavData) => {
    if (wavData && wavData.audioData) {
      return sum + wavData.audioData.length;
    }
    return sum;
  }, 0);

  // Create a new Int16Array to hold the combined audio data
  const combinedAudioData = new Int16Array(totalLength);

  // Copy each wavData's audioData into the combinedAudioData
  let offset = 0;
  for (const wavData of wavDataArray) {
    if (wavData && wavData.audioData) {
      combinedAudioData.set(wavData.audioData, offset);
      offset += wavData.audioData.length;
    }
  }

  return {
    sampleRate,
    numChannels,
    bitsPerSample,
    audioData: combinedAudioData,
  };
};

const handleCommand = (commandType, commandPayload, data, setData, sessionData, setSessionData) => {

}

export { playCircuit, handleMidiMessage, handleCommand, renderTimeline };
