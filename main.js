'use strict';
const electron = require('electron');
const app = electron.app;
const Twitter = require('twit');
const config = require('./config.json');

require('electron-debug')({
  showDevTools: true
});

let mainWindow;

const twitterConfig = {
  consumer_key: config.auth.consumerKey,
  consumer_secret: config.auth.consumerSecret,
  access_token: config.auth.accessToken,
  access_token_secret: config.auth.accessTokenSecret
};

const T = new Twitter(twitterConfig);

function users(listId) {
  return new Promise(resolve => {
    T.get('lists/members', {list_id: listId, count: 5000}, (err, data) => {
      if (err) {
        console.log(err);
      }
      const userIds = data.users.map(user => {
        return user.id
      });
      resolve(userIds);
    });
  });
}

const listId = config.listId;

function onClosed() {
  mainWindow = null;
}

function createMainWindow() {
  const win = new electron.BrowserWindow({
    width: 900,
    height: 600
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

  const T = new Twitter(twitterConfig);
  const listId = config.listId;
  users(listId).then(userIds => {
    const userStream = T.stream('statuses/filter', {follow: userIds.join()})
    userStream.on('tweet', tweet => {
      if (userIds.indexOf(tweet.user.id) !== -1) {
        // 画像が含まれている場合
        // if (tweet.extended_entities) {
        console.log(tweet.user.name, tweet.text);
        mainWindow.webContents.send('tweet', tweet);
        // }
      }
    });
  });
});

