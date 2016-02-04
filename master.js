/**
 * description: master module
 * copyright  : jie.zou, 2014-01-02 1148, created
 *              jie.zou, 2016-01-09 1006, updated a simple copyright for canudilo.com
 * */

'use strict';

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var i;
var online_workers_num = 0;
var bunyan = require('bunyan');

var log = bunyan.createLogger({
    name: 'trace_logger',
    streams: [
        {
            level: 'info',
            path: __dirname + '../logs/trace_logger.log'  // log
        },
        {
            level: 'error',
            path: __dirname + '../logs/trace_logger_error.log'  // log ERROR and above to a file
        }
    ]
});

cluster.setupMaster({
    exec : "worker.js",
    silent : false
});

// Fork workers.
for (i = 0; i < numCPUs; i += 1) {
    cluster.fork();
}

cluster.on('online', function (worker) {
    online_workers_num += 1;
    log.info('worker %s is online.', worker.process.pid);
});

cluster.on('exit', function (worker, code, signal) {
    log.error('worker %s died.', worker.process.pid);
    online_workers_num -= 1;
    if (online_workers_num === 0) {
        process.exit(1);
    }
});
