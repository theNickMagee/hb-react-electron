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
  name: 'Wav',
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
  name: 'Amp',
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
  name: 'MIDI',
  icon: midiImage,
  type: 'Midi',
  options: [
    {
      component: 'PianoRoll',
      value: {
        timeSignatureTop: 4,
        timeSignatureBottom: 4,
        firstMesureIndex: 0,
        lastMesureIndex: 1,
        octave: 4,
        bpm: 120,
        events: [
          // { ...createMiddleCNoteEvent() },
          // { ...createMiddleCNoteOffEvent() },
        ],
      },
    },
  ],
};

const defaultOscillator = {
  name: 'Oscillator',
  icon: oscillatorImage,
  type: 'Oscillator',
  options: [
    {
      component: 'oscillatorOptions',
    },
  ],
};

const defaultSwitch = {
  name: 'Switch',
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
