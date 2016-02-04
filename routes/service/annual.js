/**
 * description: request filter module
 * copyright  : jie.zou, 2014-03-10 1000, created
 *              jie.zou, 2016-01-09 1006, updated a simple copyright for canudilo.com
 * */

'use strict';

var http       = require('http');
var fs         = require('fs');
var url        = require('url');
var app_conf   = require('../../app-conf');
var json       = require('../../common/json');
var time       = require('../../common/time');
var constants  = require('../../common/constants');
var defer      = require('node-promise').defer;


http.Agent.maxSockets = 100;


// 3.2.1 产品详细信息存入文件中
//fs.writeFile(_prod_detail_file_name, _prodInfo, function(err){  // 覆盖式更新文件
//    if(err){
//        console.log('113, product-alibaba.js, write product info into file, error '+err);
//    }
//});

/*
* desc: write data to file
* */
var writeDataToFile = function(file_path, json_data, callback){
    try{
        //console.log("34, annual.js, writeDataToFile, file_path:"+file_path+", json_data:"+json_data);
        fs.writeFile(file_path, JSON.stringify(json_data), function(err){
            //console.log("36, annual.js, writeDataToFile");
            if(err){
                //console.log("38, annual.js, writeDataToFile");
                callback(false, err);
            }else{
                //console.log("41, annual.js, writeDataToFile");
                callback(true, true);
            }
        });
    }catch(err){
        console.log("35, promotion.js, writeDataToFile, error:\n"+err);
        callback(false, err);
    }
}

/*
* desc: read data from file
* */
var readDataFromFile = function(file_path, callback){
    try{
        //console.log('56, annual.js, readDataFromFile, file_path:'+file_path);
        fs.readFile(file_path, "utf-8", function (err, data) {
            //console.log('58, annual.js, readDataFromFile, err:'+err+", data:"+data);
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
        //console.log("48, promotion.js, readDataFromFile, error:\n"+err);
        callback(false, err);
    }
}


// main process
module.exports.controller = function(request_url) {
    var deferer = defer();

    try{
        var _url_obj   = url.parse(request_url, true);
        var _file_path = app_conf.save_file_address.annual_meeting;

        readDataFromFile(_file_path, function(ret, data){
            //console.log('85, annual.js, ret:'+ret+', data:'+JSON.stringify(data));

            if(!ret){
                deferer.resolve({result:"", error:data});
            }else{
                if(""===data){
                    constants.annual.annual_data = [];
                }else{
                    //constants.annual.annual_data = json.parse(data);
                    constants.annual.annual_data = data;
                }

                // 1. annual list (url sample -  http://localhost:3000/canudilo/annualtest.ca?type=list , http://localhost:3000/canudilo/annualtest.ca?type=list&username=test03)
                if(_url_obj.query.type && constants.annual.type.list===_url_obj.query.type){
                    var _query_username = _url_obj.query.username;
                    //console.log('86, annual.js, controller, _query_username:'+_query_username);
                    readDataFromFile(_file_path, function(ret, info){
                        //console.log('88, annual.js, controller, ret:'+ret+", info:"+typeof(info) );
                        //var _info = JSON.parse(info);
                        var _info = info;
                        if(ret){
                            var _list = [];
                            for(var _i=0; _i<_info.length; _i++){
                                //console.log("\n98, annual.js, controller, info["+_i+"]:"+_info[_i]);
                                if(_query_username){
                                    if(_query_username===_info[_i]["username"]){
                                        _list.push(_info[_i]);
                                        break;
                                    }
                                    continue;
                                }else{
                                    _list.push(_info[_i]);
                                }
                            }
                            deferer.resolve({result:true, error:"", data:_list});
                        }else{
                            deferer.resolve({result:false, error:info});
                        }
                        //deferer.resolve({result:constants.annual.annual_data, error:""});
                    });

                // 2. add annual data  (url sample -  http://localhost:3000/canudilo/annualtest.ca?type=add&data={%22username%22:%22test%22,%22sex%22:1,%22mobile%22:1234567890456})
                }else if(_url_obj.query.type && constants.annual.type.add === _url_obj.query.type){
                    var _annual_data = _url_obj.query.data;
                    //console.log('91, annual.js, controller, _annual_data:'+_annual_data);
                    if(_annual_data){
                        try{
                            console.log('94, annual.js, controller, annual_data:'+constants.annual.annual_data);
                            //console.log('94, annual.js, controller, annual_data:'+json.stringify(constants.annual.annual_data));
                            var _old_data = false;
                            var _new_data = JSON.parse(_annual_data);
                            //update
                            for(var _i=0; _i<constants.annual.annual_data.length; _i++){
                                if(_new_data["username"] === constants.annual.annual_data[_i]["username"]){
                                    _old_data = true;
                                    constants.annual.annual_data[_i] = _new_data;
                                }
                            }
                            //insert
                            if(!_old_data){
                                constants.annual.annual_data.push(_new_data);
                            }
                            //console.log('96, annual.js, controller, constants.annual.annual_data:'+json.stringify(constants.annual.annual_data));
                            writeDataToFile(_file_path, constants.annual.annual_data, function(ret, info){
                                if(ret){
                                    deferer.resolve({result:true, error:""});
                                }else{
                                    deferer.resolve({result:false, error:info});
                                }
                            });
                        }catch(err){
                            deferer.resolve({result:false, error:"wrong param 'data' value. \n"+err});
                        }

                    }else{
                        deferer.resolve({result:false, error:" no param 'data'"});
                    }

                // 3. update annual data
                }else if(_url_obj.query.type && constants.annual.type.update===_url_obj.query.type){
                    deferer.resolve({result:false, error:"current no service"});

                // 4. delete annual data
                }else if(_url_obj.query.type && constants.annual.type.delete===_url_obj.query.type){
                    deferer.resolve({result:false, error:"current no service"});

                }else{
                    deferer.resolve({result:false, error:"error request params!"});
                }
            }
        });
    }catch(e){
        console.log('[error] product-alibaba.js.\n'+e);
        deferer.reject(err);
    }
    return deferer.promise;
};
