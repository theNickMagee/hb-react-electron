import React, { useEffect } from 'react';
import './Tooltip.css';

const ToolTip = ({ sessionData, setSessionData }) => {
  if (!sessionData.tooltip.message) return null;

  const decideToolTip = () => {
    let message = '';

    if (sessionData.droppingItem.isDroppingItem) {
      message = 'Dropping item now';
    } else if (sessionData.isCreatingWire) {
      message = 'Creating wire';
    } else if (sessionData.options.open) {
      message = 'Editing options';
    } else if (sessionData.warningMessage) {
      //   message = sessionData.warningMessage;
      //   setSessionData((prevData) => ({
      //     ...prevData,
      //     warningMessage: '',
      //   }));
      //   setTimeout(() => {
      //     console.log('Timeout executed');
      //     setSessionData((prevData) => {
      //       console.log('Previous session data:', prevData);
      //       const newData = {
      //         ...prevData,
      //         tooltip: {
      //           ...prevData.tooltip,
      //           message: '',
      //         },
      //       };
      //       console.log('New session data:', newData);
      //       return newData;
      //     });
      //   }, 3000);
    } else {
      message = '';
    }

    return message;
  };

  return (
    <div className="tooltip">
      {decideToolTip()}
      <div className="tooltip-footer">
        Project Drawer Path: {sessionData.projectDrawerPath || 'Not Set'}
      </div>
    </div>
  );
};

export default ToolTip;
