/**
 * Created by danding on 17/2/19.
 */
var webpack = require('webpack');
var HasteResolverPlugin = require('haste-resolver-webpack-plugin');
var path=require('path');

var IP = '0.0.0.0';
var PORT = 3001;
module.exports = {
    devtool: 'source-map',
    ip: IP,
    port: PORT,
    entry: {
        app: ['webpack/hot/dev-server', path.join( '../index.web')]
    },

    output: {
        path: '/preview',
        filename: 'bundle.js',
        publicPath: 'http://localhost:3001/build/'
    },

    resolve: {
        alias: {
            'react-native': 'react-web'
        }
    },
    devServer: {
        hot:true,
        contentBase: './preview',
        publicPath: 'http://localhost:3001/build/'
    },
    module: {
        loaders: [
            {test: /\.js?$/, loader: 'babel-loader', exclude: /node_modules/},
            {
                test: /\.jsx?$/,
                loaders: ['babel?presets[]=es2015,presets[]=react,presets[]=stage-0'],
                exclude: /node_modules/
            },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(png|svg)$/, loader: "url-loader?limit=100000" },
            { test: /\.jpg$/, loader: "file-loader" },
            { test: /\.txt$/, loader: "raw-loader" },
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader'}
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$")),
        new HasteResolverPlugin({
            platform: 'web',
            nodeModules: ['react-web']
        })
    ]
}
