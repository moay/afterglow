

require('babel/register');

const plugins = require('gulp-load-plugins')();
const gulp = require('gulp');
const del = require('del');
const fs = require('fs');
const browserify = require('browserify');
const babelify = require('babelify');
const release = require('gulp-github-release');
const notifierReporter = require('mocha-notifier-reporter');

const getPackageJson = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

// Shortcut to the build task
gulp.task('build', ['package-build'], () => {});

// General build task, cleans up after real build
gulp.task('cleanup-tmp', ['build-afterglow'], () => del(['./dist/tmp']));

gulp.task('package-build', ['cleanup-tmp'], () => gulp.src('./dist/afterglow.min.js')
  .pipe(plugins.zip('afterglow.zip'))
  .pipe(gulp.dest('dist')));

// Helper task for building the release
gulp.task('build-afterglow', ['compileES6'], () => {
  const pkg = getPackageJson();
  const banner = ['/**',
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
    './src/less/skins/*.less',
    './src/less/components/*.less',
  ])

  // Convert LESS files to CSS
    .pipe(plugins.less())

  // Add normal css which doesn't need to be compiled
    .pipe(plugins.addSrc.prepend('./vendor/videojs/video-js.css'))

  // Minify the CSS
    .pipe(plugins.cssmin())

  // Now convert it to JavaScript and specify options
    .pipe(plugins.css2js({
      splitOnNewline: false,
    }))

  // Add all the javascript files in the correct order
    .pipe(plugins.addSrc.append([
      './vendor/videojs/video.js',
    ]))
    .pipe(plugins.addSrc.append([
      './vendor/videojs/plugins/videojs.hotkeys.js',
      './vendor/videojs/plugins/Youtube.js',
      './vendor/videojs/plugins/videojs-vimeo.js',
    ]))
    .pipe(plugins.addSrc.append([
      './dist/tmp/afterglow-bundle.js',
    ]))

  // Concatenate into a single large file
    .pipe(plugins.concat('afterglow.min.js'))

  // Minify the JavaScript
    .pipe(plugins.uglify().on('error', plugins.util.log))

    .pipe(plugins.header(banner, { pkg }))

  // Finally write it to our destination (./dist/afterglow.min.js)
    .pipe(gulp.dest('./dist/'));
});

// Task to compile ES6 components
gulp.task('compileES6', ['compileVJSComponents'], () => {
  // Create empty file
  gulp.src(`${__dirname}/dist/tmp/components/*.js`)
    .pipe(plugins.concat('afterglow-bundle.js'))
    .pipe(gulp.dest(`${__dirname}/dist/tmp/`));

  // Compile
  const extensions = ['.js', '.json', '.es6'];
  return browserify({ debug: true, extensions })
	    .transform(babelify.configure({
	      extensions,
	    }))
	    .require(`${__dirname}/src/js/init.js`, { entry: true })
	    .bundle()
	    .on('error', (err) => { console.log(`Error : ${err.message}`); })
	    .pipe(fs.createWriteStream(`${__dirname}/dist/tmp/afterglow-bundle.js`, { flags: 'a' }));
});

gulp.task('compileVJSComponents', () => gulp.src('./src/js/vjs-components/*.js')
  .pipe(plugins.babel())
  .pipe(gulp.dest(`${__dirname}/dist/tmp/components`)));

// Patch version bump
gulp.task('bump', () => gulp.src('.')
  .pipe(plugins.prompt.prompt({
    type: 'list',
    name: 'bump',
    message: 'What type of bump would you like to do?',
    choices: ['cancel', 'patch', 'minor', 'major'],
  }, (res) => {
    	if (res.bump == 'cancel') {
    		plugins.util.log(plugins.util.colors.red('Version bump canceled.'));
    	} else {
    		gulp.src('./package.json')
  			.pipe(plugins.bump({ type: res.bump }))
  			.pipe(gulp.dest('./'));
    	}
  })));

// Release to github
gulp.task('release', () => {
  const pkg = getPackageJson();

  gulp.src('.')
    .pipe(plugins.prompt.confirm({
    	message: 'Did you commit and push/sync all changes you made to the code?',
    	default: false,
    }))
    .pipe(plugins.prompt.prompt([{
      type: 'input',
      name: 'releasename',
      message: 'How shall the release be named?',
      default: [`afterglow v${pkg.version}`],
    },
    {
      type: 'input',
      name: 'notes',
      message: 'Provide a release note, if you want to.',
    },
    {
      type: 'list',
      name: 'type',
      message: 'What do you want to release?',
      choices: ['Prerelease', 'Release'],
      default: 1,
    }], (res) => {
    	// Build the options object
    	const releaseoptions = {
    		name: res.releasename,
    		notes: res.notes,
    		manifest: require('./package.json'),
    		owner: 'moay',
    		repo: 'afterglow',
    		tag: pkg.version,
    		draft: true,
    	};
    	if (res.type == 'Prerelease') {
    		releaseoptions.prerelease = true;
    	}

    	// LAST CHANGE TO CANCEL NOTICE
    	plugins.util.log('');
    	plugins.util.log('Your are going to release', plugins.util.colors.yellow(res.releasename), plugins.util.colors.cyan(`(Version tag: ${pkg.version})`), 'as a', plugins.util.colors.white(res.type));


    	// Remember to set an env var called GITHUB_TOKEN
      gulp.src('./dist/afterglow.zip')
        .pipe(plugins.prompt.confirm({
	    	message: 'Do you really want this? Last chance!',
	    	default: false,
	    }))
        .pipe(release(releaseoptions));
    }));
});

gulp.task('test', () => gulp.src('./test/*.js')
  .pipe(plugins.mocha({
    reporter: notifierReporter.decorate('spec'),
  })));
