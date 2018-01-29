var path = require('path');
var webpack = require('webpack');

var config = require('./config');

// webpack.config.js
module.exports = {
  entry: {
    'detail': path.join(config.src, 'components', 'detail', 'index.vue'),
    'detailModal': path.join(config.src, 'components', 'detail-modal', 'index.vue'),
    'editModal': path.join(config.src, 'components', 'edit-modal', 'index.vue'),
    'edit': path.join(config.src, 'components', 'edit', 'index.vue'),
    'list': path.join(config.src, 'components', 'list', 'index.vue'),
    'modal': path.join(config.src, 'components', 'modal', 'index.vue'),
    'label': path.join(config.src, 'components', 'widgets', 'label', 'index.vue'),
    // Don't touch me - components

    // Don't touch me - directives
  },

  output: {
    path: config.dist,
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue',
        include: [config.src].concat(config.vueModules)
      },
      {
        test: /\.js$/,
        loader: 'babel!eslint',
        include: [config.src].concat(config.babelModules)
      },
      {
        // edit this for additional asset file types
        test: /\.(png|jpg|gif)$/,
        loader: 'url',
        query: {
          // inline files smaller then 10kb as base64 dataURL
          limit: 10000,
          // fallback to file-loader with this naming scheme
          name: 'img/[name].[ext]'
        },
        include: [config.src].concat(config.vueModules)
      }
    ]
  },

  vue: {
    loaders: {
      js: 'babel!eslint'
    }
  },
  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime']
  }
};
