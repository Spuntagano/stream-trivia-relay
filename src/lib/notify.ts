var express = require('express');
var connections = require('../lib/connections');

module.exports = (channelId, body) => {
    connections.getActiveByChannel(channelId).forEach((ws)=> {
        ws.send(JSON.stringify(body));
    });
};
