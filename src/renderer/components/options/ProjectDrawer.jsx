import { defaultMidi } from '../../defaults/BoardObjectDefaults';

import React, { useState } from 'react';

const ProjectDrawer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <div className="default-button" onClick={toggleDrawer}>
        {drawerOpen ? 'Close' : 'Open'} Project Drawer
      </div>
      {/* if open */}
    </>
  );
};

export default ProjectDrawer;
