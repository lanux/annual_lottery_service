/**
 * Created by jie.zou on 2016/1/20.
 * description:登录接口
 */
'use strict';

var http       = require('http');
var fs         = require('fs');
var url        = require('url');
var app_conf   = require('../../app-conf');
var json       = require('../../common/json');
var time       = require('../../common/time');
var constants  = require('../../common/constants');
var defer      = require('node-promise').defer;

http.Agent.maxSockets = 1000;


//读取数据到文件
var readDataFromFile = function(file_path, callback){
    try{
        fs.readFile(file_path, "utf-8", function (err, data) {
            if (err){
                callback(false, err);
            }else{
                var _data = [];
                if(data){
                    _data = JSON.parse(data);
                }
                callback(true, _data);
            }
        });
    }catch(err){
        callback(false, err);
    }
}

var getUserInfo = function(udata){
    var _result = [];
    for(var i=0; i<udata.length; i++){
        if(-1 !== udata[i]["awardrank"]){
            var _ele = {};
            _ele["username"] = udata[i]["username"];
            _ele["awardtime"] = udata[i]["awardtime"];
            _ele["awardrank"] = udata[i]["awardrank"];
            _result.push(_ele);
        }
    }
    return _result;
}

module.exports.controller = function(request_url) {
    var deferer = defer();
    try{
        var _url_obj   = url.parse(request_url, true);
        var _file_path = app_conf.save_file_address.login_user;

        readDataFromFile(_file_path, function(ret, data){

            if(!ret){
                deferer.resolve({result:"", error:data});
            }else {
                if ("" === data) {
                    constants.login.login_data = [];
                } else {
                    constants.login.login_data = data;
                }
                // [success] http://localhost:3000/canudiloAu/search.ca?type=getallawrad
                // [failed] http://localhost:3000/canudiloAu/search.ca?type=getallawrad2
                console.log("69, search.js, time:"+time.getCurrentTime_()+", :"+constants.login.type.getallawrad+", type:"+_url_obj.query.type);
                if (_url_obj.query.type && constants.login.type.getallawrad === _url_obj.query.type) {
                    try{
                        var _user_info = getUserInfo(constants.login.login_data);
                        deferer.resolve({result: true, error: "",data:_user_info});
                    }catch(err){
                        deferer.resolve({result: false, error: "system error!",data:[]});
                    }
                } else {
                    deferer.resolve({result: false, error: "error request params!"});
                    console.log('107, search.js, controller, error request params!');
                }
            }
        });
    }catch(e){
        console.log('[error] search.js.\n'+e);
        deferer.reject(err);
    }
    return deferer.promise;
};


