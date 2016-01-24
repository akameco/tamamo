import React from 'react';
import {RtIcon, HeartIcon, DownloadIcon} from './icon';

export default class Controlbox extends React.Component {
  render() {
    return (
      <div className='controlbox'>
        <HeartIcon />
        <div className='donwload'>
          <DownloadIcon />
        </div>
        <RtIcon />
      </div>
    );
  }
}
