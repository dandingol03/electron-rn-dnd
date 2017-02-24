'use strict';

/**
 * Created by danding on 17/2/4.
 */
var gutil = require('gulp-util');

var gulpLogger = {
    logger: function logger(msg) {
        gutil.log(gutil.colors.blue('logger info:'), gutil.colors.magenta(msg));
    },
    error: function error(msg) {
        gutil.log(gutil.colors.red('logger err:'), gutil.colors.red(msg));
    },
    info: function info(msg) {
        gutil.log(gutil.colors.blue('logger info:'), gutil.colors.magenta(msg));
    }

};

module.exports = gulpLogger;