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
  return events.filter(
    (event) =>
      !(
        (event.note === noteOn.note && event.time === noteOn.time) ||
        (event.note === noteOff.note && event.time === noteOff.time)
      ),
  );
};

const createEventsFromClick = (
  events,
  setEvents,
  letter,
  octave,
  beat,
  bpm,
  timeSignatureTop,
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
    setEvents(removeNoteFromEvents(events, noteOn, noteOff));
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



export {
  createMiddleCNoteEvent,
  createMiddleCNoteOffEvent,
  createEventsFromClick,
  checkIfEventInNote,
  returnTimePerMeasure,
  returnTimePerBeat,
  findPairsInNoteAndOctave,
  clearCurrentMeasure,
  removeNoteFromEvents
  
};
