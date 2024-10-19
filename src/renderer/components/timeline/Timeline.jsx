import React, { useEffect, useState } from 'react';
import OptionDropDown from '../miniComponents/OptionDropDown';
import './Timeline.css';
import { getAllHeroes } from '../../services/HeroServices';

const Timeline = ({ data, setData, setSessionData, sessionData }) => {
  const handleBpmChange = (e) => {
    const newBpm = parseInt(e.target.value, 10);
    setData({ ...data, timeline: { ...data.timeline, bpm: newBpm } });
  };

  const [allHeroes, setAllHeroes] = useState([]);

  useEffect(() => {
    const heroes = getAllHeroes({ data });
    setAllHeroes(heroes);
  }, [data && data.boardObjects]);

  const getHeroSteps = (heroId) => {
    const hero = data.boardObjects.find((obj) => obj.id === heroId);
    if (hero) {
      return hero.options[1].value.steps;
    }
    return [];
  };

  const isStepAtMeasure = (steps, measure) => {
    if (!steps) return;
    return steps.some((step) => parseInt(step.measure, 10) === measure);
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
        {allHeroes.map((hero) => {
          const steps = getHeroSteps(hero.id);
          return (
            <div key={hero.id} className="timeline-hero-row">
              {[...Array(data.timeline.measures).keys()].map((n) => (
                <div
                  key={n}
                  className={`timeline-measure ${isStepAtMeasure(steps, n) ? 'highlight' : ''}`}
                ></div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
