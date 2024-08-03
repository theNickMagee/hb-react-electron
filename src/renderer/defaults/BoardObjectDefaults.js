import midiImage from '../../../assets/icons/device.png';
import wavImage from '../../../assets/gems/Icon9.png';
import ampImage from '../../../assets/icons/horn.png';
import oscillatorImage from '../../../assets/gems/Icon33.png';
import switchImage from '../../../assets/gems/Icon22.png';
import {
  createMiddleCNoteEvent,
  createMiddleCNoteOffEvent,
} from '../services/MidiServices';
const defaultWavFile = {
  name: 'default.wav',
  icon: wavImage,
  type: 'WavFile',
  options: [
    {
      component: 'FileExplorer',
      file: null,
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
  options: [
    {
      component: 'PianoRoll',
      value: {
        timeSignatureTop: 4,
        timeSignatureBottom: 4,
        events: [
          { ...createMiddleCNoteEvent() },
          { ...createMiddleCNoteOffEvent() },
        ],
      },
    },
  ],
};

const defaultOscillator = {
  name: 'defaultOscillator',
  icon: oscillatorImage,
  type: 'Oscillator',
  options: [
    {
      component: 'oscillatorOptions',
    },
  ],
};

const defaultSwitch = {
  name: 'defaultSwitch',
  icon: switchImage,
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
