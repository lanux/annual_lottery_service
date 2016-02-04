/**
 * description: request filter module
 * copyright  : jie.zou, 2014-03-10 1000, created
 * */

'use strict';

var data = {
    type : {
        list        : "list",
        add         : "add",
        update      : "update",
        delete      : "delete",
        login       : "login",
        getradata   : "getradata",
        getadata    : "getadata",
        awrad        : "awrad",
        getallawrad : "getallawrad"
    },

    promotion_data : [],

    annual_data : [],

    login_data : [],

    award_list : []

};

module.exports.bamboo       = data;
module.exports.annual       = data;
module.exports.login        = data;
module.exports.awrad         = data;




