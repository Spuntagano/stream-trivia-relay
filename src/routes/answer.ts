var express = require('express');
var auth = require('../lib/auth');
var notify = require('../lib/notify');
var stateManager = require('../lib/stateManager');
var AuthorizationError = require('../errors/AuthorizationError');
var ApiError = require('../errors/ApiError');
var StateError = require('../errors/StateError');
var RedisError = require('../errors/RedisError');

var router = express.Router();

router.post('/', async (req, res, next) => {
    let token, state;

    try {
        token = await auth(req.headers.authorization);
    } catch(e) {
        return next(new AuthorizationError(e));
    }

    try {
        notify(token.channel_id, {
            action: 'ANSWER',
            answer: req.body.answer,
            name: token.user_id
        });
    } catch(e) {
        return next(new ApiError(e));
    }

    try {
        state = stateManager.get(token.channel_id);

        if (state.gameState !== 'questions') throw new Error('Invalid game state');
        if (!state.participants[token.user_id]) throw new Error('User not in participant list');
        if (state.participants[token.user_id].answer !== null) throw new Error('User has already answered');

        state.participants[token.user_id].answer = req.body.answer;
        state.participants[token.user_id].answerTimestamp = new Date().getTime();
    } catch(e) {
        return next(new StateError(e));
    }

    try{
        stateManager.set(state, token.channel_id);
    } catch(e) {
        return next(new RedisError(e));
    }

    res.status(204).send();
});

module.exports = router;
