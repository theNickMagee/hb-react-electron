const { getOrderedPaths } = require('../services/CircuitServices');
import {
  createHeroEventObject,
  getPathOfHeroEvent,
} from '../services/HeroServices'; // Import the function
import {
  loadWavData,
  createInitialWavData,
  playWavData,
  renderPath,
  cutWavData,
  placeWavData,
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
  const bpm = data.timeline.bpm;
  const measures = data.timeline.measures;
  const timePerMeasure = (60 / bpm) * 4;
  const totalTime = timePerMeasure * measures;

  let masterWavData = createInitialWavData();

  // seperate hero events by path

  const pathHeroEvents = createHeroEventObject(data);

  console.log('pathHeroEvents: ', pathHeroEvents);

  // loop thru hero events in order
  for (let i = 0; i < pathHeroEvents.paths.length; i++) {
    const path = pathHeroEvents.paths[i].path;
    const heroEvents = pathHeroEvents.paths[i].events;
    for (let j = 0; j < heroEvents.length; j++) {
      const currentEvent = heroEvents[j];
      let masterEventStartTime = currentEvent.time;
      // if 'SET' event, update data
      // render the ENTIRE PATH, regardless of start time and end time
      const pathWavData = await renderPath(path);
      // if its play, set to master here
      console.log('pathWavData: ', pathWavData);
      // figure out its duration. it will be the next hero events time - current. if that tine is after total path time, keep duration total path time
      let duration;
      // if the time of next event is less than the wavData's time, then duration is the time of the next event - current event time
      let startTimeClip = 0;
      let endTimeClip = pathWavData.audioData.length;

      // convert time to seconds
      endTimeClip = endTimeClip / 44100;

      // find the last 'Play' event
      let lastPlayEvent;
      for (let k = j; k >= 0; k--) {
        if (heroEvents[k].type === 'Play') {
          lastPlayEvent = heroEvents[k];
          break;
        }
      }
      // if the last playEvent + pathDuration > masterEventStartTime, then clip wavData with start time of masterEventStartTime - lastPlayEvent.time
      if (lastPlayEvent) {
        if (lastPlayEvent.time + endTimeClip > masterEventStartTime) {
          startTimeClip = masterEventStartTime - lastPlayEvent.time;
        }
      }

      // if there is a next vent, get its time
      let nextEventTime;
      if (j < heroEvents.length - 1) {
        nextEventTime = heroEvents[j + 1].time;
      }

      if (nextEventTime) {
        endTimeClip = nextEventTime - masterEventStartTime;
      }

      // clip the wavData
      const cutPathWavData = cutWavData(
        pathWavData,
        startTimeClip,
        endTimeClip,
      );

      // PLACE the audio at the start time
      // masterWavData = placeWavData(
      //   masterWavData,
      //   cutPathWavData,
      //   currentEvent.time,
      // );
    }
  }

  if (!masterWavData.audioData || masterWavData.audioData.length === 0) {
    console.error(
      'Master wavData is empty after processing all hero events:',
      masterWavData,
    );
    return;
  }

  // playWavData(masterWavData);
};

const handleCommand = (
  commandType,
  commandPayload,
  data,
  setData,
  sessionData,
  setSessionData,
) => {};

export {
  playCircuit,
  handleMidiMessage,
  handleCommand,
  renderTimeline,
  applyEffectOnWavData,
};
