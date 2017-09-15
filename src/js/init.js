/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */

import Afterglow from './afterglow/Afterglow';

window.afterglow = new Afterglow();

// Initiate afterglow when the DOM is ready. This is not IE8 compatible!
document.addEventListener("DOMContentLoaded", function() { 
	window.afterglow.init();
});