'use strict';
const electron = require('electron');
const app = electron.app;
const Twitter = require('./main/twitter-event');
const ipcMain = require('electron').ipcMain;
const download = require('./main/tweet-action').download;
const AuthWin = require('./main/auth');

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
    alwaysOnTop: true
  });

  win.loadURL(`file://${__dirname}/renderer/index.html`);
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
  const authWin = new AuthWin();
  authWin.authorize().then(token => {
    console.log(token);
    mainWindow = createMainWindow();

    const twitter = new Twitter(token);

    twitter.getList().then(tweets => {
      for (const tweet of tweets) {
        mainWindow.webContents.send('tweet', JSON.stringify(tweet));
      }
    });

    const stream = twitter.stream();
    stream.on('tweet', tweet => {
      console.log(tweet);
      mainWindow.webContents.send('tweet', JSON.stringify(tweet));
    });

    ipcMain.on('download', (ev, mediaUrl) => {
      download(mediaUrl);
    });
  }).catch(e => console.log(e));
});

