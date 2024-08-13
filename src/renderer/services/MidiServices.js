const createMiddleCNoteEvent = () => {
  return {
    type: 'noteon',
    note: 'C4',
    velocity: 127,
    time: 0,
  };
};

const createMiddleCNoteOffEvent = () => {
  return {
    type: 'noteoff',
    note: 'C4',
    velocity: 127,
    time: 10,
  };
};

const createDefaultNotesForClick = (
  letter,
  octave,
  beat,
  timePerMeasure,
  timeSignatureTop,
) => {
  console.log(
    'creating notes for click: ',
    letter,
    octave,
    beat,
    timePerMeasure,
    timeSignatureTop,
  );
  return [
    {
      type: 'noteon',
      note: `${letter}${octave}`,
      velocity: 127,
      time: beat * (timePerMeasure / timeSignatureTop),
    },
    {
      type: 'noteoff',
      note: `${letter}${octave}`,
      velocity: 127,
      time: (beat + 1) * (timePerMeasure / timeSignatureTop),
    },
  ];
};

const addNotesToEvents = (events, notes) => {
  return [...events, ...notes];
};

const removeNoteFromEvents = (events, noteOn, noteOff) => {
  console.log('remove note from events: ', noteOn, noteOff);
  return events.filter(
    (event) =>
      !(
        (event.note === noteOn.note && event.time === noteOn.time) ||
        (event.note === noteOff.note && event.time === noteOff.time)
      ),
  );
};

const removeSelectedEvents = (events) => {
  const filtered = events.filter((event) => !event.selected);
  // find selected and ones connected to selected, aka noteon or noteoff
  return filtered;
  // const selectedEvents = events.filter((event) => event.selected);
  // const noteOffEvents = selectedEvents.filter(
  //   (event) => event.type === 'noteoff',
  // );
};

const setSelectedEvent = (events, noteOn, noteOff) => {
  // set selected to true for note, set false for all other notes

  // if event is noteOn or noteOff, set selected to true
  return events.map((event) => {
    if (
      (event.note === noteOn.note &&
        event.time === noteOn.time &&
        event.type === 'noteon') ||
      (event.note === noteOff.note &&
        event.time === noteOff.time &&
        event.type === 'noteoff')
    ) {
      //  if
      return { ...event, selected: !event.selected };
    }
    return { ...event, selected: false };
  });
};

const createEventsFromClick = (
  events,
  setEvents,
  letter,
  octave,
  beat,
  bpm,
  timeSignatureTop,
  measureIndex,
  lastMesureIndex,
) => {
  const timePerMeasure = returnTimePerMeasure(bpm, timeSignatureTop);
  const notes = createDefaultNotesForClick(
    letter,
    octave,
    beat,
    timePerMeasure,
    timeSignatureTop,
  );
  const noteOn = notes[0];
  const noteOff = notes[1];
  console.log('events: ', events);
  if (checkIfEventInNote(events, octave, letter, beat, bpm, timeSignatureTop)) {
    console.log('removing events: ', noteOn, noteOff);
    // setEvents(removeNoteFromEvents(events, noteOn, noteOff));
  } else {
    console.log('adding events: ', notes);
    setEvents(addNotesToEvents(events, notes));
  }
};

const checkIfEventInNote = (
  events,
  noteOctave,
  noteLetter,
  beatIndex,
  bpm,
  timeSignatureTop,
  startingMeasureIndex,
  lastMesureIndex,
) => {
  // Calculate the duration of one beat
  const beatDuration = 60 / bpm; // seconds per beat

  // Calculate start and end times of the beat
  const startTime = beatDuration * beatIndex;
  const endTime = startTime + beatDuration;

  // Concatenate note and octave to match event.note format
  const fullNoteName = `${noteLetter}${noteOctave}`;

  // Track active notes that start before or during the current beat and end after the start of the current beat
  let activeDuringBeat = false;

  // Check each event to find a 'noteon' event during the beat
  events.forEach((event, index) => {
    if (
      event.note === fullNoteName &&
      event.type === 'noteon' &&
      event.time < endTime
    ) {
      // Find the closest subsequent 'noteoff' event for the same note
      const noteOffIndex = events.findIndex(
        (offEvent, offIndex) =>
          offIndex > index &&
          offEvent.type === 'noteoff' &&
          offEvent.note === fullNoteName,
      );

      const noteOffTime =
        noteOffIndex !== -1 ? events[noteOffIndex].time : Number.MAX_VALUE;

      // If 'noteon' event starts before or during the beat and 'noteoff' is after the start of the beat
      if (event.time >= startTime && noteOffTime > startTime) {
        activeDuringBeat = true;
      }
    }
  });

  return activeDuringBeat;
};

