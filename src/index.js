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
    this.state = ({
      media_url: 'https://pbs.twimg.com/media/CZbb4ITUAAI3rUk.jpg',
      text: 'ようこそ',
      screen_name: 'akameco',
      hovered: false
    });

    ipc.on('tweet', (ev, data) => {
      const tweet = JSON.parse(data);

      if (tweet.extended_entities) {
        for (const image of tweet.extended_entities.media) {
          console.log(image);
          this.setState({
            screen_name: tweet.user.screen_name,
            text: tweet.text,
            media_url: image.media_url
          });
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

  handleClick(e) {
    const url = this.state.media_url;
    console.log(url);
    ipc.send('download', url);
  }

  render() {
    return (
      <div onMouseOver={this.handleMouseOver.bind(this)}
       onMouseOut={this.handleMouseOut.bind(this)} >
        <Tweet data={this.state} />
        <Controlbox onClick={this.handleClick.bind(this)} />
      </div>
    );
  }
}

render(<TweetBox />, document.querySelector('#main'));
