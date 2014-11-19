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
var karma = require('gulp-karma');
var debug = require('gulp-debug');

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

gulp.task('build:app:ts:references', function() {

  var files = gulp.src(['!./app/static/gscflux/references.ts','./app/static/gscflux/**/*.ts']);

  gulp.src('./app/static/gscflux/references.ts').pipe(inject(files, {
    transform: function(filepath, file, i, length) {
      return '/// <reference path="' + filepath + '" />\n';
    },
    relative: true,
    starttag: '/* {{name}}:{{ext}} */',
    endtag: '/* endinject */'
  })).pipe(gulp.dest('./app/static/gscflux')).on('end', function() {

    var referenceFile = gulp.src('./app/static/gscflux/references.ts');

    gulp.src(['!./app/static/gscflux/references.ts','./app/static/gscflux/**/*.ts']).pipe(inject(referenceFile, {
      transform: function(filepath, file, i, length) {
        return '/// <reference path="' + filepath + '" />\n';
      },
      relative: true,
      starttag: '/* {{name}}:{{ext}} */',
      endtag: '/* endinject */'
    })).pipe(gulp.dest('./app/static/gscflux')).on('end', function() {
      console.log('over');
    });


  });
});

gulp.task('build:app:tests', function() {
  return gulp.src(['./app/static/gscflux/**/*.spec.ts'], {read: false})
    .pipe(typescript({
      module: 'commonjs',
      out: 'app.spec.js',
      sourcemap: true,
      outDir: './app/static/gscflux'
    })).on('error', gutil.log)
    .pipe(gulp.dest('./build/gscflux'));
});

gulp.task('build:app:ts', function() {
  return gulp.src(['./app/static/gscflux/**/*.ts', '!./app/static/gscflux/**/*.spec.ts'], {read: false})
    .pipe(typescript({
      module: 'commonjs',
      out: 'app.js',
      sourcemap: true,
      outDir: './app/static/gscflux'
    })).on('error', gutil.log)
    .pipe(gulp.dest('./build/gscflux'));
});

gulp.task('build:scss', function() {
  return gulp.src('./app/app.scss')
    .pipe(sass())
    .on('error', gutil.log)
    .pipe(gulp.dest('./build'));
});

gulp.task('move:vendor', function() {
  return gulp.src('./bower_components/**/*')
    .pipe(gulp.dest('./build/bower_components'));
});

gulp.task('move:static', function() {
  return gulp.src(['./app/static/**/*'])
    .pipe(gulp.dest('./build'));
});

gulp.task('move:html', ['move:static'], function() {
  var jsFiles = gulp.src(['!./build/gscflux/**/*.spec.js', './build/gscflux/**/*.js'], {read: false});

	gulp.src('./app/index.html')
		.pipe(preprocess({
			context: build_options
		}))
    .pipe(inject(jsFiles, {
      transform: function(filepath, file, i, length) {
        return '<script src="' +filepath.slice( "/build/".length )+ '"></script>';
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

gulp.task('changed:index:html', ['move:html'], function() {
  livereload.changed();
});

gulp.task('changed:static', ['move:static'], function() {
  livereload.changed();
});

gulp.task('changed:scss', ['build:scss'], function() {
  livereload.changed();
});

gulp.task('changed:typescript', ['build:app', 'move:static'], function() {

  gulp.src([
    'build/vendor.js',
    'build/main.js',
    'build/**/*.js',
    'build/**/*.spec.js'
  ]).pipe(karma({
    configFile: 'karma.conf.js',
    action: 'run'
  })).on('error', function() {
    console.log(arguments);
  });

  livereload.changed();
});

gulp.task('watch', ['main'], function() {
  gulp.watch(['./app/index.html'], ['changed:index:html']);
  gulp.watch(['./app/static/**/*.html'], ['changed:static']);
  gulp.watch(['./app/static/**/*.js'], ['changed:static']);
  gulp.watch(['./app/**/*.scss'], ['changed:scss']);
  gulp.watch(['./app/static/**/*.ts'], ['changed:typescript'])
});

gulp.task('build:app', ['build:app:ts', 'build:app:js', 'build:app:tests']);
gulp.task('build', ['build:scss', 'build:vendor', 'build:app']);
gulp.task('move', ['move:vendor', 'move:static', 'move:html']);

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
