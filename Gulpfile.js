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

var build_options = {
	'isDev': true
};

var external_libraries = [
 'events', 'jquery', 'angular', 'flux'
];

gulp.task('build:vendor', function() {
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
		.pipe(gulp.dest('./build'));
});

gulp.task('build:app:js', function() {
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
		.pipe(rename('main.js'))
		.pipe(gulp.dest('./build'));
});

gulp.task('build:app:ts', function() {
  return gulp.src('./app/static/gscflux/**/*.ts', {read: false})
    .pipe(typescript())
    .pipe(gulp.dest('./build/gscflux/'));
});

gulp.task('move:scss', function() {
  return gulp.src('./app/app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./build'));
});

gulp.task('move:vendor', function() {
  return gulp.src('./bower_components/**/*')
    .pipe(gulp.dest('./build/bower_components'));
});

gulp.task('move:app', function() {
  return gulp.src(['!./app/static/**/*.ts','./app/static/**/*'])
    .pipe(gulp.dest('./build'));
});

gulp.task('move:html', ['build:app:js', 'build:app:ts', 'move:app'], function() {
  var jsFiles = gulp.src('./build/gscflux/**/*.js', {read: false});

	gulp.src('./app/index.html')
		.pipe(preprocess({
			context: build_options
		}))
    .pipe(inject(jsFiles, {
      transform: function(filepath, file, i, length) {
        return '<script src="' +filepath.slice( "/build".length )+ '"></script>';
      }
    }))
	.pipe(gulp.dest('./build'));
});

gulp.task('serve', ['move'], function() {
	gulp.src('./build')
		.pipe(webserver({
			port: process.env.PORT || 8000
		}));
  livereload.listen();
});

gulp.task('watch', ['main'], function() {
	gulp.watch(['./app/index.html'], ['move:html']);
	gulp.watch(['./app/**/*.js'], ['build:app:js']);
	gulp.watch(['./app/**/*.ts'], ['build:app:ts']);
	gulp.watch(['./app/**.*.scss'], ['move:scss']);
	gulp.watch(['./app/static/**/*.ts','./app/static/**/*'], ['move:app']);

	gulp.watch(['./build/**/*']).on('change', function(file) {
		livereload.changed(file.path)
	});
});

gulp.task('build:app', ['build:app:ts', 'build:app:js']);

gulp.task('build', ['build:vendor', 'build:app']);
gulp.task('move', ['move:vendor', 'move:app', 'move:scss', 'move:html']);

gulp.task('main', ['build', 'move', 'serve']);

gulp.task('dev', function() {
	build_options.isDev = true;
	gulp.start(['main', 'watch']);
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
