var express = require('express');
var nodeFetch = require('node-fetch');
var ApiError = require('../errors/ApiError');

var router = express.Router();

router.get('/', async (req, res, next) => {
    let users: any = {};

    try {
        await nodeFetch(`${process.env.TWITCH_API_BASE_URL}/users?id=${req.query.id.split(',').join('&id=')}`, {
            method: 'GET',
            headers: {
                'Client-ID': req.headers.clientid
            }
        }).then(async (response, err) => {
            if (!response.ok || err) {
                throw err || response;
            }

            users = await response.json();
        });
    } catch (e) {
        return next(new ApiError(e));
    }

    res.status(200).send(users.data);
});

module.exports = router;
