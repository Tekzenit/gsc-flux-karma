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
		.pipe(gulp.dest('./build'));
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
    .pipe(gulp.dest('./build'));
});

gulp.task('build:scss', [], function() {
  return gulp.src('./app/app.scss')
    .pipe(sass())
    .on('error', gutil.log)
    .pipe(gulp.dest('./build'));
});


gulp.task('build:ts', function() {
  return gulp.src(['./app/gscflux/**/*.ts', '!./app/gscflux/**/*.spec.ts', '!./app/gscflux/**/*.d.ts'], {read: false})
    .pipe(typescript({
      module: 'commonjs',
      sourcemap: true,
      declaration: true,
      out: 'application-concat.js',
      outDir: './app/gscflux'
    })).on('error', gutil.log)
    .pipe(gulp.dest('./build/gscflux/'));
});

gulp.task('index.html', [], function() {
  gulp.src('./app/index.html')
    .pipe(preprocess({
      context: build_options
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./build'));
});

gulp.task('build:copy', function() {
  return gulp.src(['./app/gscflux/**/*.html', './app/gscflux/tabs/gscTabs.js']).pipe(gulp.dest('./build/gscflux'));
})

gulp.task('build:specs', function() {
  return gulp.src(['./build/gscflux/application-concat.d.ts']).pipe(gulp.dest('./app/gscflux')).on('end', function() {
    return gulp.src(['./app/gscflux/**/*.spec.ts', '!./app/gscflux/**/*.spec.d.ts'], {read: false})
      .pipe(typescript({
        module: 'commonjs',
        sourcemap: true,
        out: 'tests-concat.js'
      })).on('error', gutil.log)
      .pipe(gulp.dest('./build/gscflux'));
  });
});
// watch for specs to change. if changed, update in app and pipe to build
gulp.task('watch:tests', function() {
  return gulp.watch(['./app/gscflux/**/*.spec.ts', '!./app/gscflux/**/*.spec.d.ts'], ['build:specs']);
});

// precondition: main.js is ran separately
// builds the specs file, begin watch and start karma
gulp.task('test', ['build:specs','watch:tests'], function() {
});

gulp.task('watch', function() {
  gulp.watch(['./app/gscflux/**/*.ts','!./app/gscflux/**/*.spec.ts','!./app/gscflux/**/*.d.ts'], ['build:ts']);
  gulp.watch('./app/style.scss', ['build:scss']);
  gulp.watch('./app/main.js', ['build:mainjs']);
  gulp.watch('./app/index.html', ['index.html']);
});

gulp.task('main', ['build:vendor', 'build:mainjs', 'build:scss', 'build:copy', 'build:ts', 'index.html']);

gulp.task('serve', ['main','watch','test'], function() {
  gulp.src('./build')
    .pipe(webserver({
      port: process.env.PORT || 8000
    }));
  livereload.listen();
});

gulp.task('dev', function() {
	build_options.isDev = true;
	gulp.start(['serve']);
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
