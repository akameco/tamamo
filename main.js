'use strict';
const electron = require('electron');
const app = electron.app;
const Twitter = require('./src/main/twitter-event');
const config = require('./config.json');
const ipcMain = require('electron').ipcMain;
const fs = require('fs');
const request = require('request');
const path = require('path');

require('electron-debug')({
  showDevTools: true
});

let mainWindow;

function onClosed() {
  mainWindow = null;
}

function createMainWindow() {
  const electronScreen = electron.screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  const win = new electron.BrowserWindow({
    width: 400,
    height: 500,
    x: size.width - 400,
    y: size.height - 500,
    resizable: false,
    alwaysOnTop: true
  });

  win.loadURL(`file://${__dirname}/index.html`);
  win.on('closed', onClosed);

  return win;
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', () => {
  mainWindow = createMainWindow();

  const stream = new Twitter(config).stream();
  stream.on('tweet', tweet => {
    console.log(tweet);
    mainWindow.webContents.send('tweet', JSON.stringify(tweet));
  });

  ipcMain.on('download', (ev, media_url) => {
    const fileName = path.basename(media_url);
    request({method: 'GET', url: media_url, encoding: null}, (err, res, body) => {
      if (err && res.statusCode !== 200) {
        console.log(err);
      }

      const homeDir = process.env.HOME;
      const savePath = path.resolve(homeDir, config.downloadPath, fileName);

      fs.writeFile(savePath, body, 'binary', err => {
        if (err) {
          console.log(err);
        }

        console.log(`saved: ${savePath}`);
      });
    });
  });
});

