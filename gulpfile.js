const gulp = require('gulp');
var gulpLogger =require( './desktop/src/logger/gulpLogger');
var path=require('path');
var child_process = require('child_process');

// Create an electron-connect server to enable reloading


//TODO:add gulp webpack-dev-server hot-reload

var child=null;
gulp.task('start', ()=>{

    child = child_process.fork("" + (path.join(__dirname, './node_modules/.bin/electron')), [__dirname, "--dev-mode"], {
        cwd: __dirname,
        env: process.env
    });

    gulp.watch('desktop/*.js',function(event) {
        gulpLogger.logger(event.type);
    if(child)
    {
        if (child != null && !child.killed) {
            var pid=child.pid;
            child.kill();
        }
    }else{
        child = child_process.fork("" + (path.join(__dirname, './node_modules/.bin/electron')), [__dirname, "--dev-mode"], {
            cwd: __dirname,
            env: process.env
        });
    }
  } );


});
