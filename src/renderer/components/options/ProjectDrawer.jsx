import React, { useEffect, useState } from 'react';

const ProjectDrawer = ({ sessionData, setSessionData }) => {
  const [projects, setProjects] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadProjects = async () => {
    if (sessionData.projectDrawerPath) {
      const files = await window.electron.ipcRenderer.invoke(
        'read-saved-projects',
        sessionData.projectDrawerPath,
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

  return (
    <div className="project-drawer">
      <div className="default-button" onClick={toggleDrawer}>
        {drawerOpen ? 'Close' : 'Open'} Project Drawer
      </div>
      {drawerOpen &&
        projects.map((project, index) => (
          <div key={index} className="project-item">
            {project}
          </div>
        ))}
    </div>
  );
};

export default ProjectDrawer;
