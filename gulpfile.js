var gulp    = require('gulp');
var cp      = require('child_process');
var browser = require('browser-sync');
var mq      = require('media-query-extractor');

var $     = require('gulp-load-plugins')({
  pattern: ['*', 'gulp-*', 'gulp.*']
});


var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

var sassPaths = [
  'assets/scss',
  'assets/vendor/foundation-sites/scss',
  'assets/vendor/motion-ui/src',
  'assets/fonts/league-spartan'
];

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browser.notify(messages.jekyllBuild);
    return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Build the Jekyll Site incrementally while in dev
 */
gulp.task('jekyll-incremental', function (done) {
    browser.notify(messages.jekyllBuild);
    return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--incremental'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-incremental'], function () {
    browser.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browser({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('assets/scss/app.scss')
        .pipe($.sass({
            includePaths: sassPaths,
            onError: browser.notify
        })
          .on('error', $.sass.logError))
        .pipe($.autoprefixer({
          // browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
          browsers: ['last 2 versions', 'ie >= 9'],
          cascade: true
        }))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browser.reload({stream:true}))
        .pipe(gulp.dest('assets/css'));
});

/**
 * Head Scripts
 */
gulp.task('scripts-head', function() {
  return gulp.src('./assets/js/modernizr.min.js')
        .pipe($.rename('scripts_head.js'))
        .pipe(gulp.dest('./_site/assets/js'))
        .pipe(gulp.dest('./assets/js'));
});

/**
 * Revision asset files in the source dir and write a manifest file
 */
gulp.task('revision', function() {
  // return gulp.src(['assets/css/app.css', 'assets/js/all.js', 'assets/img/**'])
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(['assets/scss/*.scss'], ['sass']);
    gulp.watch(['assets/css/app.css', '*.html', '_layouts/*.html', '_posts/*', '_data/*'], ['jekyll-rebuild']);
});

/**
 * Add a build command to build our site for production
 */
gulp.task('build', ['sass','jekyll-build']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
