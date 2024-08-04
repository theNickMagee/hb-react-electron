import React from 'react';
import './styles/pianoRoll.css';
import {
  checkIfEventInNote,
  createEventsFromClick,
  findPairsInNoteAndOctave,
  returnTimePerBeat,
  returnTimePerMeasure,
} from '../../../services/MidiServices';

const PianoRoll = ({ value, setValue, bpm }) => (
  <div className="midi-options">
    <div className="top-midi-options">
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
          numMeasures={value.timeSignatureTop}
          bpm={bpm}
        />
      </div>
    </div>
    <div className="bottom-midi-options">
      <div className="small-font">Time per beat: {returnTimePerBeat(bpm)}s</div>
      <div className="small-font">
        Time per measure: {returnTimePerMeasure(bpm, value.timeSignatureTop)}s
      </div>
    </div>
  </div>
);

const PianoGrid = ({ events, setEvents, octave, numMeasures, bpm }) => {
  const octaveNotes = [
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

  return (
    <div className="piano-grid">
      {octaveNotes.map((note, idx) => (
        <div className="piano-row" key={note}>
          <div className="note-label">{note}</div>
          <EventNotes
            events={events}
            octave={octave}
            numMeasures={numMeasures}
            note={note}
            bpm={bpm}
          />
          <div
            className="piano-key"
            style={{ backgroundColor: note.includes('#') ? '#111' : '#221' }}
          >
            {Array.from({ length: numMeasures }).map((_, measure) => (
              <div
                key={measure}
                className={`measure ${checkIfEventInNote(events, octave, note, measure, bpm, numMeasures) ? 'active' : ''}`}
                onClick={() =>
                  createEventsFromClick(
                    events,
                    setEvents,
                    note,
                    octave,
                    measure,
                    bpm,
                    numMeasures,
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

const EventNotes = ({ events, octave, numMeasures, note, bpm }) => {
  const noteEvents = findPairsInNoteAndOctave(
    bpm,
    numMeasures,
    events,
    note,
    octave,
  );
  const timePerEntireLine =
    returnTimePerMeasure(bpm, numMeasures) * numMeasures;

  return noteEvents.map(({ noteOn, noteOff }, index) => {
    const noteLength = noteOff.time - noteOn.time;
    const notePosition = (noteOn.time / timePerEntireLine) * 100;
    const noteWidth = (noteLength / timePerEntireLine) * 100;

    return (
      <div
        key={index}
        className="event-note"
        style={{
          left: `1.5rem`,
          marginLeft: `${notePosition}%`,
          width: `${noteWidth}%`,
          position: 'absolute',
          backgroundColor: 'rgba(255, 3, 255, 0.5)',
          height: '100%',
        }}
      ></div>
    );
  });
};

export default PianoRoll;
