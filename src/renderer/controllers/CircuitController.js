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

    // get all paths

    // loop thru hero events in order

    // for each hero event, figure out its duration. it will be the next hero events time - current

    // find the path associated with the event

    // render the ENTIRE PATH, regardless of start time and end time

    // CUT the audio to its start time and end time

    // PLACE the audio in the master audio

    
};



const handleCommand = (commandType, commandPayload, data, setData, sessionData, setSessionData) => {

}

export { playCircuit, handleMidiMessage, handleCommand, renderTimeline };
