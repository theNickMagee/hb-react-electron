// const fs = require('fs');
// const path = require('path');
// const { AudioContext } = require('web-audio-api');

function playWavFile(filePath) {
  // play the wav file
}

function handleNoOutputWires() {
  this.playWavFile();
}


const saveWavFile = (wavData, filePath) => {
  const { sampleRate, numChannels, bitsPerSample, audioData } = wavData;

  if (!audioData || !audioData.length) {
    console.error('Audio data is undefined or empty');
    return;
  }

  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = audioData.length * (bitsPerSample / 8);

  const wavBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(wavBuffer);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF'); // ChunkID
  view.setUint32(4, 36 + dataSize, true); // ChunkSize
  writeString(view, 8, 'WAVE'); // Format

  // fmt sub-chunk
  writeString(view, 12, 'fmt '); // Subchunk1ID
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bitsPerSample, true); // BitsPerSample

  // data sub-chunk
  writeString(view, 36, 'data'); // Subchunk2ID
  view.setUint32(40, dataSize, true); // Subchunk2Size

  // Write the PCM data
  for (let i = 0; i < audioData.length; i++) {
    view.setInt16(44 + i * 2, audioData[i], true);
  }

  // Convert the ArrayBuffer to a Blob
  const blob = new Blob([view], { type: 'audio/wav' });

  // Save the Blob as a file
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filePath;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log(`WAV file saved as ${filePath}`);
};

// Helper function to write ASCII strings to DataView
const writeString = (view, offset, string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};


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

const playWavData = (wavData) => {
  console.log('Playing wavData:', wavData);

  // Ensure audioData is resolved if it's a Promise
  const audioData = wavData.audioData;

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

const loadWavData = async (boardObjectOptions) => {
  // Look through the options to find the fileExplorer option
  let fileData;
  for (const option of boardObjectOptions) {
    if (option.component === 'FileExplorer') {
      fileData = option.fileData;
    }
  }

  console.log('fileData: ', fileData);

  const audioData = await convertFileDataToAudioData(fileData);

  console.log('audioData: ', audioData);

  // Create the wavData object with all necessary properties
  const wavData = {
    sampleRate: 44100,
    numChannels: 2,
    bitsPerSample: 16,
    audioData: audioData,
  };

  // Save as wav file
  saveWavFile(wavData, 'test.wav');

  // Return the wavData object
  return wavData;
};


// Helper function to create initial WAV data object
const convertFileDataToAudioData = async (fileDataPromise) => {
  try {
    const fileData = await fileDataPromise; // Wait for the promise to resolve

    if (fileData instanceof Uint8Array) {
      const properLength = fileData.byteLength - (fileData.byteLength % 2);

      if (properLength > 0 && fileData.byteOffset % 2 === 0) {
        const audioData = new Int16Array(
          fileData.buffer,
          fileData.byteOffset,
          properLength / 2,
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
