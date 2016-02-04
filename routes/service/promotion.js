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
        fs.writeFile(file_path, json_data, function(err){
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

/*
* desc: read data from file
* */
var readDataFromFile = function(file_path, callback){
    try{
        fs.readFile(file_path, "utf-8", function (err, data) {
            if (err){
                callback(false, err);
            }else{
                callback(true, data);
            }
        });
    }catch(err){
        console.log("48, promotion.js, readDataFromFile, error:\n"+err);
        callback(false, err);
    }
}


// main process
module.exports.controller = function(request_url) {
    var deferer = defer();

    try{
        var _url_obj   = url.parse(request_url, true);
        var _file_path = app_conf.save_file_address.promotion_list;

        readDataFromFile(_file_path, function(ret, data){
            if(!ret){
                deferer.resolve({result:"", error:data});
            }else{
                if(""===data){
                    constants.bamboo.promotion_data = [];
                }else{
                    constants.bamboo.promotion_data = json.parse(data);
                }

                // 1. promotion list
                if(_url_obj.query.type && constants.bamboo.type.list===_url_obj.query.type){
                    deferer.resolve({result:constants.bamboo.promotion_data, error:""});

                // 2. add promotion
                }else if(_url_obj.query.type && constants.bamboo.type.add===_url_obj.query.type){
                    var _promotion_data = _url_obj.query.data;
                    if(_promotion_data){
                        try{
                            constants.bamboo.promotion_data.push(_promotion_data);
                            writeDataToFile(_file_path, json.stringify(constants.bamboo.promotion_data), function(ret, info){
                                if(ret){
                                    deferer.resolve({result:data, error:""});
                                }else{
                                    deferer.resolve({result:"", error:info});
                                }
                            });
                        }catch(err){
                            deferer.resolve({result:"", error:"wrong param 'data' value. "});
                        }

                    }else{
                        deferer.resolve({result:"", error:" no param 'data'"});
                    }

                // 3. update promotion
                }else if(_url_obj.query.type && constants.bamboo.type.update===_url_obj.query.type){
                    deferer.resolve({result:"", error:"current no service"});

                // 4. delete promotion
                }else if(_url_obj.query.type && constants.bamboo.type.delete===_url_obj.query.type){
                    deferer.resolve({result:"", error:"current no service"});

                }else{
                    deferer.resolve({result:"", error:"error request params!"});
                }
            }
        });
    }catch(e){
        console.log('[error] product-alibaba.js.\n'+e);
        deferer.reject(err);
    }
    return deferer.promise;
};
