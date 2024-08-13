import React from 'react';
import './styles/pianoRoll.css';
import {
  checkIfEventInNote,
  createEventsFromClick,
  findPairsInNoteAndOctave,
  returnTimePerBeat,
  returnTimePerMeasure,
  clearCurrentMeasure,
  removeNoteFromEvents,
  setSelectedEvent,
  removeSelectedEvents,
  getSelectedNoteDuration,
  setSelectedNoteDuration,
} from '../../../services/MidiServices';

const PianoRoll = ({ value, setValue }) => {
  const setEvents = (newValue) => {
    setValue({ ...value, events: newValue });
  };
  return (
    <div className="midi-options">
      <div className="top-midi-options">
        <input
          type="range"
          min="60"
          max="240"
          step="1"
          value={value.bpm}
          onChange={(e) =>
            setValue({ ...value, bpm: parseInt(e.target.value, 10) })
          }
        />
        <div className="small-font">BPM: {value.bpm}</div>
        <div className="default-dd">
          Beats per measure
          <select
            value={value.timeSignatureTop}
            onChange={(e) =>
              setValue({
                ...value,
                timeSignatureTop: parseInt(e.target.value, 10),
              })
            }
          >
            {[...Array(7).keys()].map((n) => (
              <option key={n} value={n + 1}>
                {n + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="default-dd">
          Octave
          <select
            value={value.octave}
            onChange={(e) =>
              setValue({ ...value, octave: parseInt(e.target.value, 10) })
            }
          >
            {[...Array(7).keys()].map((n) => (
              <option key={n} value={n + 1}>
                {n + 1}
              </option>
            ))}
          </select>
          <button
            className="default-button"
            onClick={() =>
              setValue({ ...value, octave: Math.min(value.octave + 1, 7) })
            }
          >
            +
          </button>
          <button
            className="default-button"
            onClick={() =>
              setValue({ ...value, octave: Math.max(value.octave - 1, 1) })
            }
          >
            -
          </button>
        </div>
      </div>
      <div className="middle-midi-section">
        <div className="piano-roll">
          <PianoGrid
            events={value.events}
            setEvents={(newValue) => setValue({ ...value, events: newValue })}
            octave={value.octave}
            numBeats={value.timeSignatureTop}
            bpm={value.bpm}
          />
        </div>
      </div>
      <div className="bottom-midi-options">
        {/* id a beat is selected, show delete button */}
        {value.events.filter((event) => event.selected).length > 0 && (
          // slider for duration - move the end note
          <div className="selected-note-options">
            <input
              type="range"
              value={getSelectedNoteDuration(value.events)}
              onChange={(e) =>
                setSelectedNoteDuration(e, value.events, setEvents)
              }
              min="0"
              max="3"
              step="0.01"
            />
            <div
              className="default-button"
              onClick={() =>
                setValue({
                  ...value,
                  events: removeSelectedEvents(value.events),
                })
              }
            >
              {/* show selected events */}
              {/* {value.events.filter((event) => event.selected).length} */}
              Delete Selected
            </div>
          </div>
        )}
        <div className="small-font">
          Time per beat: {returnTimePerBeat(value.bpm)}s
        </div>
        <div className="small-font">
          Time per measure:{' '}
          {returnTimePerMeasure(value.bpm, value.timeSignatureTop)}s
        </div>
        {/* clear measure */}
        {/* <div
        className="default-button"
        onClick={() => clearCurrentMeasure(value, setValue)}
      >
        Clear Measure
      </div> */}
      </div>
    </div>
  );
};

const PianoGrid = ({ events, setEvents, octave, numBeats, bpm }) => {
  let octaveNotes = [
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

  // reverse octave notes
  octaveNotes = octaveNotes.reverse();

  return (
    <div className="piano-grid">
      {octaveNotes.map((note, idx) => (
        <div className="piano-row" key={note}>
          <div className="note-label">{note}</div>
          <EventNotes
            events={events}
            octave={octave}
            numBeats={numBeats}
            note={note}
            bpm={bpm}
            setEvents={setEvents}
          />
          <div
            className="piano-key"
            style={{ backgroundColor: note.includes('#') ? '#111' : '#221' }}
          >
            {Array.from({ length: numBeats }).map((_, beat) => (
              <div
                key={beat}
                className={`beat ${checkIfEventInNote(events, octave, note, beat, bpm, numBeats) ? 'active' : ''}`}
                onClick={() =>
                  createEventsFromClick(
                    events,
                    setEvents,
                    note,
                    octave,
                    beat,
                    bpm,
                    numBeats,
                  )
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const EventNotes = ({ events, octave, numBeats, note, bpm, setEvents }) => {
  const totalLineTime = returnTimePerMeasure(bpm, numBeats); // Calculate time per measure based on bpm and beats per measure

  const noteEvents = findPairsInNoteAndOctave(
    bpm,
    numBeats,
    events,
    note,
    octave,
  );

  return noteEvents.map(({ noteOn, noteOff }, index) => {
    if (!noteOn || !noteOff) {
      return null;
    }
    const startTime = noteOn.time; // Start time of the note
    const endTime = noteOff.time; // End time of the note
    const duration = endTime - startTime; // Duration of the note

    const notePosition = (startTime / totalLineTime) * 100; // Position of the note from the start of the grid
    const noteWidth = (duration / totalLineTime) * 100; // Width of the note representing its duration

    return (
      <MidiNote
        key={index}
        events={events}
        noteOn={noteOn}
        noteOff={noteOff}
        setEvents={setEvents}
        notePosition={notePosition}
        noteWidth={noteWidth}
        selected={noteOn.selected}
      />
    );
  });
};

export default PianoRoll;

const MidiNote = ({
  events,
  noteOn,
  noteOff,
  setEvents,
  notePosition,
  noteWidth,
  selected,
}) => {
  const handleNotePress = () => {
    setEvents(setSelectedEvent(events, noteOn, noteOff));
  };

  return (
    <div
      style={{
        left: `${notePosition}%`, // Position of the note from the start of the grid
        width: `${noteWidth}%`, // Width of the note representing its duration
        position: 'absolute',
        backgroundColor: 'rgba(255, 3, 255, 0.5)', // Visual style for the note
        height: '100%',
        border: selected ? '2px solid #fff' : 'none',
        zIndex: 10,
      }}
      // onClick={() => setEvents(removeNoteFromEvents(events, noteOn, noteOff))}
      onClick={handleNotePress}
    />
  );
};
