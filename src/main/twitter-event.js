'use strict';
const EventEmitter = require('events');
const twit = require('twit');
const filter = require('./filter');

class Twitter extends EventEmitter {
  constructor(config) {
    super();
    this.listId = config.listId;
    this.create(config);
  }

  create(config) {
    const twitterConfig = {
      consumer_key: config.auth.consumerKey,
      consumer_secret: config.auth.consumerSecret,
      access_token: config.auth.accessToken,
      access_token_secret: config.auth.accessTokenSecret
    };
    this.T = new twit(twitterConfig);
  }

  users() {
    return new Promise(resolve => {
      this.T.get('lists/members', {list_id: this.listId, count: 5000}, (err, data) => {
        if (err) {
          console.log(err);
        }
        const userIds = data.users.map(user => {
          return user.id
        });
        resolve(userIds);
      });
    });
  }

  getList() {
    return new Promise(resolve => {
      this.T.get('lists/statuses', {
        list_id: this.listId,
        include_entities: true,
        include_rts: true,
        count: 200
      }, (err, data) => {
        if (err) {
          console.log(err);
        }

        const tweets = data
          .filter(tweet => tweet.extended_entities && filter(tweet))
          .reverse();
        resolve(tweets);
      });
    });
  }

  stream() {
    this.users().then(userIds => {
      const userStream = this.T.stream('statuses/filter', {follow: userIds.join()})
      userStream.on('tweet', tweet => {
        if (userIds.indexOf(tweet.user.id) !== -1 && filter(tweet)) {
          this.emit('tweet', tweet);
        }
      });
    });
    return this;
  }
}

module.exports = Twitter;
