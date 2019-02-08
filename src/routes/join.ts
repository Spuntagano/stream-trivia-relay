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

    try {
        token = await auth(req.headers.authorization);
    } catch (e) {
        return next(new AuthorizationError(e));
    }

    try {
        state = stateManager.get(token.channel_id);
    } catch(e) {
        return next(new RedisError(e));
    }

    if (state.useBits) {
        try {
            await auth(req.body.transaction.transactionReceipt);
        } catch (e) {
            return next(new AuthorizationError(e));
        }
    }

    try {
        notify(token.channel_id, {
            action: 'JOIN',
            name: token.user_id
        });
    } catch(e) {
        return next(new ApiError(e));
    }

    try {
        if (!token.user_id) throw new Error('Player has not shared ID');

        state.participants[token.user_id] = {score: 0, answer: null, answerTimestamp: 0};
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
