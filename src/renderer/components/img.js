import React from 'react';

export default class Img extends React.Component {
  render() {
    const media_url = this.props.media_url;
    return (
      <img src={media_url}/>
    );
  }
}
