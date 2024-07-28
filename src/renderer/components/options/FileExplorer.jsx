import React, { useState } from 'react';

const FileExplorer = ({ onFileSelect, initialFileName }) => {
  // State to hold the displayed filename
  const [fileName, setFileName] = useState(initialFileName || 'Select File');

  const handleOpenFileDialog = async () => {
    try {
      // Invoke the main process to open the file dialog and capture the selected file path
      const filePath =
        await window.electron.ipcRenderer.invoke('open-file-dialog');
      if (filePath) {
        // Extract and set the filename from the path to display
        setFileName(filePath.split(/[/\\]/).pop()); // This will handle both forward and backward slashes
        onFileSelect(filePath); // Pass the full path back to the parent component
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
      {fileName}
    </div>
  );
};

export default FileExplorer;
