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
var runSequence = require('run-sequence');

var build_options = {
	'isDev': true
};

var external_libraries = [
 'events', 'jquery', 'angular', 'flux'
];

// glob for app ts
var app_ts_glob = ['./app/gscflux/**/*.ts', '!./app/gscflux/**/*.spec.ts', '!./app/gscflux/**/*.d.ts'];
var app_specs_glob = ['./app/gscflux/**/*.spec.ts', '!./app/gscflux/**/*.spec.d.ts'];
var app_scss_glob = ['./app/app.scss'];

// bundles node dependencies to vendor.js
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
		.pipe(gulp.dest('./app'));
});

// bundles main.js (consumes vendor dependencies) to bundle.js
gulp.task('build:mainjs', function() {
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

// bundles app.scss to app.css
gulp.task('build:scss', function() {
  return gulp.src(app_scss_glob)
    .pipe(sass())
    .on('error', gutil.log)
    .pipe(gulp.dest('./app'));
});

// bundles all the typescript files, avoiding the spec and declaration files into application-bundle.js
gulp.task('build:ts', function() {
  return gulp.src(app_ts_glob, {read: false})
    .pipe(typescript({
      module: 'commonjs',
      sourcemap: true,
      declaration: true,
      out: 'application-bundle.js',
      outDir: './app/gscflux/'
    })).on('error', gutil.log)
    .pipe(gulp.dest('./app/gscflux/'));
});

// builds all the spec files, ignoring the declarations into tests-bundle.js
gulp.task('build:specs', function() {
  return gulp.src(app_specs_glob, {read: false})
    .pipe(typescript({
      module: 'commonjs',
      sourcemap: true,
      declaration: true,
      out: 'tests-bundle.js',
      outDir: './app/gscflux/'
    })).on('error', gutil.log)
    .pipe(gulp.dest('./app/gscflux'));
});

// moves and preprocesses the main html file
gulp.task('move:index.html', function() {
  gulp.src('./app/index.html')
    .pipe(preprocess({
      context: build_options
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./build'));
});

gulp.task('move:css', function() {
  return gulp.src(['./app/app.css']).pipe(gulp.dest('./build'));
});

gulp.task('move:vendor', function() {
  return gulp.src(['./app/vendor.js']).pipe(gulp.dest('./build'));
});

gulp.task('move:bundle', function() {
  return gulp.src(['./app/bundle.js']).pipe(gulp.dest('./build'));
});

gulp.task('move:gscflux:ts', function() {
  return gulp.src(['./app/gscflux/application-bundle.js*', './app/gscflux/**/*.ts', '!./app/gscflux/**/*.d.ts', '!./app/gscflux/**/*.spec.ts'])
    .pipe(gulp.dest('./build/gscflux'));
});

gulp.task('move:gscflux:other', function() {
  return gulp.src(['./app/gscflux/tabs/gscTabs.js', './app/gscflux/**/*.spec.ts', '!./app/gscflux/**/*.ts'])
    .pipe(gulp.dest('./build/gscflux'));
});

gulp.task('move:gscflux:specs', function(){
  gulp.src('./app/gscflux/tests-bundle.js*')
    .pipe(gulp.dest('./build/gscflux'));
});

gulp.task('move:gscflux:html', function() {
  return gulp.src('./app/gscflux/**/*.html')
    .pipe(gulp.dest('./build/gscflux'));
});

gulp.task('serve', function() {
  return gulp.src('./build')
    .pipe(webserver({
      port: process.env.PORT || 8000
    }));
});

gulp.task('watch', function() {
  livereload.listen(build_options.REFRESH_PORT || 8001);
  livereload.changed();
  var update_livereload = function(update) {
    return function() {
      livereload.changed(update.path, build_options.REFRESH_PORT || 8001);
    }
  };

  gulp.watch('./app/main.js', function(update) {
    if (update.type == 'changed') {
      console.log('changed: ' + update.path);
      runSequence('build:mainjs', 'move:bundle', update_livereload(update));
    }
  });

  gulp.watch(app_scss_glob, function(update) {
    if (update.type == 'changed') {
      console.log('changed: ' + update.path);
      runSequence('build:scss', 'move:css', update_livereload(update));
    }
  });

  gulp.watch(app_specs_glob, function(update) {
    if (update.type == 'changed') {
      console.log('changed: ' + update.path);
      runSequence('build:specs', 'move:gscflux:specs');
    }
  });

  gulp.watch(app_ts_glob, function(update) {
    if (update.type == 'changed') {
      console.log('changed: ' + update.path);
      runSequence('build:ts', 'move:gscflux:ts', update_livereload(update));
    }
  });

  gulp.watch('./app/index.html', function(update) {
    if (update.type == 'changed') {
      console.log('changed: ' + update.path);
      runSequence('move:index.html', update_livereload(update));
    }
  });

  gulp.watch('./app/gscflux/**/*.html', function(update) {
    if (update.type == 'changed') {
      console.log('changed: ' + update.path);
      runSequence('move:gscflux:html', update_livereload(update));
    }
  })
});

gulp.task('main', function(cb) {
  return runSequence(
    ['build:vendor', 'build:mainjs', 'build:scss', 'build:specs', 'build:ts'],
    [
      'move:index.html',
      'move:css',
      'move:vendor',
      'move:bundle',
      'move:gscflux:ts',
      'move:gscflux:other',
      'move:gscflux:specs',
      'move:gscflux:html'
    ],
    'watch', 'serve', cb);
});

gulp.task('default', function() {
	build_options.isDev = process.env.NODE_ENV != 'production';
	console.log("running in " + (build_options.isDev ? 'development mode' : 'production mode'));
  build_options.REFRESH_PORT = process.env.REFRESH_PORT || 8001;
	if (build_options.isDev) {
    build_options.isDev = true;
    runSequence('main');
  }
  else {
    build_options.isDev = false;
    runSequence('main');
  }
});
