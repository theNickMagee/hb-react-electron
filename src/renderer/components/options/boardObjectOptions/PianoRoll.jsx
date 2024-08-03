import './styles/pianoRoll.css';

const PianoRoll = ({ value, setValue, bpm }) => {
  const returnTimePerBeat = (bpm) => {
    // return a float with 2 decimal places
    return Math.round((60 / bpm) * 100) / 100;
  };

  const returnTimePerMeasure = (bpm, timeSignatureTop) => {
    // return a float with 2 decimal places
    return Math.round((60 / bpm) * timeSignatureTop * 100) / 100;
  };

  return (
    <div className="midi-options">
      <div className="top-midi-options">
        {/* time signature dropdown */}
        {/* total time per measure */}
        {/* calculated time per beat */}
      </div>
      <div className="middle-midi-section">
        <div className="piano-roll"></div>
      </div>
      <div className="bottom-midi-options">
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
