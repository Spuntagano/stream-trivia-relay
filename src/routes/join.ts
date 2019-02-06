var express = require('express');
var auth = require('../lib/auth');
var notify = require('../lib/notify');
var stateManager = require('../lib/stateManager');
var AuthorizationError = require('../errors/AuthorizationError');
var RedisError = require('../errors/RedisError');
var ApiError = require('../errors/ApiError');
var StateError = require('../errors/StateError');

var router = express.Router();

router.post('/', async (req, res, next) => {
    let token: any = {}, state;

    if (req.headers.authorization) {
        try {
            token = await auth(req.headers.authorization);
        } catch (e) {
            return next(new AuthorizationError(e));
        }
    }

    let userId = token.user_id;
    if (req.body.userId && token.user_id === token.channel_id) {
        userId = req.body.userId
    }

    try {
        notify(token.channel_id, {
            action: 'JOIN',
            name: userId
        });
    } catch(e) {
        return next(new ApiError(e));
    }

    try {
        state = stateManager.get(token.channel_id);

        if (state.useBits) throw new Error('Require bits payment');
        if (!userId) throw new Error('Player has not shared ID');

        state.participants[userId] = {score: 0, answer: null, answerTimestamp: 0};
    } catch(e) {
        return next(new StateError(e));
    }

    try {
        stateManager.set(state, token.channel_id);
    } catch(e) {
        return next(new RedisError(e));
    }

    res.status(204).send();
});

module.exports = router;
