var _ = require('lodash');
var redis = require('./redis');

declare var state;
declare var updaters;
state = {};
updaters = {};

class StateManager {
    constructor() {
        redis.keys('state-*', (err, keys) => {
            keys.forEach((key) => {
                redis.get(key, (err, response) => {
                    state[key.split('state-')[1]] = JSON.parse(response);
                });
            });
        });
    }

    get(channelId) {
        return state[channelId];
    }

    set(newState, channelId) {
        state[channelId] = newState;

        this.update(channelId)();
    }

    update(channelId) {
        if (!updaters[channelId]) {
            updaters[channelId] = _.debounce(() => {
                redis.set(`state-${channelId}`, JSON.stringify(state[channelId]), 'EX', 24*60*60, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }, 100);

        }

        return updaters[channelId];
    }
}

module.exports = new StateManager();
