'use strict';
import React from 'react';
import {render} from 'react-dom';
import Tweet from './renderer/components/tweet';
import Controlbox from './renderer/components/controlbox';
const ipc = require('electron').ipcRenderer;
const webFrame = require('web-frame');
webFrame.setZoomLevelLimits(1, 1);

class TweetBox extends React.Component {
  constructor(props) {
    super(props);
    let data = [];
    data.push({
      media_url: 'https://pbs.twimg.com/media/CZbb4ITUAAI3rUk.jpg',
      text: 'ようこそ',
      screen_name: 'akameco'
    });

    data.push({
      media_url: 'https://pbs.twimg.com/media/CZHaKiKUMAA7k-V.png',
      text: '萌画像',
      screen_name: 'akameco'
    });

    this.state = ({
      data: data,
      current: 0,
      hovered: false
    });

    ipc.on('tweet', (ev, data) => {
      const tweet = JSON.parse(data);

      if (tweet.extended_entities) {
        for (const image of tweet.extended_entities.media) {
          console.log(image);
          const obj = {
            screen_name: tweet.user.screen_name,
            text: tweet.text,
            media_url: image.media_url
          };
          this.setState({data: this.state.data.concat([obj])});
          this.setState({current: this.state.data.length - 1});
        }
      }
    });
  }

  handleMouseOver() {
    this.setState({hovered: true});
  }

  handleMouseOut () {
    this.setState({hovered: false});
  }

  handleDownloadClick(e) {
    ipc.send('download', this.state.data[this.state.current].media_url);
    console.log(this.state.data);
  }

  handlePrev(e) {
    if (this.state.current === 0) {
      return null;
    }
    this.setState({current: this.state.current - 1})
    console.log('prev', e);
  }

  handleNext(e) {
    if (this.state.current === this.state.data.length - 1) {
      return null;
    }
    this.setState({current: this.state.current + 1})
    console.log('next', e);
  }

  render() {
    return (
      <div onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)} >
        <Tweet data={this.state.data[this.state.current]} hovered={this.state.hovered} />
        <Controlbox
          onClick={this.handleDownloadClick.bind(this)}
          onPrev={this.handlePrev.bind(this)}
          onNext={this.handleNext.bind(this)} />
      </div>
    );
  }
}

render(<TweetBox />, document.querySelector('#main'));
