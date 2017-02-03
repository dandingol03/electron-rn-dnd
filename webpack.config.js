var webpack = require('webpack');

module.exports = {
  entry: {
    app: ['webpack/hot/dev-server', './web/src/entry.jsx']
  },

  output: {
    path: './public/build',
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/build/'
  },

  devServer: {
    contentBase: './public',
    publicPath: 'http://localhost:8080/build/'
  },

  module: {
    loaders: [
      {test: /\.js?$/, loader: 'babel-loader', exclude: /node_modules/, query: {presets: ['react', 'es2015']}},
        { test: /\.jsx$/, loader: 'jsx-loader?insertPragma=React.DOM&harmony'},
        { test: /\.css$/, loader: 'style-loader!css-loader' },
        { test: /\.less$/, loader: 'style-loader!css-loader!less-loader'}
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$"))
  ]
}
