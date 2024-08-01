const applyAmp = (options, wavData) => {
  let value;
  for (const option of options) {
    if (option.component === 'slider') {
      value = option.value;
    }
  }

  const newWavData = adjustVolumeBasedOnScale(wavData, value, 0, 100);

  console.log('value: ', value);
  return newWavData;
};

const adjustVolumeBasedOnScale = (wavData, value, min, max) => {
  // Destructure the wavData object to get the necessary properties
  const { sampleRate, numChannels, bitsPerSample, audioData } = wavData;

  console.log('sanity check: ', audioData);

  return {
    sampleRate,
    numChannels,
    bitsPerSample,
    audioData: audioData.map((sample) => {
      return sample * (value / 100);
    }),
  };
};

export { applyAmp };
