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

const createEventsFromClick = (events, setEvents, letter, octave) => {
  console.log('createEventsFromClick: ', events, letter, octave);
  const note = `${letter}${octave}`;
  const noteOn = createDefaultNotesForClick(letter, octave)[0];
  const noteOff = createDefaultNotesForClick(letter, octave)[1];
  if (checkIfEventInNote(events, octave, letter, 1)) {
    setEvents(removeNoteFromEvents(events, noteOn));
    setEvents(removeNoteFromEvents(events, noteOff));
  } else {
    setEvents(addNoteToEvents(events, noteOn));
    setEvents(addNoteToEvents(events, noteOff));
  }
};

// return length of noteOn - noteOff if found - for now just return true if found
const checkIfEventInNote = (events, noteOctave, noteLetter, noteMeasure) => {
  return events.some((event) => {
    return event.note === `${noteLetter}${noteOctave}`;
  });
};

export {
  createMiddleCNoteEvent,
  createMiddleCNoteOffEvent,
  createEventsFromClick,
  checkIfEventInNote,
};
