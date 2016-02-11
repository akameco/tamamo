'use strict';
const EventEmitter = require('events');
const Twit = require('twit');
const config = require('../../config.json');
const filter = require('./filter');

class Twitter extends EventEmitter {
  constructor(token) {
    super();
    this.listId = config.listId;
    this.create(token);
  }

  create(token) {
    const auth = require('../../res/credential.json');
    const config = {
      consumer_key: auth.consumerKey,
      consumer_secret: auth.consumerSecret,
      access_token: token.accessToken,
      access_token_secret: token.accessTokenSecret
    };
    this.T = new Twit(config);
  }

  users() {
    return new Promise(resolve => {
      this.T.get('lists/members', {list_id: this.listId, count: 5000}, (err, data) => {
        if (err) {
          console.log(err);
        }
        const userIds = data.users.map(user => {
          return user.id;
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
      const userStream = this.T.stream('statuses/filter', {follow: userIds.join()});
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
