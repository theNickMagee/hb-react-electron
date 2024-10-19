import '../styles/heroOptions.css';
import React, { useEffect } from 'react';
import StepOptions from './StepOptions';

const HeroOptions = ({ data, setData, sessionData, setSessionData }) => {
  const hero = { ...sessionData.options.currentEditItem };

  console.log('hero YAYA', hero);

  const steps = hero.options[1].value.steps;

  const setStep = (stepid, key, value) => {
    const currentBoardObject = { ...sessionData.options.currentEditItem };

    // Find step with id
    let currentStep = currentBoardObject.options[1].value.steps.find(
      (step) => step.id === stepid,
    );

    // Update data
    if (currentStep) {
      const updatedSteps = currentBoardObject.options[1].value.steps.map(
        (step) =>
          step.id === stepid ? { ...currentStep, [key]: value } : step,
      );

      let currentObjData = null;
      // Update hero with new steps
      const newBoardObjects = data.boardObjects.map((obj) => {
        if (obj.id === currentBoardObject.id) {
          currentObjData = obj;
          return {
            ...currentBoardObject,
            options: [
              {
                ...obj.options[0],
              },
              {
                ...obj.options[1],
                value: {
                  ...obj.options[1].value,
                  steps: updatedSteps,
                },
              },
            ],
          };
        }
        return obj;
      });

      setData((prevData) => {
        return {
          ...prevData,
          boardObjects: newBoardObjects,
        };
      });
      setSessionData({
        ...sessionData,
        options: {
          ...sessionData.options,
          currentEditItem: {
            ...currentBoardObject,
            options: [
              {
                ...currentObjData.options[0],
              },
              {
                ...currentObjData.options[1],
                value: {
                  ...currentObjData.options[1].value,
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
      {steps?.map((step) => {
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
