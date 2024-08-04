import {
  checkIfEventInNote,
  createEventsFromClick,
  returnTimePerBeat,
  returnTimePerMeasure,
} from '../../../services/MidiServices';
import './styles/pianoRoll.css';
import React, { useEffect } from 'react';

const PianoRoll = ({ value, setValue, bpm }) => {
  return (
    <div className="midi-options">
      <div className="top-midi-options">
        <div className="default-dd">
          Beats per measure
          <select
            value={value.timeSignatureTop}
            onChange={(e) => {
              const newValue = {
                ...value,
                timeSignatureTop: parseInt(e.target.value),
              };
              setValue(newValue);
            }}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value={5}>5</option>
            <option value="6">6</option>
            <option value="7">7</option>
          </select>
        </div>
        <div className="default-dd">
          Octave
          <select
            value={value.octave}
            onChange={(e) => {
              const newValue = {
                ...value,
                octave: parseInt(e.target.value),
              };
              setValue(newValue);
            }}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
          </select>
          {/* move up an octave */}
          <div
            className="default-button"
            onClick={() => {
              const newValue = {
                ...value,
                octave: value.octave > 6 ? 7 : value.octave + 1,
              };
              setValue(newValue);
            }}
          >
            +
          </div>
          {/* move down an octave */}
          <div
            className="default-button"
            onClick={() => {
              const newValue = {
                ...value,
                octave: value.octave < 2 ? 1 : value.octave - 1,
              };
              setValue(newValue);
            }}
          >
            -
          </div>
        </div>
      </div>
      <div className="middle-midi-section">
        <div className="piano-roll">
          <PianoGrid
            events={value.events}
            setEvents={(events) => {
              const newValue = { ...value, events };
              setValue(newValue);
            }}
            octave={value.octave}
            numMeasures={value.timeSignatureTop}
            bpm={bpm}
          />
        </div>
      </div>
      <div className="bottom-midi-options">
        {/* Time Signature: {value.timeSignatureTop}/4 */}
        <div className="small-font">
          Time per beat: {returnTimePerBeat(bpm)}s
        </div>
        <div className="small-font">
          Time per measure: {returnTimePerMeasure(bpm, value.timeSignatureTop)}s
        </div>
      </div>
    </div>
  );
};

export default PianoRoll;

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

  const isWhiteKey = (note) => {
    return !note.includes('#');
  };

  return (
    <div className="piano-grid">
      {octaveNotes.map((note, idx) => (
        <div className="piano-row" key={idx}>
          <div className="note-label">{note}</div>

          <div
            key={idx}
            className="piano-key"
            style={{
              backgroundColor: isWhiteKey(note) ? '#221' : '#111',
            }}
          >
            {/* for every measure */}
            {Array.from({ length: numMeasures }, (_, measure) => (
              <div
                key={measure}
                className={`measure ${
                  checkIfEventInNote(
                    events,
                    octave,
                    note,
                    measure,
                    bpm,
                    numMeasures,
                  ) && 'active'
                }`}
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
              >
                {/* {checkIfEventInNote(
                  events,
                  octave,
                  note,
                  measure,
                  bpm,
                  numMeasures,
                ) && 'x'} */}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
