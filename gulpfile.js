// gulp components
const gulp = require('gulp');

// use gulp-load-plugins to avoid extraneous import code
const $ = require('gulp-load-plugins')({
	lazy: true,
});

// other js components
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngcrush = require('imagemin-pngcrush');
const browserSync = require('browser-sync').create();

const reload = browserSync.reload;

// Default task
gulp.task('default', function() {
	console.log('Gulp is installed and runnable.');
});

/******
*
* HTML / Pug Tasks
*
******/

// compile pug to HTML
gulp.task('compile-html', function() {
	return gulp.src('./src/pug/**/index.pug')
		.pipe($.plumber(plumberErrorHandler))
		.pipe($.pug({}))
		.pipe(gulp.dest('./'));

		cb(err);
});

/******
*
* CSS / Stylus Tasks
*
******/

// stylus linting
gulp.task('vet-stylus', function() {
	return gulp.src('./src/styl/**/*.styl')
		.pipe($.plumber(plumberErrorHandler))
		.pipe($.stylint())
		.pipe($.stylint.reporter())
		.pipe($.stylint.reporter('fail')); // the gulp-process should fail if there are linting errors

		cb(err);
});

// compile the stylus files into style.css and set up sourcemaps
// files must pass linting before they will compile
gulp.task('compile-stylus', ['vet-stylus'], function() {
	return gulp.src('./src/styl/style.styl')
		.pipe($.plumber(plumberErrorHandler))
		.pipe($.sourcemaps.init()) // using external sourcemap
		.pipe($.stylus({}))
		.pipe($.sourcemaps.write('.')) // write to sourcemap
		.pipe(gulp.dest('./assets/css'));

		cb(err);
});

// autoprefix the CSS file
gulp.task('autoprefix-css', ['compile-stylus'], function() {
	return gulp.src('./assets/css/style.css')
		.pipe($.plumber(plumberErrorHandler))
		.pipe($.sourcemaps.init())
		.pipe($.autoprefixer({
			browsers: ['last 8 versions']
		}))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('./assets/css'));

		cb(err);
});

// minify the CSS file
// this vets, compiles & autoprefixes before minifying
gulp.task('minify-css', ['autoprefix-css'], function() {
	return gulp.src('./assets/css/style.css')
		.pipe($.plumber(plumberErrorHandler))
		.pipe($.cssmin())
		.pipe(gulp.dest('./assets/css'));

		cb(err);
});

// master CSS task to do all CSS tasks
gulp.task('master-css', ['minify-css']);

/******
*
* Javascript / Babel Tasks
*
******/

// lint javascript
gulp.task('lint-javascript', function() {
	return gulp.src('./src/js/**/*.js')
		.pipe($.plumber(plumberErrorHandler))
		.pipe($.eslint())
		.pipe($.eslint.failOnError());

		cb(err);
});

// compile/transpile javascript, including modules
gulp.task('compile-javascript', ['lint-javascript'], function() {

	return browserify({entries: './src/js/main.js', debug: true})
		.transform('babelify', {
			presets: ['env']
		})
		.bundle()
		.pipe($.plumber(plumberErrorHandler))
		.pipe(source('main.js'))
		.pipe(gulp.dest('./assets/js'));

		cb(err);
});

// minify/uglify the javascript
gulp.task('compress-javascript', ['compile-javascript'], function() {
	return gulp.src('./assets/js/main.js')
		.pipe($.plumber(plumberErrorHandler))
		.pipe($.uglify())
		.pipe(gulp.dest('./assets/js'));

		cb(err);
});

// master JS task to do all JS tasks
gulp.task('master-js', ['compress-javascript']);

/******
*
* Performance - Misc.
*
******/

// image optimization
gulp.task('compress-images', function() {
	return gulp.src('./src/img/*')
		.pipe($.plumber(plumberErrorHandler))
		.pipe($.changed('./assets/img'))
		.pipe($.cache(
			$.imagemin(
				[
					$.imagemin.gifsicle(),
					imageminJpegRecompress(),
					imageminPngcrush(),
					$.imagemin.svgo()
				], {
					verbose: true
				}
			)
		))
		.pipe(gulp.dest('./assets/img'));

		cb(err);
});

/******
*
* Browsersync + Watch Tasks
*
******/

gulp.task('js-watch', ['compile-javascript'], function(done) {
	browserSync.reload();
	done();
});

gulp.task('stylus-watch', ['autoprefix-css'], function(done) {
	browserSync.reload();
	done();
});

gulp.task('img-watch', ['compress-images'], function(done) {
	browserSync.reload();
	done();
});

gulp.task('pug-watch', ['compile-html'], function(done) {
	browserSync.reload();
	done();
});

// master watch tasks
gulp.task('watch', ['compile-javascript', 'autoprefix-css', 'compress-images', 'compile-html'], function() {
	browserSync.init({
		server: {
			baseDir: './'
		}
	});

	gulp.watch('./src/styl/**/*.styl', ['stylus-watch']);
	gulp.watch('./src/js/**/*.js', ['js-watch']);
	gulp.watch('./src/img/*', ['img-watch']);
	gulp.watch('./src/pug/**/*.pug', ['pug-watch']);
});

/******
*
* Dev & Build Scripts
*
******/

// dev script to monitor files, update as needed, and refresh the browser
// just an alias of 'watch' for familiarity of naming conventions
gulp.task('dev', ['watch'])


// build script to prep all files for deployment
gulp.task('build', ['master-css', 'master-js', 'compile-html', 'compress-images'])


/******
*
* Utility Functions
*
******/

// error handler for any errors occurring while using gulp-plumber
const plumberErrorHandler = {
	errorHandler: $.notify.onError({ // use gulp-notify to send system notifications w/ error messages so that terminal doesn't have to be open to see issues
		title: 'Gulp',
		message: 'Error: <%= error.message %>'
	})
};