var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var preprocess = require('gulp-preprocess');
var process = require('process');
var livereload = require('gulp-livereload');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');
var inject = require("gulp-inject");

var build_options = {
	'isDev': true
};

var external_libraries = [
	'jquery', 'angular', 'flux'
];

gulp.task('build:vendor', function() {
	gulp.src('./app/noop.js', {read: false})
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

gulp.task('build:app', function() {
	gulp.src('./app/main.js', {read: false})
		.pipe(browserify({
			transform: [],
			debug: process.env.NODE_ENV != 'production'
		}))
		.on('prebundle', function(bundle) {
			external_libraries.forEach(function(lib) {
				bundle.external(lib);
			});
		})
		.on('error', function(err) {console.error(err)})
		.pipe(rename('app.js'))
		.pipe(gulp.dest('./build'));
});

gulp.task('move:css', function() {
  gulp.src('./app/app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./build'));
});

gulp.task('move:html', function() {
  var jsFiles = gulp.src('./app/static/gscflux/**/*.js', {read: false});

	gulp.src('./app/index.html')
		.pipe(preprocess({
			context: build_options
		}))
    .pipe(inject(jsFiles, {
      transform: function(filepath, file, i, length) {
        return '<script src="' +filepath.slice( "/app/static".length )+ '"></script>';
      }
    }))
		.pipe(gulp.dest('./build'));
});

gulp.task('move:static', function() {
  gulp.src('./app/static/**/*')
    .pipe(gulp.dest('./build'));

  gulp.src('./bower_components/**/*')
    .pipe(gulp.dest('./build/bower_components'));
});


gulp.task('serve', function() {
	gulp.src('./build')
		.pipe(webserver({
			port: process.env.PORT || 8000
		}));
  livereload.listen();
});

gulp.task('watch', function() {
	var watch = function(path, task) {
		gulp.watch(path, function(events) {
			console.log(events.path + ' changed. running task ' + task + '.');
			gulp.start(task);
			livereload.changed(events.path);
		}).on('change', function(file) {
		});
	};

	watch('./app/index.html', 'move:html');
	watch('./app/**/*.js', 'build:app');
	watch('./app/app.scss', 'move:css');
});

gulp.task('build', ['build:vendor', 'build:app']);
gulp.task('move', ['move:static', 'move:css', 'move:html']);
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
