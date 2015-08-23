'use strict';

var plugins = require('gulp-load-plugins')();
var gulp = require('gulp');

// Loading CSS and LESS files 
gulp.src([
        "./src/videojs/video-js.css",
        "./src/videojs/skin/afterglow/vjs-afterglow.less"
    ])
 
    // Convert LESS files to CSS 
    .pipe(plugins.less())
 
    // Concatenate into a single large file 
    .pipe(plugins.concat("styles.css"))
 
    // Minify the CSS 
    .pipe(plugins.cssmin())
 
    // Now convert it to JavaScript and specify options 
    .pipe(plugins.css2js({
        splitOnNewline: false
    }))
 
    // Minify the JavaScript 
    .pipe(plugins.uglify())
 
    // Finally write it to our destination (./build/styles.js) 
    .pipe(gulp.dest("./dist/"));