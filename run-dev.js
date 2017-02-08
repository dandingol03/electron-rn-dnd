/**
 * Created by danding on 17/2/4.
 */
var fork = require('child_process').fork;
var path = require('path');

var onExit = function(child) {
    if (child && !child.killed) {
        child.kill()
    }
}

var child = fork(path.join(__dirname, './node_modules/.bin/webpack-dev-server'), {
    cwd: path.join(__dirname, './')
})

process.on('exit', onExit.bind(this, child))




var child = fork(path.join(__dirname, './node_modules/.bin/gulp'), ['start'], {
    cwd: path.join(__dirname, './')
})

process.on('exit', onExit.bind(this, child))
