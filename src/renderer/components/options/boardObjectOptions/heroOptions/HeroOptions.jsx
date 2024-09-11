import '../styles/heroOptions.css';
import React, { useEffect } from 'react';
import StepOptions from './StepOptions';

const HeroOptions = ({ data, setData, sessionData, setSessionData }) => {
  const hero = sessionData.options.currentEditItem;

  const steps = hero.options[0].value.steps;

  const setStep = (stepid, key, value) => {
    const currentBoardObject = sessionData.options.currentEditItem;

    // find step with id
    let currentStep = currentBoardObject.options[0].value.steps.find(
      (step) => step.id === stepid,
    );
    console.log('currentStep:', currentStep);

    // update data
    currentStep[key] = value;

    // update hero
    setData({
      ...data,
      boardObjects: data.boardObjects.map((obj) => {
        if (obj.id === currentBoardObject.id) {
          return currentBoardObject;
        }
        return obj;
      }),
    });
  };

  return (
    <div className="hero-options">
      Steps
      {steps.map((step) => {
        return (
          <StepOptions
            key={step.id}
            step={step}
            setStep={setStep}
            boardObjects={data.boardObjects}
            numMeasures={data.timeline.measures}
          />
        );
      })}
      {/* first show all board objects */}
      {/* after board object is selected, show available functions, or actions, or sets they can take */}
      {/* once the action is taken, show the other options (usually time or measure and bar) */}
    </div>
  );
};

export default HeroOptions;
