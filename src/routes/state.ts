var express = require('express');
var auth = require('../lib/auth');
var stateManager = require('../lib/stateManager');
var AuthorizationError = require('../errors/AuthorizationError');
var RedisError = require('../errors/RedisError');

var router = express.Router();

router.get('/', async (req, res, next) => {
    let token, state;

    try {
        token = await auth(req.headers.authorization);
    } catch(e) {
        return next(new AuthorizationError(e));
    }

    try {
        state = stateManager.get(token.channel_id);
    } catch(e) {
        return next(new RedisError(e));
    }

    res.status(200).send({
        ...state,
        currentTimestamp: new Date().getTime()
    });
});

router.post('/', async (req, res, next) => {
    let token;

    try {
        token = await auth(req.headers.authorization);
    } catch(e) {
        return next(new AuthorizationError(e));
    }

    try {
        let state = stateManager.get(token.user_id);

        if (req.body.state) {
            if (req.body.state.gameState === 'questions') {
                Object.keys(state.participants).forEach((key) => {
                    state.participants[key].answer = null;
                    state.participants[key].answerTimestamp = 0;
                });
            }

            stateManager.set({
                ...state,
                ...req.body.state,
                lastStateChangeTimestamp: new Date().getTime()
            }, token.user_id);
        }

        if (req.body.participants) {
            stateManager.set({
                ...state,
                participants: {
                    ...state.participants,
                    ...req.body.participants,
                }
            }, token.user_id);
        }
    } catch(e) {
        return next(new RedisError(e));
    }

    res.status(204).send();
});

module.exports = router;
