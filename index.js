'use strict';
const $ = require('jquery');
const ipc = require("electron").ipcRenderer;

$(() => {
  ipc.on('tweet', (ev, data) => {
    let tweet = JSON.parse(data);
    console.log(tweet.text);

    let $li = $('<li>' + tweet.text + '</li>');
    $('#main').append($li);
  });
});
