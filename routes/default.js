
'use strict';

var url   = require('url');
//var spawn = require('child_process').spawn;

module.exports.controller = function(request_url) {
    var url_obj = url.parse(request_url, true);
/*
    try{
        var test2 = spawn("dir" ,['']);
        test2.stdout.on("data", function(data){
            console.log(" default.js, stdout.data:"+data);
        });
        test2.stderr.on("data", function(data){
            console.log(" default.js, stderr.data:"+data);
        });
        test2.on('exit', function(code){
            console.log(" finished child_process.");
        });
    }catch(e){
        console.log("default.js, error, e:"+e);
    }
*/
    return url_obj;
};