const returnTimePerMeasure = (bpm, timeSignatureTop) => {
  return Math.round((60 / bpm) * timeSignatureTop * 1000) / 1000; // Use milliseconds
};

const returnTimePerBeat = (bpm) => {
  return Math.round((60 / bpm) * 1000) / 1000; // Use milliseconds
};

const findPairsInNoteAndOctave = (bpm, numBeats, events, note, octave) => {
  const timePerMeasure = returnTimePerMeasure(bpm, numBeats);
  const noteEvents = events.filter(
    (event) => event.note === `${note}${octave}`,
  );
  const notePairs = [];

  for (let i = 0; i < noteEvents.length; i += 2) {
    const noteOn = noteEvents[i];
    const noteOff = noteEvents[i + 1];

    const measure = Math.floor(noteOn.time / timePerMeasure);
    notePairs.push({ noteOn, noteOff, measure });
  }

  return notePairs;
};

const clearCurrentMeasure = (value, setValue) => {
  setValue(value.filter((event) => event.time >= 4));
};

const applyMidiEvents = (boardObjectOptions, wavData) => {
  let value;
  for (const option of boardObjectOptions) {
    if (option.component === 'PianoRoll') {
      value = option.value;
    }
  }

  console.log('value: ', value);

  const events = value.events;

  // example events
  // {type: 'noteon', note: 'E4', velocity: 127, time: 1.5, selected: false}
  // {type: 'noteoff', note: 'E4', velocity: 127, time: 2, selected: false}
  // {type: 'noteon', note: 'G4', velocity: 127, time: 0, selected: false}
  // {type: 'noteoff', note: 'G4', velocity: 127, time: 0.5, selected: false}
  // {type: 'noteon', note: 'F#4', velocity: 127, time: 0.5, selected: false}
  // {type: 'noteoff', note: 'F#4', velocity: 127, time: 1, selected: false}
  // {type: 'noteon', note: 'F4', velocity: 127, time: 1, selected: false}
  // {type: 'noteoff', note: 'F4', velocity: 127, time: 1.5, selected: false}

  const { sampleRate, numChannels, bitsPerSample, audioData } = wavData;

  let newAudioData = audioData;

  // apply events to wavData
  newAudioData = applyEventsToWavData(events, newAudioData);

  // Apply midi events to wavData
  return {
    sampleRate,
    numChannels,
    bitsPerSample,
    audioData: newAudioData,
  };
};

const getSelectedNoteDuration = (events) => {
  const selectedEvents = events.filter((event) => event.selected);
  if (selectedEvents.length === 0) {
    console.log('no selected events');
    return 0;
  }

  // ensure [0] is noteon and [1] is noteoff
  if (selectedEvents[0].type === 'noteoff') {
    console.log('reversing selected events');
    selectedEvents.reverse();
  }
  // subtract noteoff time from noteon time
  const duration = selectedEvents[1].time - selectedEvents[0].time;
  return duration;
};

const setSelectedNoteDuration = (e, events, setEvents) => {
  const selectedEvents = events.filter((event) => event.selected);
  if (selectedEvents.length === 0) {
    console.log('no selected events');
    return;
  }

  // ensure [0] is noteon and [1] is noteoff
  if (selectedEvents[0].type === 'noteoff') {
    console.log('reversing selected events');
    selectedEvents.reverse();
  }
  // subtract noteoff time from noteon time
  const duration = selectedEvents[1].time - selectedEvents[0].time;

  const newDuration = parseFloat(e.target.value);

  //  current duration log, new duration log
  // set noteoff time to noteon time + duration
  const newNoteOff = {
    ...selectedEvents[1],
    time: selectedEvents[0].time + newDuration,
  };
  // setEvents with new noteoff time
  setEvents(
    events.map((event) => {
      if (
        event.note === selectedEvents[1].note &&
        event.time === selectedEvents[1].time &&
        event.type === selectedEvents[1].type
      ) {
        return newNoteOff;
      }
      return event;
    }),
  );
};

const getSelectedNoteTime = (events) => {
  const selectedEvents = events.filter((event) => event.selected);
  if (selectedEvents.length === 0) {
    console.log('no selected events');
    return 0;
  }

  // get first selected event
  const selectedEvent = selectedEvents[0];
  return selectedEvent.time;
};

