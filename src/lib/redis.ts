var Redis = require('redis');
var redis = Redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

module.exports = redis;
