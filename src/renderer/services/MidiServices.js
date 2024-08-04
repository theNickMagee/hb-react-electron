const createMiddleCNoteEvent = () => {
  return {
    type: 'noteon',
    note: 'C4',
    velocity: 127,
    duration: 500,
  };
};

const createMiddleCNoteOffEvent = () => {
  return {
    type: 'noteoff',
    note: 'C4',
    velocity: 127,
    duration: 500,
  };
};

const createDefaultNotesForClick = (letter, octave) => {
  return [
    {
      type: 'noteon',
      note: `${letter}${octave}`,
      velocity: 127,
      duration: 500,
    },
    {
      type: 'noteoff',
      note: `${letter}${octave}`,
      velocity: 127,
      duration: 500,
    },
  ];
};

const addNoteToEvents = (events, note) => {
  return [...events, note];
};

const removeNoteFromEvents = (events, note) => {
  return events.filter((event) => event.note !== note.note);
};

const createEventsFromClick = (events, letter, octave) => {
  console.log('createEventsFromClick: ', events, letter, octave);
  const note = createDefaultNotesForClick(letter, octave);
  if (events.some((event) => event.note === note[0].note)) {
    return removeNoteFromEvents(events, note[0]);
  } else {
    return addNoteToEvents(events, note[0]);
  }
};

// return length of noteOn - noteOff if found - for now just return true if found
const checkIfEventInNote = (events, noteOctave, noteLetter, noteMeasure) => {
  console.log(
    'checkIfEventInNote: ',
    events,
    noteOctave,
    noteLetter,
    noteMeasure,
  );
  return events.some((event) => {
    return (
      event.note === `${noteLetter}${noteOctave}` &&
      event.measure === noteMeasure
    );
  });
};

export {
  createMiddleCNoteEvent,
  createMiddleCNoteOffEvent,
  createEventsFromClick,
  checkIfEventInNote,
};
