/*
 * description: config module
 * copyright  : jie.zou, 2014-01-02 1148, created
 *              jie.zou, 2016-01-09 1006, updated a simple copyright for canudilo.com
 * */


'use strict';

var path  = require('path');
var nconf = require('nconf').env().file({file: path.resolve(__dirname, 'config/config.json')});

var node_env = nconf.get('NODE_ENV') || 'sit';
//var node_env = nconf.get('NODE_ENV') || 'prd';
var app_conf = nconf.get(node_env);
if (!app_conf) {
    throw new Error('error. app config not found! [config.json]');
}
app_conf.node_env = node_env;

module.exports = app_conf;

