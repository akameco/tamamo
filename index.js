'use strict';
const $ = require('jquery');
const ipc = require('electron').ipcRenderer;

$(() => {
  ipc.on('tweet', (ev, data) => {
    const tweet = JSON.parse(data);
    console.log(tweet.text);

    const $li = $(`<li>${ tweet.text }</li>`);
    $('#main').append($li);
  });
});
