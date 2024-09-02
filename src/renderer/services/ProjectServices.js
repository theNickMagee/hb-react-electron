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
        console.error('Failed to save project:', result.error);
    }
};

export {
    createDefaultProject,
    saveProject,
};