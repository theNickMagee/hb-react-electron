import '../styles/heroOptions.css';
import React, { useEffect } from 'react';

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

const StepOptions = ({ step, setStep, boardObjects }) => {
  const [boardObject, setBoardObject] = React.useState(null);

  useEffect(() => {
    // after a board object is selected, loop thru board Objects 'options
    //set board object to the id presented based on boardObjects
    const obj = boardObjects.find((obj) => obj.id === step.targetBoardObjectId);
    setBoardObject(obj);
    console.log('boardObject in StepOptions:', obj);
  }, [step.targetBoardObjectId, step.action]);

  return (
    <div className="step">
      <div className="step-bos">
        <div className="step-option">
          <div className="small-font">Board Object:</div>
          <select
            className="default-dd"
            value={step.targetBoardObjectId}
            onChange={(e) =>
              setStep(step.id, 'targetBoardObjectId', e.target.value)
            }
          >
            <option value={null}>Select</option>
            {boardObjects.map((obj) => {
              return (
                <option key={obj.id} value={obj.id}>
                  {obj.name}
                </option>
              );
            })}
          </select>
        </div>
        {step.targetBoardObjectId && boardObject && (
          <div className="step-option">
            <div className="small-font">Action:</div>
            <select
              className="default-dd"
              value={step.action}
              onChange={(e) => setStep(step.id, 'action', e.target.value)}
            >
              <option value={null}>Select</option>
              {boardObject.options.map((option, index) => {
                if (!option.heroEnabled) {
                  return null;
                }
                return (
                  <option key={index} value={'Set ' + option.prop}>
                    Set {option.label}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        {/* if there is a step action, provide the necessary options */}
        {step.targetBoardObjectId &&
          boardObject &&
          step.action &&
          boardObject.options.map((option, index) => {
            if (
              !option.heroEnabled ||
              option.prop !== step.action.replace('Set ', '')
            ) {
              // check that this option is the one of the step.
              return null;
            }
            if (option.component === 'slider') {
              return (
                <div className="option-container" key={index}>
                  <input
                    type="range"
                    min={option.min}
                    max={option.max}
                    step={option.step}
                    value={step.targetValue}
                    onChange={(e) =>
                      setStep(step.id, 'targetValue', e.target.value)
                    }
                  />
                </div>
              );
            }
            // Add other option components here if needed
            return null;
          })}
      </div>
    </div>
  );
};
