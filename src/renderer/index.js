import React, {Component} from 'react';
import {render} from 'react-dom';
import Tweet from './components/tweet';
const ipcRenderer = require('electron').ipcRenderer;
const webFrame = require('web-frame');
webFrame.setZoomLevelLimits(1, 1);

class TweetBox extends Component {
  constructor(props) {
    super(props);

    const data = [];
    data.push({
      media_url: 'https://pbs.twimg.com/media/CbAuXCJVIAAtwn1.jpg',
      text: 'ようこそ',
      screen_name: 'akameco'
    });

    this.state = ({
      data,
      current: 0,
      hovered: false
    });

    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
  }

  componentDidMount() {
    const body = document.querySelector('body');
    body.addEventListener('keydown', this.handleKeyDown);

    ipcRenderer.on('tweet', (ev, data) => {
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
          if (this.state.current === this.state.data.length - 2) {
            this.setState({current: this.state.data.length - 1});
          }
        }
      }
    });
  }

  componentWillUnmount() {
    const body = document.querySelector('body');
    body.removeEventListener('keydown', this.handleKeyDown);
  }

  handleMouseOver() {
    this.setState({hovered: true});
  }

  handleMouseOut() {
    this.setState({hovered: false});
  }

  handleDownloadClick() {
    ipcRenderer.send('download', this.state.data[this.state.current].media_url);
    console.log(this.state.data);
  }

  handlePrev() {
    if (this.state.current === 0) {
      return null;
    }
    this.setState({current: this.state.current - 1});
  }

  handleNext() {
    if (this.state.current === this.state.data.length - 1) {
      return null;
    }
    this.setState({current: this.state.current + 1});
  }

  handleKeyDown(e) {
    if (e.keyCode === 39) {
      this.handlePrev(e);
    } else if (e.keyCode === 37) {
      this.handleNext(e);
    } else if (e.keyCode === 83) {
      this.handleDownloadClick(e);
    }
  }

  render() {
    const display = this.state.hovered ? 'block' : 'none';
    const divStyle = {display};

    return (
      <div onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} >
        <img src={this.state.data[this.state.current].media_url} />
        <div style={divStyle} >
          <Tweet data={this.state.data[this.state.current]} />
          <DownloadButton onDownloadClick={this.handleDownloadClick}/>
        </div>
      </div>
    );
  }
}

class DownloadButton extends Component {
  constructor(props) {
    super(props);
  }

  handleClick(e) {
    this.props.onDownloadClick(e);
  }

  render() {
    return (
      <div>
        <a className='download-btn' onClick={this.handleClick.bind(this)}>
          save
        </a>
      </div>
    );
  }
}

render(<TweetBox />, document.querySelector('.main'));
