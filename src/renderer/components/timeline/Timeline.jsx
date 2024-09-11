import React from 'react';
import OptionDropDown from '../miniComponents/OptionDropDown';
import './Timeline.css';

const Timeline = ({ data, setData, setSessionData, sessionData }) => {
  const handleBpmChange = (e) => {
    const newBpm = parseInt(e.target.value, 10);
    setData({ ...data, timeline: { ...data.timeline, bpm: newBpm } });
  };

  return (
    <div className="timeline">
      <div className="timeline-header">
        <div className="timeline-label">Timeline</div>
        <div className="timeline-options">
          <OptionDropDown
            label="Measures"
            value={data.timeline.measures}
            onChange={(e) =>
              setData({
                ...data,
                timeline: {
                  ...data.timeline,
                  measures: parseInt(e.target.value, 10),
                },
              })
            }
          >
            {[...Array(60).keys()].map((n) => (
              <option key={n} value={n + 1}>
                {n + 1}
              </option>
            ))}
          </OptionDropDown>
          <div className="textbox-input">
            <div className="textbox-label">BPM</div>
            <input
              type="text"
              value={data.timeline.bpm}
              onChange={handleBpmChange}
              className="bpm-input"
            />
          </div>
        </div>
      </div>
      <div className="timeline-content">
        {/* for each hero, in the beginning have inactive or inactive - not right now but maybe in the future */}
      </div>
    </div>
  );
};

export default Timeline;
