var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var preprocess = require('gulp-preprocess');
var process = require('process');
var livereload = require('gulp-livereload');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');
var inject = require("gulp-inject");
var typescript = require('gulp-tsc');
var gutil = require('gulp-util');
var karma = require('karma').server;
var debug = require('gulp-debug');
var clean = require('gulp-clean');

var build_options = {
	'isDev': true
};

var external_libraries = [
 'events', 'jquery', 'angular', 'flux'
];

gulp.task('build:vendor', [],  function() {
	return gulp.src('./app/noop.js', {read: false})
		.pipe(browserify({
			debug: process.env.NODE_ENV != 'production'
		}))
		.on('prebundle', function(bundle) {
			external_libraries.forEach(function(lib) {
				bundle.require(lib);
			});
		})
		.pipe(rename('vendor.js'))
		.pipe(gulp.dest('./app'));
});

gulp.task('build:mainjs', [], function() {
  return gulp.src('./app/main.js', {read: false})
    .pipe(browserify({
      debug: process.env.NODE_ENV != 'production'
    }))
    .on('prebundle', function(bundle) {
      external_libraries.forEach(function(lib) {
        bundle.external(lib);
      });
    })
    .on('error', function(err) {console.error(err)})
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./app'));
});

gulp.task('build:scss', [], function() {
  return gulp.src('./app/app.scss')
    .pipe(sass())
    .on('error', gutil.log)
    .pipe(gulp.dest('./app'));
});


gulp.task('clean-app', function() {
  return gulp.src(['./app/gscflux/application-concat.*']).pipe(clean());
});
gulp.task('build:ts', function() {
  return gulp.src(['./app/gscflux/**/*.ts', '!./app/gscflux/**/*.spec.ts'], {read: false})
    .pipe(typescript({
      module: 'commonjs',
      sourcemap: true,
      declaration: true,
      out: 'application-concat.js',
      outDir: './app/gscflux'
    })).on('error', gutil.log)
    .pipe(gulp.dest('./app/gscflux/'));
});

gulp.task('index.html', [], function() {
  gulp.src('./app/_index.html')
    .pipe(preprocess({
      context: build_options
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./app'));
});

gulp.task('build:specs', function() {
  return gulp.src(['./app/gscflux/**/*.spec.ts'], {read: false})
    .pipe(typescript({
      module: 'commonjs',
      sourcemap: true,
      out: 'tests-concat.js'
    })).on('error', gutil.log)
    .pipe(gulp.dest('./app/gscflux'));
});


// watch for specs to change. if changed, update in app and pipe to build
gulp.task('watch:tests', function() {
  return gulp.watch(['./app/gscflux/**/*.spec.ts'], ['build:specs']);
});

// precondition: main.js is ran separately
// builds the specs file, begin watch and start karma
gulp.task('test', ['build:specs', 'watch:tests'], function() {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, function(exit) {
    console.log('karma exited with code ' + exit);
  });
});

gulp.task('watch', function() {
  gulp.watch('./app/gscflux/**/*.ts', ['build:ts']);
  gulp.watch('./app/style.scss', ['build:scss']);
  gulp.watch('./app/main.js', ['build:mainjs']);
  gulp.watch('./app/index.html', ['index.html']);
});

gulp.task('serve', ['main','watch'], function() {
  gulp.src('./app')
    .pipe(webserver({
      port: process.env.PORT || 8000
    }));
  livereload.listen();
});



gulp.task('_main', ['clean-app'], function() {
  gulp.start(['build:vendor', 'build:mainjs', 'build:scss', 'build:ts', 'index.html']);
});
gulp.task('main', ['_main']);

gulp.task('dev', function() {
	build_options.isDev = true;
	gulp.start(['serve', 'watch']);
});

gulp.task('production', function() {
	build_options.isDev = false;
	gulp.start(['main']);
});

gulp.task('default', function() {
	build_options.isDev = process.env.NODE_ENV != 'production';
	console.log("running in " + (build_options.isDev ? 'development mode' : 'production mode'));
	gulp.start((build_options.isDev ? 'dev' : 'production'));
});
