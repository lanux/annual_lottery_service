/**
 * description: request filter module
 * copyright  : jie.zou, 2014-01-02 1148, created
 *              jie.zou, 2016-01-09 1006, updated a simple copyright for canudilo.com
 * */

'use strict';

var promotion    = require('../routes/service/promotion');
var annual        = require('../routes/service/annual');
var login         = require('../routes/service/login');
var award         = require('../routes/service/award');
var search        = require('../routes/service/search');
var otherdefault = require('../routes/default');


//deny request dispatch config
var deny_conf =
[
    {
        "/deny.gm":"",
        "desc":"deny request config"
    }
];

//access request dispatch config
var filter_conf =
[
    //common
    {
        "url"         : "/bamboo/promotion.bo",
        "controller" : promotion.controller,
        "desc"        : "promotion plan module (include basic oper like crud)",
        "invoke"     : "http://localhost:3000/bamboo/promotion.bo",
        "param"      : "type=list/add/update/delete, data={...}",
        "cplt1"      : "created by jie.zou, 2014-04-19 1001 "
    },

    {
        "url"         : "/canudilo/annualtest.ca",
        "controller" : annual.controller,
        "desc"        : "just a test module (file operation test)",
        "invoke"     : "http://localhost:3000/canudilo/annualtest.bo",
        "param"      : "type=list/add/update/delete, data={...}",
        "cplt1"      : "created by jie.zou, 2016-01-09 1022"
    },

    //登录
    {
        "url"        : "/canudiloAu/login.ca",
        "controller" : login.controller,
        "desc"       : "用户登录",
        "invoke"     : "http://localhost:3000/canudiloAu/login.ca",
        "param"      : "?type=login&username=123&department=%E6%8A%80%E6%9C%AF%E9%83%A8&password=123&mobile=123",
        "cplt1"      : "created by jie.zou, 2016-01-20 1022"
    },

    //开始刮奖 (随机查询9个ID)
    {
        "url"        : "/canudiloAu/award.ca",
        "controller" : award.controller,
        "desc"       : "开始刮奖 (随机查询9个ID, 查询指定ID的奖项, 刮出奖)",
        "invoke"     : "http://localhost:3000/canudiloAu/award.ca",
        "param"      : "?type=getradata&mobile=123,  ?type=getadata&mobile=123&id=xcve,  ?type=awrad&mobile=123&id=xcve",
        "cplt1"      : "created by jie.zou, 2016-01-20 1022"
    },

    //查询已刮的奖项
    {
        "url"        : "/canudiloAu/search.ca",
        "controller" : search.controller,
        "desc"       : "开始刮奖 (随机查询9个ID, 查询指定ID的奖项, 刮出奖)",
        "invoke"     : "http://localhost:3000/canudiloAu/search.ca",
        "param"      : "?type=getallawrad",
        "cplt1"      : "created by jie.zou, 2016-01-20 1022"
    },

    //default
    {
        "url"        : "/default.gm",
        "controller" : otherdefault.controller,
        "desc"       : "other request.  默认处理"
    }
];

var getController = function (request_url){
    for(var i=0; i<filter_conf.length; i++){
//console.log('33, filter.js, i:'+i+', request_url:'+request_url+', url:'+filter_conf[i].url+', is_url:'+request_url.search(filter_conf[i].url));
        if(request_url.search(filter_conf[i].url)!=-1){
             return filter_conf[i].controller;
        }
    }
    return filter_conf[filter_conf.length-1].controller;
}

module.exports.deny_conf     = deny_conf;
module.exports.filter_conf   = filter_conf;
module.exports.getController = getController;

