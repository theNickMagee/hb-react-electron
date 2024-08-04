import './styles/pianoRoll.css';
import React, { useEffect } from 'react';

const PianoRoll = ({ value, setValue, bpm }) => {
  useEffect(() => {
    console.log('PianoRoll render with value:', value);
    // look for changes in any of the values
  }, [value, value && value.timeSignatureTop, bpm]);

  const returnTimePerBeat = (bpm) => {
    return Math.round((60 / bpm) * 100) / 100;
  };

  const returnTimePerMeasure = (bpm, timeSignatureTop) => {
    return Math.round((60 / bpm) * timeSignatureTop * 100) / 100;
  };

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
      </div>
      <div className="middle-midi-section">
        <div className="piano-roll"></div>
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