const setSelectedNoteTime = (e, events, setEvents) => {
  const selectedEvents = events.filter((event) => event.selected);
  if (selectedEvents.length === 0) {
    console.log('no selected events');
    return;
  }

  // move both noteon and noteoff events
  const newTime = parseFloat(e.target.value);
  const timeDifference = newTime - selectedEvents[0].time;
  setEvents(
    events.map((event) => {
      if (event.selected) {
        return { ...event, time: event.time + timeDifference };
      }
      return event;
    }),
  );
};

const checkIfStartingNoteInMeasure = (
  noteOn,
  startingMeasureIndex,
  lastMesureIndex,
  timePerMeasure,
) => {
  const measure = Math.floor(noteOn.time / timePerMeasure);
  return measure >= startingMeasureIndex && measure <= lastMesureIndex;
};
export {
  createMiddleCNoteEvent,
  createMiddleCNoteOffEvent,
  createEventsFromClick,
  checkIfEventInNote,
  returnTimePerMeasure,
  returnTimePerBeat,
  findPairsInNoteAndOctave,
  clearCurrentMeasure,
  removeNoteFromEvents,
  setSelectedEvent,
  removeSelectedEvents,
  applyMidiEvents,
  getSelectedNoteDuration,
  setSelectedNoteDuration,
  setSelectedNoteTime,
  getSelectedNoteTime,
  checkIfStartingNoteInMeasure,
};

// example events
// [{type: 'noteon', note: 'E4', velocity: 127, time: 1.5, selected: false}
// {type: 'noteoff', note: 'E4', velocity: 127, time: 2, selected: false}
// {type: 'noteon', note: 'G4', velocity: 127, time: 0, selected: false}
// {type: 'noteoff', note: 'G4', velocity: 127, time: 0.5, selected: false}
// {type: 'noteon', note: 'F#4', velocity: 127, time: 0.5, selected: false}
// {type: 'noteoff', note: 'F#4', velocity: 127, time: 1, selected: false}
// {type: 'noteon', note: 'F4', velocity: 127, time: 1, selected: false}
// {type: 'noteoff', note: 'F4', velocity: 127, time: 1.5, selected: false}]

//         const audioData = new Int16Array(
//   fileData.buffer,
//   fileData.byteOffset,
//   properLength / 2,
// );
const applyEventsToWavData = (events, audioData) => {
  const semitoneRatio = Math.pow(2, 1 / 12); // semitone ratio
  const middleCFrequency = 261.63; // Frequency of Middle C (C4)
  const sampleRate = 44100; // Assuming 44.1kHz sample rate
  const maxAmplitude = 32767; // Max amplitude for 16-bit audio
  const minAmplitude = -32768; // Min amplitude for 16-bit audio

  // Function to find the frequency of a given note
  const getNoteFrequency = (note) => {
    const noteNames = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ];
    const octave = parseInt(note.slice(-1), 10);
    const keyNumber = noteNames.indexOf(note.slice(0, -1));
    const n = (octave - 4) * 12 + keyNumber; // Semitone offset from C4
    return middleCFrequency * Math.pow(semitoneRatio, n);
  };

  // Function to pitch-shift the audio data
  const pitchShift = (audioData, ratio) => {
    const newLength = Math.floor(audioData.length / ratio);
    const newAudioData = new Int16Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const index = i * ratio;
      const lowIndex = Math.floor(index);
      const highIndex = Math.ceil(index);
      const interpolation = index - lowIndex;

      // Linear interpolation
      newAudioData[i] =
        (1 - interpolation) * audioData[lowIndex] +
        interpolation * audioData[highIndex];
    }

    return newAudioData;
  };

  // Calculate the total length of the output buffer
  const maxTime = Math.max(
    ...events.map((event) => event.time + (event.type === 'noteoff' ? 0 : 1)),
  );
  const outputLength = Math.ceil(maxTime * sampleRate);
  const outputData = new Int16Array(outputLength);

  events.forEach((event, i) => {
    if (event.type === 'noteon') {
      const frequency = getNoteFrequency(event.note);
      const ratio = frequency / middleCFrequency;
      const scaledAudioData = pitchShift(audioData, ratio);
      const startSample = Math.floor(event.time * sampleRate);

      for (let j = 0; j < scaledAudioData.length; j++) {
        const sampleIndex = startSample + j;
        if (sampleIndex < outputData.length) {
          const mixedSample =
            outputData[sampleIndex] +
            scaledAudioData[j] * (event.velocity / 127);
          outputData[sampleIndex] = Math.max(
            minAmplitude,
            Math.min(maxAmplitude, mixedSample),
          );
        }
      }
    }
  });

  return outputData;
};
