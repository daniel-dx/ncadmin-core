var gulp = require('gulp');
var path = require('path');
var rm = require('rimraf');
var fs = require('fs');
var webpack = require('webpack');
var notify = require('gulp-notify');
var gulpSequence = require('gulp-sequence');
var childProcess = require('child_process');
var url = require('url');
var querystring = require('querystring');
var browserSync = require('browser-sync').create();

var config = require('./conf/config');
var webpackConfig = require('./conf/webpack.config');


var reload = browserSync.reload;

/* ====================== functions ====================== */

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'compile error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end');
}

function exec(cmd) {
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

/* ====================== gulp tasks ====================== */

gulp.task('webpack', done => {
  webpack(webpackConfig, err => {
    if (err) {
      handleErrors();
    }
    done();
  });
});

gulp.task('clean', next => {
  rm(config.dist, () => next());
});

gulp.task('watch', () => {
  gulp.watch(path.join(config.src, '**/*.*'), () => {
    gulpSequence('webpack')(err => { !err && reload(); });
  });
});

gulp.task('serve', () => {

  function startServer() {
    delete require.cache[require.resolve('./mock/data')];
    var mockConfig = require('./mock/data');
    browserSync.init({
      server: '.',
      index: 'examples/index.html',
      port: 3000,
      logLevel: 'debug',
      logPrefix: 'VC',
      open: true,
      middleware: Object.keys(mockConfig).map(route => {
        return {
          route: route,
          handle: (req, res) => {
            var body = [];
            req.on('data', function(chunk) {
              body.push(chunk);
            }).on('end', function() {
              body = JSON.parse(Buffer.concat(body).toString() || '{}');
              var query = querystring.parse(url.parse(req.url).query);
              var params = Object.assign(body, query);
              var resData = typeof mockConfig[route] === 'function' ? mockConfig[route](params) : mockConfig[route];
              res.write(typeof resData === 'string' ? resData : JSON.stringify(resData));
              res.end();
            });
          }
        }
      })
    });
  }

  startServer();

  gulp.watch(path.join(config.root, 'mock/data.js')).on('change', () => {
    browserSync.exit();
    startServer();
  });
});

gulp.task('build', gulpSequence('clean', ['webpack']));

gulp.task('publish', () => {
  exec('mv .npmrc .temp_npmrc').then(() => {
    console.info('building...');
    return exec('npm run release');
  }).then(() => {
    console.info('publish...');
    return exec('npm publish');
  }).then(() => {
    console.info('publish success!');
    return exec('mv .temp_npmrc .npmrc')
  }).catch(err => {
    console.error('publish failed.', err);
    return exec('mv .temp_npmrc .npmrc')
  })
});

gulp.task('dev', gulpSequence('build', ['serve', 'watch']));


