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

const addProjectToBoard = async (projectFile, sessionData, setSessionData, setData, originRow, originCol) => {
    console.log('project file: ', projectFile);
    try {
        const projectData = await window.electron.ipcRenderer.invoke(
            'read-project-file',
            `${sessionData.projectDrawerPath}/${projectFile}`,
        );

        console.log('project data: ', projectData);
        if (projectData) {
            const offsetBoardObjects = projectData.boardObjects.map(obj => ({
                ...obj,
                row: obj.row + originRow,
                col: obj.col + originCol,
            }));

            setSessionData((prevSessionData) => ({
                ...prevSessionData,
                activeBoardObject: offsetBoardObjects,
                activeBoardObjectIndex: offsetBoardObjects.length - 1,
                isDroppingProject: false, // Stop dropping project
            }));
            setData((prevData) => ({
                ...prevData,
                boardObjects: [...prevData.boardObjects, ...offsetBoardObjects],
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