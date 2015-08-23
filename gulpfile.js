'use strict';

var plugins = require('gulp-load-plugins')();
var gulp = require('gulp');

gulp.task('build', function(){
	// Loading LESS files 
	return gulp.src([
        "./src/videojs/skin/afterglow/vjs-afterglow.less"
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
 
    // Finally write it to our destination (./dist/afterglow.min.js) 
    .pipe(gulp.dest("./dist/"));
});

// Get release taks
require('gulp-release-tasks')(gulp);
