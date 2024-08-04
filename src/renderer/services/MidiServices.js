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
  measure,
  timePerMeasure,
) => {
  return [
    {
      type: 'noteon',
      note: `${letter}${octave}`,
      velocity: 127,
      time: timePerMeasure * measure,
    },
    {
      type: 'noteoff',
      note: `${letter}${octave}`,
      velocity: 127,
      time: timePerMeasure * measure + 1,
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
  measure,
  bpm,
  timeSignatureTop,
) => {
  console.log('createEventsFromClick: ', events, letter, octave, measure);
  const timePerMeasure = returnTimePerMeasure(bpm, timeSignatureTop);
  const notes = createDefaultNotesForClick(
    letter,
    octave,
    measure,
    timePerMeasure,
  );
  const noteOn = notes[0];
  const noteOff = notes[1];

  if (
    checkIfEventInNote(events, octave, letter, measure, bpm, timeSignatureTop)
  ) {
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
  noteMeasure,
  bpm,
  timeSignatureTop,
) => {
  const timePerMeasure = returnTimePerMeasure(bpm, timeSignatureTop);

  const measureStartTime = timePerMeasure * noteMeasure;
  const measureEndTime = measureStartTime + timePerMeasure;

  return events.some((event) => {
    const eventTime = event.time;
    return (
      event.note === `${noteLetter}${noteOctave}` &&
      eventTime > measureStartTime &&
      eventTime < measureEndTime
    );
  });
};

const returnTimePerMeasure = (bpm, timeSignatureTop) => {
  return Math.round((60 / bpm) * timeSignatureTop * 1000) / 1000; // Use milliseconds
};

const returnTimePerBeat = (bpm) => {
  return Math.round((60 / bpm) * 1000) / 1000; // Use milliseconds
};

export {
  createMiddleCNoteEvent,
  createMiddleCNoteOffEvent,
  createEventsFromClick,
  checkIfEventInNote,
  returnTimePerMeasure,
  returnTimePerBeat,
};
