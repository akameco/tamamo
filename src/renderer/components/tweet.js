import React from 'react';

const Tweet = props => {
  return (
    <div>
      <div className='tweet'>
        <p className='tweet__screen_name'>@{props.data.screen_name}</p>
        <p className='tweet__text'>{props.data.text}</p>
      </div>
    </div>
  );
};

export default Tweet;
