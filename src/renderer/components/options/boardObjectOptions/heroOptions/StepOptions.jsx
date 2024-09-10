import React, { useEffect } from 'react';

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
              <option value="Play path after">Play Path After</option>
              <option value="Loop path after">Loop Path After</option>

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

        {/* if there is an action selected, allow for the "Time" to be selected */}
      </div>
    </div>
  );
};

export default StepOptions;
