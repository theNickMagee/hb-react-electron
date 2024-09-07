import React, { useEffect, useState } from 'react';

const ProjectDrawer = ({ sessionData, setSessionData, setData, data }) => {
  const [projects, setProjects] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadProjects = async () => {
    let projectDrawerPath = sessionData.projectDrawerPath;
    console.log('initial load projects sessionData: ', sessionData);
    if (!projectDrawerPath) {
      projectDrawerPath = localStorage.getItem('projectDrawerPath');
      console.log(
        'got project drawer path from localStorage: ',
        projectDrawerPath,
      );
      if (projectDrawerPath) {
        setSessionData({
          ...sessionData,
          projectDrawerPath,
        });
      }
    }

    if (projectDrawerPath) {
      const files = await window.electron.ipcRenderer.invoke(
        'read-saved-projects',
        projectDrawerPath,
      );
      setProjects(files);
    }
  };

  useEffect(() => {
    if (drawerOpen) {
      loadProjects();
    }
  }, [drawerOpen, sessionData.projectDrawerPath]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const addProjectToBoard = async (projectFile) => {
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

  useEffect(() => {
    if (!sessionData.projectDrawerPath) {
      const projectDrawerPath = localStorage.getItem('projectDrawerPath');
      if (projectDrawerPath) {
        setSessionData({
          ...sessionData,
          projectDrawerPath,
        });
      }
    }
  }, []);

  return (
    <div className="project-section">
      <div className="default-button" onClick={toggleDrawer}>
        {drawerOpen ? 'Close' : 'Open'} Project Drawer
      </div>
      <div className="project-drawer">
        {drawerOpen &&
          projects.map((project, index) => (
            <div
              key={index}
              className="default-button project-item"
              onClick={() => addProjectToBoard(project)}
            >
              {project.replace('.hb', '')}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectDrawer;
