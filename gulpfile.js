require('babel-polyfill');

const gulp = require('gulp');
const gutil = require('gulp-util');
const repl = require('repl');
const container = require('./src/container');
const init = require('./src/init');
const getServer = require('./src');

gulp.task('console', function() {
    gutil.log = gutil.noop;
    const replServer = repl.start({prompt: 'Application console > '});

    Object
        .keys(container)
        .forEach(function(key) {
            replServer.context[key] = container[key];
        });
});

gulp.task('init', function () {
    init();
    console.log('db was created');
});

gulp.task('server', function(cb)  {
    getServer().listen(process.env.PORT || 4000, cb);
});