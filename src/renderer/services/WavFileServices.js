// const fs = require('fs');
// const path = require('path');
// const { AudioContext } = require('web-audio-api');

function playWavFile(filePath) {
  // play the wav file
}

function handleNoOutputWires() {
  this.playWavFile();
}

const createInitialWavData = () => {
  // sampleRate: 44100, // Sample rate in Hz
  // numChannels: 2, // Number of audio channels
  // bitsPerSample: 16, // Bit depth
  // audioData: new Int16Array([
  //   /* raw audio sample data */
  // ]),

  const initialWavData = {
    sampleRate: 44100,
    numChannels: 2,
    bitsPerSample: 16,
    audioData: new Int16Array([]),
  };

  return initialWavData;
};

const handleWavData = (boardObjectOptions, wavData) => {
  // load file, and return wavData
};

const playWavData = async (wavData) => {
  console.log('Playing wavData:', wavData);

  // Ensure audioData is resolved if it's a Promise
  const audioData = await wavData.audioData;

  // Debugging: Check the length of audioData
  console.log('Audio data length:', audioData.length);

  if (audioData.length === 0) {
    console.error('Audio data is empty');
    return;
  }

  // Create an AudioContext
  const audioContext = new AudioContext();

  // Calculate the number of samples per channel
  const numSamplesPerChannel = audioData.length / wavData.numChannels;

  // Debugging: Check number of samples per channel
  console.log('Number of samples per channel:', numSamplesPerChannel);

  // Create an audio buffer
  const audioBuffer = audioContext.createBuffer(
    wavData.numChannels,
    numSamplesPerChannel,
    wavData.sampleRate,
  );

  // Assuming the data is interleaved for stereo
  for (let channel = 0; channel < wavData.numChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (
      let i = 0, j = channel;
      j < audioData.length;
      i++, j += wavData.numChannels
    ) {
      channelData[i] = audioData[j] / 32768.0; // Convert Int16 to Float32
    }
  }

  // Create a source node
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();

  console.log('Playback started');
};

const loadWavData = (boardObjectOptions) => {
  // Look through the options to find the fileExplorer option
  let fileData;
  for (const option of boardObjectOptions) {
    if (option.component === 'FileExplorer') {
      fileData = option.fileData;
    }
  }

  console.log('fileData: ', fileData);

  // Convert fileData (Uint8Array) to the desired object
  return {
    sampleRate: 44100,
    numChannels: 2,
    bitsPerSample: 16,
    audioData: convertFileDataToAudioData(fileData),
  };
};

// Helper function to create initial WAV data object
const convertFileDataToAudioData = async (fileDataPromise) => {
  try {
    const fileData = await fileDataPromise; // Wait for the promise to resolve
    console.log('Received file data with byte length:', fileData.byteLength);

    if (fileData instanceof Uint8Array) {
      const properLength = fileData.byteLength - (fileData.byteLength % 2);
      console.log('Proper length for Int16Array:', properLength);

      if (properLength > 0 && fileData.byteOffset % 2 === 0) {
        const audioData = new Int16Array(
          fileData.buffer,
          fileData.byteOffset,
          properLength / 2,
        );
        console.log(
          'Successfully created Int16Array with length:',
          audioData.length,
        );
        return audioData;
      } else {
        console.error(
          'Invalid byteOffset or length for conversion to Int16Array.',
        );
      }
    } else {
      console.error('Invalid file data type. Expected Uint8Array.');
    }
  } catch (error) {
    console.error('Error processing file data:', error);
  }

  return new Int16Array(); // Return an empty Int16Array if there is an issue
};

export {
  playWavFile,
  handleNoOutputWires,
  createInitialWavData,
  handleWavData,
  loadWavData,
  playWavData,
};
