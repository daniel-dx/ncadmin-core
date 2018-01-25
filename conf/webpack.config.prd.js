var path = require('path');
var webpack = require('webpack');

var config = require('./config');

// webpack.config.js
module.exports = {

  entry: {
    'vue-component': path.join(config.src, 'components', 'index.js')
  },

  output: {
    path: config.dist,
    filename: '[name].min.js',
  },

  plugins: [
    // compress js
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
