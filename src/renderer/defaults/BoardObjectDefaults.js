import midiImage from '../../../assets/icons/device.png';
import wavImage from '../../../assets/gems/Icon2.png';
import ampImage from '../../../assets/icons/horn.png';

const defaultWavFile = {
  name: 'default.wav',
  icon: wavImage,
  type: 'WavFile',
  options: [
    {
      component: 'FileExplorer',
    },
  ],
};

const defaultAmp = {
  name: 'defaultAmp',
  icon: ampImage,
  type: 'Amp',
  options: [
    {
      component: 'slider',
      min: 0,
      max: 100,
      step: 1,
      prop: 'value',
      value: 100,
      label: 'Level',
    },
  ],
};

const defaultMidi = {
  name: 'defaultMidi',
  icon: midiImage,
  type: 'Midi',
  options: [],
};

const defaultOscillator = {
  name: 'defaultOscillator',
  icon: 'default.png',
  type: 'Oscillator',
  options: [
    {
      component: 'oscillatorOptions',
    },
  ],
};

const defaultSwitch = {
  name: 'defaultSwitch',
  icon: 'default.png',
  type: 'Switch',
  options: [
    {
      component: 'switchOptions',
    },
  ],
};

export {
  defaultWavFile,
  defaultAmp,
  defaultMidi,
  defaultOscillator,
  defaultSwitch,
};
