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
//写入数据到文件
var writeDataToFile = function(file_path, json_data, callback){
    try{
        fs.writeFile(file_path, JSON.stringify(json_data), function(err){
            if(err){
                callback(false, err);
            }else{
                callback(true, true);
            }
        });
    }catch(err){
        console.log("35, promotion.js, writeDataToFile, error:\n"+err);
        callback(false, err);
    }
}
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
                // [success] http://172.31.11.61:3000/canudiloAu/login.ca?type=login&username=123&department=%E6%8A%80%E6%9C%AF%E9%83%A8&password=123&mobile=123
                // [failed]  http://172.31.11.61:3000/canudiloAu/login.ca?type=login&username=1234&department=%E6%8A%80%E6%9C%AF%E9%83%A8&password=123&mobile=123
                //console.log("69, login.js, :"+constants.login.type.login+", :"+_url_obj.query.type);
                if (_url_obj.query.type && constants.login.type.login === _url_obj.query.type) {
                    var _username   = _url_obj.query.username;
                    var _password   = _url_obj.query.password;
                    var _department = _url_obj.query.department;
                    var _mobile     = _url_obj.query.mobile;
                    var _flag       = false;    //login success
                    var _data       = {};        //user info
                    console.log("76, login.js, time:"+time.getCurrentTime_()+", username:"+_username+", password:"+_password+", department:"+_department+", mobile:"+_mobile);
                    for(var i=0; i<constants.login.login_data.length; i++){
                        var __username   = constants.login.login_data[i]["username"];
                        var __password   = constants.login.login_data[i]["password"];
                        var __department = constants.login.login_data[i]["department"];
                        var __mobile     = constants.login.login_data[i]["mobile"];
                        if(_username===__username && _password===__password && _department===__department && _mobile===__mobile){
                            _flag = true;
                            _data = constants.login.login_data[i];
                            constants.login.login_data[i]["loginstatus"] = 1;
                            break;
                        }
                    }

                    if(_flag){
                        //write info
                        writeDataToFile(_file_path, constants.login.login_data, function(ret, info){
                            if(ret){
                                //_data["password"] = "******";
                                deferer.resolve({result: _flag, error: "",data:_data});
                            }else{
                                deferer.resolve({result: false, error: "system error!",data:_data});
                            }
                        });
                    }else{
                        deferer.resolve({result: false, error: "system error!",data:_data});
                    }

                } else {
                    deferer.resolve({result: false, error: "error request params!"});
                    console.log('107, login.js, controller, error request params!');
                }
            }
        });
    }catch(e){
        console.log('[error] login.js.\n'+e);
        deferer.reject(err);
    }
    return deferer.promise;
};


