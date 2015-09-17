/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */

// Initiate afterglow when the DOM is ready. This is not IE8 compatible!
document.addEventListener("DOMContentLoaded", function() { 
	var afterglow = new Afterglow;
	afterglow.init();
});