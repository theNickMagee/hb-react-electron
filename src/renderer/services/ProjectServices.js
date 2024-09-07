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

const addProjectToBoard = async (projectFile, sessionData, setSessionData, setData) => {
    console.log('project file: ', projectFile);
    try {
        const projectData = await window.electron.ipcRenderer.invoke(
            'read-project-file',
            `${sessionData.projectDrawerPath}/${projectFile}`,
        );

        console.log('project data: ', projectData);
        if (projectData) {
            setSessionData((prevSessionData) => ({
                ...prevSessionData,
                activeBoardObject: projectData.boardObjects,
                activeBoardObjectIndex: projectData.boardObjects.length - 1,
            }));
            setData((prevData) => ({
                ...prevData,
                boardObjects: [...prevData.boardObjects, ...projectData.boardObjects],
                wires: [...prevData.wires, ...projectData.wires],
            }));
        }
    } catch (error) {
        console.error('Failed to add project to board:', error);
    }
};

export {
    createDefaultProject,
    saveProject,
    addProjectToBoard,
};