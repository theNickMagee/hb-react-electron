import React, { useState } from 'react';

const FileExplorer = ({ index, onFileSelect, initialFileName }) => {
  // State to hold the displayed filename
  const [fileName, setFileName] = useState(initialFileName || 'Select File');

  const loadFileData = async (filePath) => {
    try {
      // Use the new IPC channel to read the file data
      const fileData = await window.electron.ipcRenderer.invoke(
        'read-file',
        filePath,
      );
      return fileData; // Return the loaded file data
    } catch (error) {
      console.error('Failed to load file data:', error);
      return ''; // Return empty string or handle the error as needed
    }
  };
  const handleOpenFileDialog = async () => {
    try {
      // Invoke the main process to open the file dialog and capture the selected file path
      const filePath =
        await window.electron.ipcRenderer.invoke('open-file-dialog');
      if (filePath) {
        // Extract and set the filename from the path to display
        setFileName(filePath.split(/[/\\]/).pop()); // This will handle both forward and backward slashes
        // loadFileData
        const fileData = loadFileData(filePath);
        onFileSelect(index, filePath, fileData);
      }
    } catch (error) {
      console.error('Failed to select file:', error);
    }
  };

  return (
    <div
      className="default-button small-font text-wrap-button"
      onClick={handleOpenFileDialog}
    >
      {/* display filename after last \ */}
      {fileName?.split(/[/\\]/).pop()}
    </div>
  );
};

export default FileExplorer;
