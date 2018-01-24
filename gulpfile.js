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

function publish() {
  var pkg = require('./package.json');
  var [major, minor, revision] = pkg.version.split('.');
  pkg.version = [major, minor, parseInt(revision, 10) + 1].join('.'); // TODO Daniel: 暂时只自动更新最小版本
  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2), 'utf8');

  // Only tag on master branch
  childProcess.exec(`git checkout master && git pull origin master && gulp build && git add . && git commit -m "publish" && git push origin master && git tag ${pkg.version} && git push origin ${pkg.version}`);
}

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

gulp.task('publish', publish);

gulp.task('dev', gulpSequence('build', ['serve', 'watch']));


