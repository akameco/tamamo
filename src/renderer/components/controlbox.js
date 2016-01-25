import React from 'react';
import {DownloadIcon, NextIcon, PrevIcon} from './icon';

export default class Controlbox extends React.Component {
  constructor(props) {
    super(props);
  }

  _onPrevClick(e) {
    this.props.onPrev(e);
  }

  _onNextClick(e) {
    this.props.onNext(e);
  }

  _onClick(e) {
    this.props.onClick(e);
  }

  render() {
    return (
      <div className='controlbox'>
        <div onClick={this._onNextClick.bind(this)}>
          <NextIcon />
        </div>
        <div onClick={this._onClick.bind(this)} className='donwload'>
          <DownloadIcon />
        </div>
        <div onClick={this._onPrevClick.bind(this)}>
          <PrevIcon />
        </div>
      </div>
    );
  }
}
