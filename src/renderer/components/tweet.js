import React from 'react';

export default class Tweet extends React.Component {
  render() {
    const {screen_name, text, media_url, hovered} = this.props.data;
    const display = this.props.hovered ? 'block' : 'none';
    const divStyle = {display: display};

    return (
      <div>
        <img src={media_url} />
        <div className='tweet' style={divStyle}>
          <p className='tweet__screen_name'>@{screen_name}</p>
          <p className='tweet__text'>{text}</p>
        </div>
      </div>
    );
  }
}
