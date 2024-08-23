import midiImage from '../../../assets/icons/device.png';
import wavImage from '../../../assets/icons/cd64.png';
import ampImage from '../../../assets/icons/horn.png';
import oscillatorImage from '../../../assets/icons/torch.png';
import switchImage from '../../../assets/icons/cyberpunk/laser.png';
import heroImage from '../../../assets/icons/cyberpunk/needle.png';
import {
  createMiddleCNoteEvent,
  createMiddleCNoteOffEvent,
} from '../services/MidiServices';
import { generateRandomId } from '../services/util';
const defaultWavFile = {
  name: 'Wav',
  icon: wavImage,
  type: 'WavFile',
  options: [
    {
      component: 'FileExplorer',
      file: null,
      label: 'File',
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
      component: 'dropdown',
      choices: ['sine', 'square', 'sawtooth', 'triangle'],
      value: 'sine',
      label: 'Waveform',
    },
    {
      component: 'slider',
      min: 20,
      max: 20000,
      step: 1,
      value: 440,
      label: 'Frequency',
      prop: 'frequency',
    },
  ],
};

const defaultSwitch = {
  name: 'Switch',
  icon: switchImage,
  type: 'Switch',
  options: [
    {
      component: 'SwitchOptions',
      value: {
        activeInputWireId: null,
        activeOutputWireId: null,
      },
    },
  ],
};

const defaultHero = {
  name: 'Hero',
  icon: heroImage,
  type: 'Hero',
  options: [
    {
      component: 'HeroOptions',
      value: {
        steps: [
          {
            targetBoardObjectId: null,
            action: null,
            id: generateRandomId(),
          }
        ]
      }

    },
  ],
};

export {
  defaultWavFile,
  defaultAmp,
  defaultMidi,
  defaultOscillator,
  defaultSwitch,
  defaultHero,
};
