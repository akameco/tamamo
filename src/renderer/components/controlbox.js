import React from 'react';
import {RtIcon, HeartIcon, DownloadIcon} from './icon';

export default class Controlbox extends React.Component {
  constructor(props) {
    super(props);
  }

  _onClick(e) {
    this.props.onClick(e);
  }

  render() {
    return (
      <div className='controlbox'>
        <HeartIcon />
        <div onClick={this._onClick.bind(this)} className='donwload'>
          <DownloadIcon />
        </div>
        <RtIcon />
      </div>
    );
  }
}
