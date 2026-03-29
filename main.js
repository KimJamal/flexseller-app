const { app, BrowserWindow, ipcMain, nativeImage, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

// Disable GPU acceleration early to prevent crashes on some systems
app.disableHardwareAcceleration();

// CRITICAL for Windows taskbar - must match appId in package.json
app.setAppUserModelId("com.flexseller.app");

// Get the correct icon path (dev vs production)
function getIconPath() {
  // Try multiple locations for the icon
  const possiblePaths = [
    // Assets folder (for dev and production)
    path.join(__dirname, 'assets', 'FlexSellerIcoP.ico'),
    // Root folder fallback
    path.join(__dirname, 'FlexSellerIcoP.ico'),
    // Fallback to generic icon.ico if needed
    path.join(__dirname, 'assets', 'icon.ico'),
  ];
  
  for (const iconPath of possiblePaths) {
    if (fs.existsSync(iconPath)) {
      return iconPath;
    }
  }
  return null;
}

function createWindow () {
  const iconPath = getIconPath();
  
  const windowOptions = {
    width: 1280,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,              // Allow API calls
      allowRunningInsecureContent: true 
    },
    backgroundColor: '#f5f6f7',
    show: false
  };
  
  // Set icon if found
  if (iconPath) {
    try {
      windowOptions.icon = nativeImage.createFromPath(iconPath);
    } catch (e) {
      console.log('Failed to load icon:', e);
    }
  }
  
  const win = new BrowserWindow(windowOptions);

  win.loadFile('FlexSeller.html');
  
  // ✅ Force set taskbar icon after window is shown (Windows fix)
  win.once('ready-to-show', () => {
    win.show();
    win.setMenuBarVisibility(false);
    
    // Set overlay icon for taskbar consistency
    if (process.platform === 'win32' && iconPath) {
      try {
        const overlayIcon = nativeImage.createFromPath(iconPath);
        win.setOverlayIcon(overlayIcon, 'FlexSeller');
      } catch (e) {
        // Overlay icon is optional, ignore errors
      }
    }
  });

  ipcMain.on('window-minimize', () => win.minimize());
  ipcMain.on('window-maximize', () => {
    win.isMaximized() ? win.unmaximize() : win.maximize();
  });
  ipcMain.on('window-close', () => win.close());
  ipcMain.on('titlebar-doubleclick', () => {
    win.isMaximized() ? win.unmaximize() : win.maximize();
  });

  // --- AUTO-UPDATER LOGIC ---
  autoUpdater.on('checking-for-update', () => {
    win.webContents.send('update-status', 'Checking for updates...');
  });

  autoUpdater.on('update-available', (info) => {
    win.webContents.send('update-status', `Update v${info.version} available. Downloading...`);
  });

  autoUpdater.on('update-not-available', () => {
    win.webContents.send('update-status', 'App is up to date.');
  });

  autoUpdater.on('download-progress', (progressObj) => {
    win.webContents.send('update-status', `Downloading: ${Math.round(progressObj.percent)}%`);
  });

  autoUpdater.on('update-downloaded', (info) => {
    win.webContents.send('update-status', 'Update downloaded.');
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: `A new version (${info.version}) has been downloaded. Restart the app to apply the update?`,
      buttons: ['Restart Now', 'Later']
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  autoUpdater.on('error', (err) => {
    win.webContents.send('update-status', 'Update error.');
    console.error('Error in auto-updater: ', err);
  });

  // Check for updates after the window is ready
  win.once('ready-to-show', () => {
    if (!app.isPackaged) {
      console.log('Skipping update check in development mode.');
    } else {
      autoUpdater.checkForUpdatesAndNotify();
    }
  });

  // Allow manual check from UI
  ipcMain.on('check-for-updates', () => {
    if (app.isPackaged) {
      autoUpdater.checkForUpdatesAndNotify();
    } else {
      win.webContents.send('update-status', 'Update check skipped (Dev Mode)');
    }
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
