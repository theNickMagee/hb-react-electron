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

  if (checkIfEventInNote(events, octave, letter, beat, bpm, timeSignatureTop)) {
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

  // Check for an active note within the beat time range
  return events.some((event) => {
    if (event.note === fullNoteName) {
      if (
        event.type === 'noteon' &&
        event.time >= startTime &&
        event.time < endTime
      ) {
        // Check corresponding noteoff event
        const noteOffEvent = events.find(
          (offEvent) =>
            offEvent.type === 'noteoff' &&
            offEvent.note === fullNoteName &&
            offEvent.time >= event.time,
        );
        return !noteOffEvent || noteOffEvent.time > startTime;
      }
    }
    return false;
  });
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

export {
  createMiddleCNoteEvent,
  createMiddleCNoteOffEvent,
  createEventsFromClick,
  checkIfEventInNote,
  returnTimePerMeasure,
  returnTimePerBeat,
  findPairsInNoteAndOctave,
};
