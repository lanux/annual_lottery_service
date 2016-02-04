/**
 * description: json utils
 * copyright  : jie.zou, 2014-04-10 1550, created
 * */

'use strict';

var http  = require('http');
var defer = require('node-promise').defer;
var constants  = require('./constants');

/*
* 据 url 取返回数据
* */
var getHttpDataByUrl = function(url){
    var deferred = defer();
    var _http = http.get(url,
        function(res){
            var _response = "";
            res.on('data',function(chunk) {
                _response += chunk;
            });
            res.on('end',function() {
                deferred.resolve(_response);
            });
        });
    _http.on('error', function(err){
        console.log("45, get data from url error, :\n"+err);
        deferred.resolve("error");
    });
    return deferred.promise;
};

/*
* 据 url object 取返回数据
* */
var getHttpDataByUrlObj = function(obj){
    var deferred = defer();
    var _http = http.get(obj,
        function(res){
            var _response = "";
            res.on('data',function(chunk) {
                _response += chunk;
            });
            res.on('end',function() {
                deferred.resolve(_response);
            });
        });
    _http.on('error', function(err){
        console.log("45, get data from url object error, :"+err);
        deferred.resolve("error");
    });
    return deferred.promise;
};

module.exports.getHttpDataByUrlObj = getHttpDataByUrlObj;
module.exports.getHttpDataByUrl    = getHttpDataByUrl;

