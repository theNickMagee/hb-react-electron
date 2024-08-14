const processOscillator = (options, wavData) => {
  let freq;
  let waveform;
  for (const option of options) {
    if (option.label === 'Frequency') {
      freq = option.value;
    }
    if (option.label === 'Waveform') {
      // set the waveform
      waveform = option.value;
    }
  }

  console.log('processOscillator: ', freq, waveform);

  let audioData;

  audioData = createOscillatorAudioData(freq, waveform, 10, wavData);

  let newWavData = {
    ...wavData,
    audioData: audioData,
  };

  return newWavData;
};

export { processOscillator };

function createOscillatorAudioData(freq, waveform, duration) {
  const sampleRate = 44100; // Standard sample rate for audio
  const numSamples = Math.floor(sampleRate * duration);
  const audioData = new Int16Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    let t = i / sampleRate;
    let value;

    switch (waveform) {
      case 'sine':
        value = Math.sin(2 * Math.PI * freq * t);
        break;
      case 'square':
        value = Math.sign(Math.sin(2 * Math.PI * freq * t));
        break;
      case 'sawtooth':
        value = 2 * (t * freq - Math.floor(t * freq + 0.5));
        break;
      case 'triangle':
        value = 2 * Math.abs(2 * (t * freq - Math.floor(t * freq + 0.5))) - 1;
        break;
      default:
        throw new Error('Unsupported waveform type');
    }

    audioData[i] = Math.floor(value * 32767); // Scale to Int16 range
  }

  return audioData;
}
