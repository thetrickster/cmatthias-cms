var gulp    = require('gulp');
var cp      = require('child_process');
var browser = require('browser-sync');
// var mq      = require('media-query-extractor');

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
    return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--force_polling', '-c', '_config.yml,_config_dev.yml'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Build the Jekyll Site incrementally while in dev
 */
gulp.task('jekyll-build-prod', function (done) {
    browser.notify(messages.jekyllBuild);
    return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--force_polling'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browser.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['extract-mq', 'jekyll-build'], function() {
    browser({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Import content from contentful via Rakefile
 */
gulp.task('contentful', function (done) {
    browser.notify(messages.jekyllBuild);
    return cp.spawn('bundle', ['exec', 'jekyll', 'contentful'], {stdio: 'inherit'})
        .on('close', done);
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
        // .pipe(gulp.dest('_site/assets/css'))
        .pipe(gulp.dest('assets/css'))
        .pipe(browser.reload({stream:true}));
});

/**
 * Head Scripts
 */
gulp.task('scripts-head', function() {
  return gulp.src('assets/js/modernizr.min.js')
        .pipe($.rename('scripts_head.js'))
        .pipe(gulp.dest('_site/assets/js'))
        .pipe(gulp.dest('assets/js'));
});

/**
 * Look for and extract media queries from final css file into
 * separate files
 */
gulp.task('extract-mq', ['sass'], function() {
  return gulp.src('assets/css/app.css')
         .pipe($.rename('styles.css'))
         .pipe($.extractMediaQueries())
         .pipe(gulp.dest('_site/assets/css'));
  // mq('assets/css/app.css', '_site/assets/css/styles.css', [
  //   'screen and (min-width: 40em)|_site/assets/css/medium.css',
  //   'screen and (min-width: 64em)|_site/assets/css/large.css',
  //   'screen and (min-width: 75em)|_site/assets/css/xlarge.css'
  // ]);
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(['assets/scss/**/*.scss'], ['extract-mq']);
    gulp.watch(['*.html', '_includes/**/*.html', '_layouts/*.html', '_posts/*', '_data/*'], ['jekyll-rebuild']);
});

/**
 * Add a build command to build our site for production
 */
gulp.task('build', ['contentful', 'extract-mq', 'jekyll-build-prod']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
