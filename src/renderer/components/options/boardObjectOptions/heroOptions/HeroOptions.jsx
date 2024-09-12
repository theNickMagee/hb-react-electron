import '../styles/heroOptions.css';
import React, { useEffect } from 'react';
import StepOptions from './StepOptions';

const HeroOptions = ({ data, setData, sessionData, setSessionData }) => {
  const hero = sessionData.options.currentEditItem;

  const steps = hero.options[0].value.steps;

  const setStep = (stepid, key, value) => {
    const currentBoardObject = { ...sessionData.options.currentEditItem };

    // Find step with id
    let currentStep = currentBoardObject.options[0].value.steps.find(
      (step) => step.id === stepid,
    );

    // Update data
    if (currentStep) {
      const updatedSteps = currentBoardObject.options[0].value.steps.map(
        (step) =>
          step.id === stepid ? { ...currentStep, [key]: value } : step,
      );

      // Update hero with new steps
      const newBoardObjects = data.boardObjects.map((obj) => {
        if (obj.id === currentBoardObject.id) {
          return {
            ...currentBoardObject,
            options: [
              {
                ...currentBoardObject.options[0],
                value: {
                  ...currentBoardObject.options[0].value,
                  steps: updatedSteps,
                },
              },
            ],
          };
        }
        return obj;
      });

      setData({ ...data, boardObjects: newBoardObjects });
      setSessionData({
        ...sessionData,
        options: {
          ...sessionData.options,
          currentEditItem: {
            ...currentBoardObject,
            options: [
              {
                ...currentBoardObject.options[0],
                value: {
                  ...currentBoardObject.options[0].value,
                  steps: updatedSteps,
                },
              },
            ],
          },
        },
      });
    }
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
    </div>
  );
};

export default HeroOptions;
