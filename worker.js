/**
 * description: main module
 * copyright  : jie.zou, 2014-01-02 1148, created
 *              jie.zou, 2016-01-09 1006, updated a simple copyright for canudilo.com
 * */

'use strict';

var http        = require('http');
var app_conf    = require('./app-conf');
var gm_filter   = require('./config/filter');
var log         = require('./common/logger');
var json        = require('./common/json');
var time        = require('./common/time');


//max http connection number
//http.globalAgent.maxSockets = 5000;

// autoRunTask
var autoRunTask = function(){

}

http.createServer(
    function (request, response) {
        var result = gm_filter.getController(request.url, request, response)(request.url, request, response);
        if (result && result.then && typeof(result.then) == 'function') {
            result.then(function(data) {
                response.writeHead(200, "Content-Type:applicaton/x-json; charset=utf-8");
//                response.write("ret({data:"+json.stringify(data)+"})");
                response.write(json.stringify(data));
                response.end();
            })
        } else {
            response.writeHead(200, "Content-Type:applicaton/x-json; charset=utf-8");
//            response.write("ret(data:{"+json.stringify(result)+"})");
            response.write(json.stringify(result));
            response.end();
        }
    }
).listen(app_conf.http_port);

autoRunTask();

console.log('[start up done] - '+time.getCurrentTime()+' - Server running at http://127.0.0.1:%s/ [%s]', app_conf.http_port, app_conf.node_env);
//log.info('[start up done] - '+time.getCurrentTime()+' - Server running at http://127.0.0.1:%s/ [%s]', app_conf.http_port, app_conf.node_env);

