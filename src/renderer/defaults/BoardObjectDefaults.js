const defaultWavFile = {
  name: 'default.wav',
  icon: 'default.png',
  type: 'WavFile',
  options: [
    {
      component: 'FileExplorer',
    },
  ],
};

const defaultAmp = {
  name: 'defaultAmp',
  icon: 'default.png',
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
  icon: 'default.png',
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
