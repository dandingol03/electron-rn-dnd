var gulp = require('gulp');
var gutil = require("gulp-util");
var webpack = require('webpack');
var webpackConfig=require('../webpack.web.js');
var WebpackDevServer = require("webpack-dev-server");
var HasteResolverPlugin = require('haste-resolver-webpack-plugin');
gulp.task('default', function() {


    var myConfig = Object.create(webpackConfig);
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                // This has effect on the react lib size
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$")),
        new HasteResolverPlugin({
            platform: 'web',
            nodeModules: ['react-web']
        })
    );

    gutil.log("output====", myConfig.output.publicPath);

    new WebpackDevServer(webpack(webpackConfig), {
        publicPath: '/build',
        stats: {
            colors: true
        }
    }).listen(3001, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:3001/build/index.html");
    });

    // var compiler = webpack({
    //
    // });


    // return gulp.src('../index.web.js')
    //     .pipe(webpack(require('../webpack.web.js')))
    //     .pipe(gulp.dest('build/'));
});
