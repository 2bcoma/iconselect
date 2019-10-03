const path = require('path');
const WebPackBar = require('webpackbar');

const entry = path.join(__dirname, './lib/control/iconselect.js');
const outputPath = path.join(__dirname, './dist');

const devServer = {
  noInfo: true,
  stats: 'minimal'
}

module.exports = {
  node: {
    fs: 'empty',
  },
  entry,
  output: {
    path: outputPath,
    filename: 'iconselect.min.js',
    library: 'iconselect',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader' },
      { test: /\.css/, use: ['style-loader', 'css-loader'] },
    ]
  },
  plugins: [
    new WebPackBar(),
  ],
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
    ],
  },
  devServer,
};
