require('babel-polyfill');

const gulp = ('gulp');
const gutil = ('gulp-util');
const repl = ('repl');
const container = ('./src/container');
const init = ('./src/init');
const getServer = ('./src');

gulp.task('console', () => {
    gutil.log = gutil.noop;
    const replServer = repl.start({prompt: 'Application console > '});

    Object
        .keys(container)
        .forEach((key) => {
            replServer.context[key] = container[key];
        });
});

gulp.task('init', async() => {
    await init();
    console.log('db was created');
});

gulp.task('server', (cb) => {
    getServer().listen(process.env.PORT || 4000, cb);
});