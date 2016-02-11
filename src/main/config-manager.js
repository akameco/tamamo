'use strict';
const fs = require('fs');
const path = require('path');

const writeToken = token => {
  console.log('will', token);
  const target = path.resolve(__dirname, '../../res/token.json');
  fs.writeFile(target, JSON.stringify(token, null, 2), err => {
    if (err) {
      console.log(err);
    }

    console.log('saved token.');
  });
};

module.exports.writeToken = writeToken;
