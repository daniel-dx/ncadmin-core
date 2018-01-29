var path = require('path');
var webpack = require('webpack');

var config = require('./config');

// webpack.config.js
module.exports = {

  entry: {
    'ncadmin-core': path.join(config.src, 'components', 'index.js')
  },

  output: {
    path: config.dist,
    filename: '[name].min.js',
    sourceMapFilename: '[file].map',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  externals: {
    'vue': {
      root: 'Vue',
      commonjs2: 'vue',
      commonjs: 'vue',
      amd: 'vue'
    },
    'axios': {
      root: 'axios',
      commonjs2: 'axios',
      commonjs: 'axios',
      amd: 'axios'
    }
  },

  plugins: [
    // compress js
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // })
  ]
};
