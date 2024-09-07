const createDefaultProject = () => {
    return {
        name: 'Default Project',
        boardObjects: [],
        wires: [],
    };
};

const saveProject = async (data) => {
    const result = await window.electron.ipcRenderer.invoke('save-project', data);
    if (result.success) {
        console.log(`Project saved to ${result.filePath}`);
    } else {
        if (result.error === 'No file path selected') {
            console.warn('Save operation was canceled by the user.');
        } else {
            console.error('Failed to save project:', result.error);
        }
    }
};

export {
    createDefaultProject,
    saveProject,
};