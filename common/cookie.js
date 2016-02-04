/**
 * description: cookie utils
 * copyright  : jie.zou, 2014-01-02 1148, created
 * */

'use strict';

var cache = {};

function getPattern(name) {
    if (!cache[name]) {
        cache[name] = new RegExp(
            "(?:^|;) *" +
                name.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&") +
                "=([^;]*)"
        );
    }

    return cache[name];
}

function Cookie(cookie) {
    this.cookie = cookie;
}

Cookie.prototype.get = function (name) {
    if (!this.cookie) {
        return;
    }
    var match = this.cookie.match(getPattern(name));
    if (!match) {
        return;
    }

    return match[1];
};

module.exports = Cookie;
