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

export { createMiddleCNoteEvent, createMiddleCNoteOffEvent };
