import React, { useEffect } from 'react';

const KeypressedListener = ({ onKeypress }) => {
    useEffect(() => {
        // Function to call on key press
        const handleKeyPress = (event) => {
            onKeypress(event); // Call the passed callback function
        };

        // Add event listener for 'keypress' event
        window.addEventListener('keypress', handleKeyPress);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [onKeypress]); // Dependency array includes the callback to rebind if it changes

    return null; // Component does not render anything
};

export default KeypressedListener;
