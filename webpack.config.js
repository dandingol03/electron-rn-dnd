var webpack = require('webpack');
var path=require('path')
module.exports = {
  entry: {
    app: ['webpack/hot/dev-server', './web/src/index.jsx']
  },

  output: {
    path: './public/build',
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/build/'
  },

    devtool: "cheap-module-eval-source-map",

  devServer: {
    contentBase: './public',
    publicPath: 'http://localhost:8080/build/'
  },

  module: {
    loaders: [
      {test: /\.js?$/, loader: 'babel-loader', exclude: /node_modules/},
        { test: /\.jsx?$/, loader:  'babel-loader', exclude: /node_modules/},
        { test: /\.css$/, loader: 'style-loader!css-loader' },
        { test: /\.(png|svg)$/, loader: "url-loader?limit=100000" },
        { test: /\.jpg$/, loader: "file-loader" },
        { test: /\.txt$/, loader: "raw-loader" },
        { test: /\.less$/, loader: 'style-loader!css-loader!less-loader'}
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$"))
  ]
}
