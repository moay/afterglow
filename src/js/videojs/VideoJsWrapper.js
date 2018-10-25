/**
 * Proxy for videojs in order to be able to test the player component
 * and to simplify inclusion of other needed depedencies.
 */
import VideoJs from 'video.js';

import TopControlBar from './components/TopControlBar';

// Styles
require('video.js/dist/video-js.css');
require('../../less/skins/afterglow-default.less');
require('../../less/skins/afterglow-light.less');
require('../../less/skins/afterglow-dark.less');

// VideoJs Plugins
require('videojs-youtube');
require('./plugins/videojs-vimeo');
require('videojs-hotkeys');

VideoJs.registerComponent('TopControlBar', TopControlBar);

export default (id, options, ready) => VideoJs(id, options, ready);
