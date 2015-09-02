'use strict';

var plugins = require('gulp-load-plugins')();
var gulp = require('gulp');
var del = require('del');
var fs = require('fs');
var release = require('gulp-github-release');
var getPackageJson = function () {
	return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

// General build task, cleans up after real build
gulp.task('build', ['build-afterglow'], function(){
	del(['./dist/tmp']);
});

// Helper task for building the release
gulp.task('build-afterglow', ['compilecomponents'], function(){

	var pkg = getPackageJson();
	var banner = ['/**',
	' * <%= pkg.name %> - <%= pkg.description %>',
	' * @link <%= pkg.homepage %>',
	' * @version <%= pkg.version %>',
	' * @license <%= pkg.license %>',
	' * ',
	' * <%= pkg.name %> includes some scripts provided under different licenses by their authors. Please see the project sources via <%= pkg.homepage %> in order to learn which projects are included and how you may use them.',
	' */',
	''].join('\n');

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
		'./src/lib/afterglow-lib.js',
		'./src/videojs/video.js',
		]))
	.pipe(plugins.addSrc.append([
		'./dist/tmp/components.js',
		'./src/videojs/plugins/videojs.hotkeys.js',
		'./src/videojs/plugins/Youtube.js',
		]))
	.pipe(plugins.addSrc.append([
		'./src/afterglow.js'
		]))

	// Concatenate into a single large file 
	.pipe(plugins.concat("afterglow.min.js"))
	
	// Minify the JavaScript 
	.pipe(plugins.uglify().on('error', plugins.util.log))

	.pipe(plugins.header(banner, { pkg : pkg } ))
	
	// Finally write it to our destination (./dist/afterglow.min.js) 
	.pipe(gulp.dest("./dist/"));
});

// Task to compile ES6 components
gulp.task('compilecomponents', function(){
	return gulp.src([
		'./src/videojs/components/TopControlBar.js',
		'./src/videojs/components/LightboxCloseButton.js'
		])
	.pipe(plugins.browserify2({
		fileName: 'components.js',
		transform: require('6to5ify'),
		options: {
			debug: false
		}
	}))
	.pipe(gulp.dest('dist/tmp/'));
});

// Patch version bump
gulp.task('bump', function(){
	gulp.src('.')
	.pipe(plugins.prompt.prompt({
        type: 'list',
        name: 'bump',
        message: 'What type of bump would you like to do?',
        choices: ['cancel','patch', 'minor', 'major']
    }, function(res){
    	if(res.bump == 'cancel'){
    		plugins.util.log(plugins.util.colors.red('Version bump canceled.'));
    	}
    	else{
    		gulp.src('./package.json')
			.pipe(plugins.bump({type:res.bump}))
			.pipe(gulp.dest('./'));
    	}
    }));

	
});

// Release to github
gulp.task('release', function(){
	var pkg = getPackageJson();

	gulp.src('.')
    .pipe(plugins.prompt.confirm({
    	message: 'Did you commit and push/sync all changes you made to the code?',
    	default: false
    }))
	.pipe(plugins.prompt.prompt([{
        type: 'input',
        name: 'releasename',
        message: 'How shall the release be named?',
        default: ['v'+pkg.version]
    },
    {
        type: 'input',
        name: 'notes',
        message: 'Provide a release note, if you want to.'
    },
    {
        type: 'list',
        name: 'type',
        message: 'What do you want to release?',
        choices: ['Prerelease','Release'],
        default: 1,
    }],function(res){

    	// Build the options object
    	console.log(res.releasename)
    	var releaseoptions = {
    		name: res.releasename,
    		notes: res.notes,
    		manifest: require('./package.json'),
    		owner: 'moay',
    		repo: 'afterglow',
    		draft: true
    	};
    	if(res.type == "Prerelease")
    	{
    		releaseoptions.prerelease = true;
    	}

    	// LAST CHANGE TO CANCEL NOTICE
    	plugins.util.log('');
    	plugins.util.log('Your are going to release', plugins.util.colors.green('afterglow'), plugins.util.colors.yellow(res.releasename), plugins.util.colors.cyan('(Version tag: '+pkg.version+')'), 'as a', plugins.util.colors.white(res.type));


    	// Remember to set an env var called GITHUB_TOKEN
		gulp.src('./dist/afterglow.min.js')
		.pipe(plugins.prompt.confirm({
	    	message: 'Do you really want this? Last chance!',
	    	default: false
	    }))
		.pipe(release(releaseoptions));    	
    }));
});