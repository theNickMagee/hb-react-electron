import React, { useEffect } from 'react';
import OptionDropDown from '../../../miniComponents/OptionDropDown';

const StepOptions = ({ numMeasures, step, setStep, boardObjects }) => {
  const [boardObject, setBoardObject] = React.useState(null);

  useEffect(() => {
    const obj = boardObjects.find((obj) => obj.id === step.targetBoardObjectId);
    setBoardObject(obj);
  }, [step.targetBoardObjectId, step.action]);

  return (
    <div className="step">
      <div className="step-bos">
        <div className="step-option">
          <div className="small-font">Board Object:</div>
          <select
            className="default-dd"
            value={step.targetBoardObjectId || ''}
            onChange={(e) =>
              setStep(step.id, 'targetBoardObjectId', e.target.value)
            }
          >
            <option value="">Select</option>
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
              <option value="play path after">Play Path After</option>
              <option value="play path before">Play Path Before</option>

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
        {step.targetBoardObjectId &&
          boardObject &&
          step.action &&
          boardObject.options.map((option, index) => {
            if (
              !option.heroEnabled ||
              option.prop !== step.action.replace('Set ', '')
            ) {
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
            return null;
          })}
        {step.targetBoardObjectId && boardObject && step.action && (
          <OptionDropDown
            label="Measure"
            value={step.measure}
            onChange={(e) => setStep(step.id, 'measure', e.target.value)}
          >
            {[...Array(numMeasures + 1).keys()].map((n) => (
              <option key={n} value={n}>
                {n + 1}
              </option>
            ))}
          </OptionDropDown>
        )}
      </div>
    </div>
  );
};

export default StepOptions;
