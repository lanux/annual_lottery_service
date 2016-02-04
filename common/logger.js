/**
 * description: log file utils
 * copyright  : jie.zou, 2014-01-02 1148, created
 * */
'use strict';

var bunyan = require('bunyan');
var path = require('path');

var log = bunyan.createLogger({
    name: 'trace_logger',
    streams: [
        {
            level: 'info',
            path: __dirname + '/../logs/info.log'  // log
        },
        {
            level: 'error',
            path: __dirname + '/../logs/error.log'  // log ERROR and above to a file
        }
    ]
});

module.exports = log;
