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
    } else {
      message = '';
    }

    return message;
  };

  //   useEffect(() => {
  //     decideToolTip(sessionData);
  //   }, [sessionData?.droppingItem.isDroppingItem, sessionData?.isCreatingWire]);

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
