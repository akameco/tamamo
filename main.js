'use strict';
const electron = require('electron');
const app = electron.app;
const Twitter = require('./src/main/twitter-event');
const config = require('./config.json');

require('electron-debug')({
  showDevTools: true
});

let mainWindow;

function onClosed() {
  mainWindow = null;
}

function createMainWindow() {
  const win = new electron.BrowserWindow({
    width: 400,
    height: 500
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
});

