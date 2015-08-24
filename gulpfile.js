'use strict';

var plugins = require('gulp-load-plugins')();
var gulp = require('gulp');
var tag_version = require('gulp-tag-version');
var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' * ',
  ' * <%= pkg.name %> includes some scripts provided under different licenses by their authors. Please see the project sources via <%= pkg.homepage %> in order to learn which projects are included and how you may use them.',
  ' */',
  ''].join('\n');

gulp.task('build', function(){
	// Loading LESS files 
	return gulp.src([
		"./src/videojs/skin/afterglow/vjs-afterglow.less",
		"./src/lightbox/afterglow-lightbox.less"
		])

	// Convert LESS files to CSS 
	.pipe(plugins.less())

	// Add normal css which doesn't need to be compiled
	.pipe(plugins.addSrc.prepend('./src/videojs/video-js.css'))
	
	// Minify the CSS 
	.pipe(plugins.cssmin())
	
	// Now convert it to JavaScript and specify options 
	.pipe(plugins.css2js({
		splitOnNewline: false
	}))

	// Add all the javascript files in the correct order
	.pipe(plugins.addSrc.append([
		'./src/dollardom/dollardom.min.js',
		'./src/videojs/video.js',
		]))
	.pipe(plugins.addSrc.append([
		'./src/videojs/ie8/videojs-ie8.js',
		'./src/videojs/plugins/videojs.hotkeys.js',
		'./src/videojs/plugins/Youtube.js',
		]))
	.pipe(plugins.addSrc.append([
		'./src/afterglow.js'
		]))

	// Concatenate into a single large file 
	.pipe(plugins.concat("afterglow.min.js"))
	
	// Minify the JavaScript 
	.pipe(plugins.uglifyjs())

	.pipe(plugins.header(banner, { pkg : pkg } ))
	
	// Finally write it to our destination (./dist/afterglow.min.js) 
	.pipe(gulp.dest("./dist/"));
});

function inc(importance) {
    // get all the files to bump version in 
    return gulp.src(['./package.json', './bower.json'])
        // bump the version number in those files 
        .pipe(plugins.bump({type: importance}))
        // save it back to filesystem 
        .pipe(gulp.dest('./'))
        // commit the changed version number 
        .pipe(plugins.git.commit('bumps package version'))
        // read only one file to get the version number 
        .pipe(plugins.filter('package.json'))
        // **tag it in the repository** 
        .pipe(tag_version());
}
 
gulp.task('patch', function() { return inc('patch'); })
gulp.task('feature', function() { return inc('minor'); })
gulp.task('release', function() { return inc('major'); })