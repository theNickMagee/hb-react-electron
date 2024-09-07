import React, { useEffect, useState } from 'react';
import { addProjectToBoard } from '../../services/ProjectServices';

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
              onClick={() =>
                addProjectToBoard(project, sessionData, setSessionData, setData)
              }
            >
              {project.replace('.hb', '')}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectDrawer;
