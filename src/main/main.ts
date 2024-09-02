/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
const fs = require('fs').promises; // Import the promise version of the fs module

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.handle('open-file-dialog', async (event) => {
    if (!mainWindow) {
      console.error('Main window is not available.');
      return;
    }
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'Audio', extensions: ['wav', 'mp3', 'ogg'] }],
    });
    return filePaths[0]; // Return the path of the first selected file
  });

  ipcMain.handle('read-file', async (event, filePath) => {
    try {
      const data = await fs.readFile(filePath);
      if (data.byteLength % 2 !== 0) {
        console.error('Data is misaligned for Int16Array');
        return new Uint8Array(); // Return an empty Uint8Array in case of misalignment
      }
      return data; // Return the file data to the renderer process
    } catch (error) {
      console.error('Failed to read file:', error);
      return new Uint8Array(); // Return empty Uint8Array or handle the error as needed
    }
  });

  ipcMain.handle('save-project', async (event, projectData) => {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save Project',
      defaultPath: 'project.hb',
      filters: [{ name: 'Hero Beats Project', extensions: ['hb'] }],
    });

    if (filePath) {
      try {
        await fs.writeFile(filePath, JSON.stringify(projectData, null, 2));
        return { success: true, filePath };
      } catch (error) {
        console.error('Failed to save project:', error);
        return { success: false, error };
      }
    }
    return { success: false, error: 'No file path selected' };
  });

  ipcMain.handle('read-saved-projects', async (event, folderPath) => {
    try {
      const files = await fs.readdir(folderPath);
      return files.filter((file) => file.endsWith('.hb'));
    } catch (error) {
      console.error('Failed to read saved projects directory:', error);
      return [];
    }
  });

  ipcMain.handle('set-project-drawer', async () => {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });
    if (filePaths && filePaths.length > 0) {
      return filePaths[0]; // Return the selected folder path
    }
    return null; // No folder selected
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    const savedProjectsDir = path.join(
      app.getPath('userData'),
      'savedProjects',
    );
    try {
      await fs.mkdir(savedProjectsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create saved projects directory:', error);
    }
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
