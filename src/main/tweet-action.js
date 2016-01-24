'use strict';
const request = require('request');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');

module.exports.download = mediaUrl => {
  const fileName = path.basename(mediaUrl);
  request({method: 'GET', url: mediaUrl, encoding: null}, (err, res, body) => {
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
}
