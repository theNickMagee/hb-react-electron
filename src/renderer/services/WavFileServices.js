// const fs = require('fs');
// const path = require('path');
// const { AudioContext } = require('web-audio-api');

import { applyEffectOnWavData } from '../controllers/CircuitController';

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
  // saveWavFile(wavData, 'test.wav');

  // Return the wavData object
  return wavData;
};
const convertFileDataToAudioData = async (fileDataPromise) => {
  try {
    const fileData = await fileDataPromise;

    if (!(fileData instanceof Uint8Array)) {
      console.error('Invalid file data type. Expected Uint8Array.');
      return new Int16Array();
    }

    let offset = 12; // Start right after the RIFF header
    let fmtChunkFound = false;
    let dataChunkFound = false;
    let audioFormat, numChannels, sampleRate, bitsPerSample, dataSize;
    let audioData;

    while (offset < fileData.byteLength) {
      const chunkId = getString(new DataView(fileData.buffer, offset, 4), 0, 4);
      const chunkSize = new DataView(fileData.buffer, offset + 4, 4).getUint32(
        0,
        true,
      );

      if (chunkId === 'fmt ') {
        fmtChunkFound = true;
        const fmtChunk = new DataView(fileData.buffer, offset + 8, chunkSize);
        audioFormat = fmtChunk.getUint16(0, true);
        numChannels = fmtChunk.getUint16(2, true);
        sampleRate = fmtChunk.getUint32(4, true);
        bitsPerSample = fmtChunk.getUint16(14, true);

        console.log(
          `Found fmt chunk: Format ${audioFormat}, Channels ${numChannels}, Sample Rate ${sampleRate}, Bits Per Sample ${bitsPerSample}`,
        );
      } else if (chunkId === 'data') {
        dataChunkFound = true;
        dataSize = chunkSize;

        // Handle based on format and bit depth
        if (audioFormat === 1) {
          // PCM
          if (bitsPerSample === 16) {
            audioData = new Int16Array(
              fileData.buffer,
              offset + 8,
              dataSize / 2,
            );
          } else if (bitsPerSample === 24) {
            audioData = convert24BitTo16Bit(
              new DataView(fileData.buffer, offset + 8, dataSize),
              numChannels,
            );
          } else {
            console.error('Unsupported bit depth for PCM.');
            return new Int16Array();
          }
        } else if (audioFormat === 3 && bitsPerSample === 32) {
          // 32-bit float PCM
          audioData = convert32BitFloatTo16Bit(
            new DataView(fileData.buffer, offset + 8, dataSize),
            numChannels,
          );
        } else {
          console.error('Unsupported WAV format or bit depth.');
          return new Int16Array();
        }

        console.log(`Found data chunk with size ${dataSize}`);
        break; // No need to continue once we've found the data chunk
      }

      offset += 8 + chunkSize; // Move to the next chunk
    }

    if (!fmtChunkFound || !dataChunkFound) {
      console.error(
        'Unable to find required fmt or data chunks in the WAV file.',
      );
      return new Int16Array();
    }

    console.log(
      `Loaded WAV file with ${numChannels} channels, ${sampleRate} Hz, ${bitsPerSample} bits per sample.`,
    );
    return audioData;
  } catch (error) {
    console.error('Error processing file data:', error);
    return new Int16Array();
  }
};

// Conversion for 24-bit PCM to 16-bit PCM
const convert24BitTo16Bit = (dataView, numChannels) => {
  const length = dataView.byteLength / 3;
  const output = new Int16Array(length);

  for (let i = 0; i < length; i++) {
    const byteOffset = i * 3;
    const sample24 =
      (dataView.getUint8(byteOffset + 2) << 16) |
      (dataView.getUint8(byteOffset + 1) << 8) |
      dataView.getUint8(byteOffset);

    const sample16 = (sample24 >> 8) & 0xffff; // Scale down to 16 bits
    output[i] = sample16 - (sample16 & 0x8000 ? 0x10000 : 0); // Convert to signed 16-bit
  }

  return output;
};

// Conversion for 32-bit float PCM to 16-bit PCM
const convert32BitFloatTo16Bit = (dataView, numChannels) => {
  const length = dataView.byteLength / 4;
  const output = new Int16Array(length);

  for (let i = 0; i < length; i++) {
    const sample32 = dataView.getFloat32(i * 4, true);
    // Convert 32-bit float to 16-bit PCM by clamping the values between -1.0 and 1.0 and scaling
    const sample16 = Math.max(-1, Math.min(1, sample32)) * 32767;
    output[i] = sample16 | 0; // Bitwise OR with 0 to convert to integer
  }

  return output;
};

// Helper function to extract strings from DataView
const getString = (dataView, offset, length) => {
  let str = '';
  for (let i = 0; i < length; i++) {
    str += String.fromCharCode(dataView.getUint8(offset + i));
  }
  return str;
};

const renderPath = async (path) => {
  let wavData = createInitialWavData();
  for (let j = 0; j < path.length; j++) {
    const boardObject = path[j];
    const newWavData = await applyEffectOnWavData(boardObject, wavData);

    // if we are at the end fo the path, play the wavData
    wavData = newWavData;
  }

  return wavData;
};

const cutWavData = (wavData, startTime, endTime) => {
  const { sampleRate, numChannels, bitsPerSample, audioData } = wavData;

  const startSample = Math.floor(startTime * sampleRate);
  const endSample = Math.floor(endTime * sampleRate);

  if (startSample >= audioData.length || endSample <= startSample) {
    console.error('Invalid start or end time for cutting wavData');
    return wavData;
  }

  const newAudioData = audioData.slice(startSample, endSample);

  return {
    sampleRate,
    numChannels,
    bitsPerSample,
    audioData: newAudioData,
  };
};

const placeWavData = (masterWavData, startTime, newWavData) => {}

export {
  playWavFile,
  handleNoOutputWires,
  createInitialWavData,
  handleWavData,
  loadWavData,
  playWavData,
  renderPath,
  placeWavData,
  cutWavData,
};
