'use strict';
const config = require('../../config.json');

module.exports = (tweet) => {
  // 画像の含んでないツイートを除く
  if (!tweet.extended_entities) {
    return false;
  }

  for (let word of config.ignoreWords) {
    if (tweet.text.indexOf(word) !== -1) {
      console.log(tweet.text);
      return false;
    }
  }
  return true;
}
