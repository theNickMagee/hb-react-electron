import React, { useEffect, useState } from 'react';
import { handleMidiMessage } from '../controllers/CircuitController';

const MidiListener = ({ data, setData }) => {
  const [midiAccess, setMidiAccess] = useState(null);
  const [midiInputs, setMidiInputs] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      console.error('Web MIDI API not supported in this browser.');
    }
  }, []);

  const onMIDISuccess = (midiAccess) => {
    setMidiAccess(midiAccess);
    const inputs = Array.from(midiAccess.inputs.values());
    setMidiInputs(inputs);

    inputs.forEach((input) => {
      input.onmidimessage = handleMIDIMessage;
    });
  };

  const onMIDIFailure = () => {
    console.error('Failed to get MIDI access.');
  };

  const handleMIDIMessage = (message) => {
    const [command, note, velocity] = message.data;
    console.log(`Command: ${command}, Note: ${note}, Velocity: ${velocity}`);
    handleMidiMessage({ command, note, velocity }, data);
    setMessages((prevMessages) => [
      ...prevMessages,
      { command, note, velocity },
    ]);
  };

  return <></>;
};

export default MidiListener;
