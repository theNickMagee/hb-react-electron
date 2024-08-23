import '../styles/heroOptions.css'
import React, { useEffect } from 'react';

const HeroOptions = ({  data, setData, sessionData, setSessionData }) => {

    const hero = sessionData.options.currentEditItem;

    const steps = hero.options[0].value.steps;

    const setStep = (stepid, key, value) => {
        const currentBoardObject = sessionData.options.currentEditItem;

        // find step with id
        let currentStep = currentBoardObject.options[0].value.steps.find((step) => step.id === stepid);
        console.log('currentStep:', currentStep);

        // update data
        


    }

    return (
        <div className="hero-options">
            Steps
            {steps.map((step) => {
                return (
                   <StepOptions key={step.id} step={step} setStep={setStep}  boardObjects={data.boardObjects} />
                )
            })}

            
            {/* first show all board objects */}

            {/* after board object is selected, show available functions, or actions, or sets they can take */}
            {/* once the action is taken, show the other options (usually time or measure and bar) */}
       
        </div>
    )
}

export default HeroOptions;


const StepOptions = ({ step, setStep, boardObjects }) => {

    const [boardObject, setBoardObject] = React.useState(null);

    useEffect(() => {
        // after a board object is selected, loop thru board Objects 'options
        //set board object to the id presented based on boardObjects
        const obj = boardObjects.find((obj) => obj.id === step.targetBoardObjectId);
        setBoardObject(obj);
        console.log('boardObject in StepOptions:', obj);
    }, [
        step.targetBoardObjectId,
        step.action,
    ])
    
    return (
        <div className="step">
            <div className="step-bos">
                <div className="step-option">
                <div className="small-font">Board Object:</div>
                <select className="default-dd" value={step.targetBoardObjectId} onChange={(e) => setStep('targetBoardObjectId', e.target.value)}>
                    <option value={null}>Select</option>
                    {boardObjects.map((obj) => {
                        return (
                            <option key={obj.id} value={obj.id}>{obj.name}</option>
                        )
                    })}
                </select>
                </div>
                {
                    step.targetBoardObjectId && (
                        <div className="step-option">
                            <div className="small-font">Action:</div>
                            <select className="default-dd" value={step.action} onChange={(e) => setStep('action', e.target.value)}>
                                {boardObject.options.map((option) => {
                                    return (
                                        <option key={option.id} value={option.id}>{option.label}</option>
                                    )
                                }
                                )}
                            </select>
                        </div>
                    )

                }
            </div>

        </div>
    )
}