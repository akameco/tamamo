'use strict';
const electron = require('electron');
const TwitterAPI = require('node-twitter-api');
const config = require('../../config.json');
const writeToken = require('./config-manager').writeToken;

class Auth {
  constructor() {
  }

  authorize() {
    return new Promise((resolve, reject) => {
      const twitter = new TwitterAPI({
        consumerKey: config.auth.consumerKey,
        consumerSecret: config.auth.consumerSecret,
        callback: 'http://example.com'
      });

      twitter.getRequestToken((error, requestToken, requestTokenSecret) => {
        if (error) {
          console.log(error);
          process.exit(0);
        }

        const url = twitter.getAuthUrl(requestToken);
        const win = new electron.BrowserWindow({
          width: 800,
          height: 600
        });

        win.webContents.on('will-navigate', (ev, url) => {
          const matched = url.match(/\?oauth_token=([^&]*)&oauth_verifier=([^&]*)/);

          if (matched) {
            twitter.getAccessToken(requestToken, requestTokenSecret, matched[2], (err, accessToken, accessTokenSecret) => {
              if (err) {
                reject(err);
              }

              const token = {accessToken, accessTokenSecret};

              writeToken(token);
              resolve(token);
            });
          }

          ev.preventDefault();

          setTimeout(() => {
            win.close();
          }, 0);
        });

        win.loadURL(url);
      });
    });
  }
}

module.exports = Auth;
