/**
 * Created by jie.zou on 2016/1/20.
 * description:抽奖接口
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

//返回用户数据
var returnUser = function(udata, mobile){
    var result = {};
    try{
        for(var i=0; i<udata.length; i++){
            if(mobile===udata[i]["mobile"]){
                //console.log("57, award.js, i:"+i+", mobile:"+mobile+", :"+udata[i]["mobile"]);
                result = udata[i];
                break;
            }
        }
    }catch(err){
    }
    //console.log("63, award.js, result:"+result);
    return result;
}

//返回9个随机ID
var returnRandAward = function(adata){
    var _awards = [];
    var _result = [];

    try{
        for(var i=0; i<adata.length; i++){
            if(0===adata[i]["status"]){
                _awards.push(adata[i]);
            }
        }

        for(var i=0; i<9; i++){
            var _rand = Math.floor(Math.random()*(_awards.length-1));
            _result.push(_awards[_rand]["id"]);
        }

    }catch(err){
    }
    return _result;
}

//返回指定ID的数据
var returnAward = function(adata, id){
    var _result = {};
    try{
        for(var i=0; i<adata.length; i++){
            if(id===adata[i]["id"] && 0===adata[i]["status"]){
                _result = adata[i];
                break;
            }
        }
    }catch(err){
    }
    return _result;
}

//更新得奖的状态数据
var updateAwardStatus = function(adata, id, mobile){
    try{
        var _flag = false;
        for(var i=0; i<adata.length; i++){
            if(id===adata[i]["id"] && 0===adata[i]["status"] && ""===adata[i]["mobile"]){
                adata[i]["status"]=1;
                adata[i]["mobile"]=mobile;
                _flag = true;
                break;
            }
        }
    }catch(err){
        _flag = false;
        return [];
    }
    if(_flag){
        return adata;
    }else{
        return [];
    }
}

//更新得奖用户的数据
var updateUserStatus = function(udata, mobile, id, rank){
    try{
        for(var i=0; i<udata.length; i++){
            if(mobile===udata[i]["mobile"] || ""===udata[i]["awardtime"] || -1===udata[i]["awardrank"] && ""===udata[i]["awardid"]){
                udata[i]["awardtime"]   = time.getCurrentTime_();
                udata[i]["awardrank"]   = rank;
                udata[i]["awardid"]     = id;
                udata[i]["loginstatus"] = 1;
                break;
            }
        }
    }catch(err){
    }
    return udata;
}


module.exports.controller = function(request_url) {
    var deferer = defer();

    try{
        var _url_obj    = url.parse(request_url, true);
        var _ufile_path = app_conf.save_file_address.login_user;
        var _afile_path = app_conf.save_file_address.award_list;
        var _mobile     = _url_obj.query.mobile;

        readDataFromFile(_ufile_path, function(ret, udata){

            if(!ret){
                deferer.resolve({result:"", error:udata});
            }else {
                if ("" === udata) {
                    constants.login.login_data = [];
                } else {
                    constants.login.login_data = udata;
                }

                readDataFromFile(_afile_path, function(ret, adata){

                    if(!ret){
                        deferer.resolve({result:"", error:adata});
                    }else {
                        if ("" === adata) {
                            constants.awrad.award_list = [];
                        } else {
                            constants.awrad.award_list = adata;
                        }

                        // [success] http://localhost:3000/canudiloAu/award.ca?type=getradata&mobile=123
                        // [failed]  http://localhost:3000/canudiloAu/award.ca?type=getradata&mobile=1234
                        console.log("136, login.js, time:"+time.getCurrentTime_()+", type:"+_url_obj.query.type);
                        if (_url_obj.query.type && constants.awrad.type.getradata === _url_obj.query.type) {
                            try{
                                var _user   = returnUser(constants.login.login_data, _mobile);
                                var _result = [];
                                if(_user["mobile"]){
                                    _result = returnRandAward(constants.awrad.award_list);
                                }
                                console.log("142, award.js, (随机查询9个ID), time:"+time.getCurrentTime_()+", _mobile:"+_mobile+", _result:"+_result);
                                deferer.resolve({result: true, error: "", data:_result});
                            }catch(err){
                                deferer.resolve({result: false, error: "system error!", data:[]});
                            }

                        // [success] http://localhost:3000/canudiloAu/award.ca?type=getadata&mobile=123&id=xcve
                        // [failed]  http://localhost:3000/canudiloAu/award.ca?type=getadata&mobile=123&id=xcveee
                        }else if (_url_obj.query.type && constants.awrad.type.getadata === _url_obj.query.type) {
                            try{
                                var _id     = _url_obj.query.id;
                                var _result = returnAward(constants.awrad.award_list, _id);
                                console.log("150, award.js, (查询指定ID的奖项) time:"+time.getCurrentTime_()+", _mobile:"+_mobile+", _result:"+_result);
                                deferer.resolve({result: true, error: "", data:_result});
                            }catch(err){
                                deferer.resolve({result: false, error: "system error!", data:[]});
                            }

                        // [success] http://localhost:3000/canudiloAu/award.ca?type=awrad&mobile=123&id=xcve
                        // [failed]  http://localhost:3000/canudiloAu/award.ca?type=awrad&mobile=123&id=xcveee
                        }else if (_url_obj.query.type && constants.awrad.type.awrad === _url_obj.query.type) {
                            var _id     = _url_obj.query.id;
                            var _result = {};
                            var _flag   = false;
                            try{
                                var _user   = returnUser(constants.login.login_data, _mobile);
                                if(_user && _user["loginstatus"] && 1===_user["loginstatus"] && ""===_user["awardid"]){
                                    console.log("202, award.js, (刮出奖) time:"+time.getCurrentTime_()+", mobile:"+_mobile+", awardid:"+_id);

                                    try{
                                        //console.log("209, award.js, 回写用户数据与得奖数据");

                                        var _award_list = [];
                                        //写回已抽取的奖品信息
                                        readDataFromFile(_afile_path, function(ret, adata){
                                            //console.log("212, award.js");
                                            if(!ret){
                                                //console.log("213, award.js");
                                                deferer.resolve({result:false, error:adata});
                                            }else {
                                                if (adata && adata.length>0) {
                                                    //console.log("214, award.js");
                                                    _award_list = adata;
                                                    var _award = updateAwardStatus(_award_list, _id, _mobile);
                                                    var _rank  = returnAward(constants.awrad.award_list, _id);
                                                    if(_award && _award.length>0){

                                                        writeDataToFile(_afile_path, _award, function(ret, info){
                                                            if(ret){
                                                                _flag = true;

                                                                //写回抽奖人信息
                                                                var _user_list = [];
                                                                readDataFromFile(_ufile_path, function(ret, _udata){
                                                                    if(!ret){
                                                                        deferer.resolve({result:false, error:_udata});
                                                                    }else {
                                                                        if (_udata && _udata.length>0) {
                                                                            _user_list = _udata;
                                                                            _udata = updateUserStatus(_udata, _mobile, _id, _rank["awardrank"]);

                                                                            writeDataToFile(_ufile_path, _udata, function(ret, info){
                                                                                if(ret){
                                                                                    _flag = true;
                                                                                    var _user = returnUser(_udata, _mobile);
                                                                                    deferer.resolve({result:_flag, error:"", data:_user});
                                                                                }else{
                                                                                    deferer.resolve({result:_flag, error:"奖项已被抽取，请重新抽奖!", errorcode: 1, data:{}});
                                                                                }
                                                                            });

                                                                        }
                                                                    }
                                                                });

                                                                //deferer.resolve({result:_flag, error:"", data:_user});
                                                            }else{
                                                                deferer.resolve({result:_flag, error:"", data:{}});
                                                            }
                                                        });
                                                    }else{
                                                        deferer.resolve({result:_flag, error:"奖项已被抽取，请重新抽奖!", errorcode: 1, data:{}});
                                                    }
                                                }
                                            }
                                        });

                                    }catch(err){
                                        deferer.resolve({result:_flag, error:"system error!", data:[]});
                                    }

                                }else{
                                    deferer.resolve({result:_flag, error:"已抽过奖，不需要再次抽奖!", errorcode:2, data:{}});
                                }

                            }catch(err){
                                deferer.resolve({result:false, error:"system error!", data:[]});
                            }

                        } else {
                            deferer.resolve({result: false, error: "error request params!"});
                            console.log('181, award.js, controller, error request params!');
                        }
                    }
                });

            }
        });
    }catch(e){
        console.log('[error] award.js.\n'+e);
        deferer.reject(err);
    }
    return deferer.promise;
};


