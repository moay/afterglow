/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */

'use strict';

import Config from './Config';
import Util from '../lib/Util';

class Player {

	constructor(videoelement){
		// Passing to setup for testability
		this.setup(videoelement);
	}

	/**
	 * Sets the player up and prepares the video element
	 * @param  {DOMElement object} videoelement 	The videoelement which shall be transformed
	 */
	setup(videoelement){
		this.videoelement = videoelement;
		this.id = videoelement.getAttribute('id');

		// Prepare needed dependencies
		this.config = new Config(videoelement);
		this.util = new Util();

		// Prepare the element
		this.prepareVideoElement();

		// Set an activity variable to be able to detect if the player can be deleted
		this.alive = true;
	}

	/**
	 * Shortcut method which will apply some classes and parameters to the video element via some other methods
	 * @return
	 */
	prepareVideoElement(){
		this.applyDefaultClasses();
		this.applyParameters();

		if(this.util.isYoutubePlayer(this.videoelement)){
			this.applyYoutubeClasses();
		}
	}

	init(_callback){
		let videoelement = this.videoelement.node;
		let options = this.config.options;

		// initiate videojs and do some post initiation stuff
		var player = videojs(videoelement, options).ready(function(){

			// Enable hotkeys
			this.hotkeys({
				enableFullscreen: false,
				enableNumbers: false
			});

			// Set initial volume if needed
			if(videoelement.getAttribute('data-volume') !== null){
				var volume = parseFloat(videoelement.getAttribute('data-volume'));
				this.volume(volume);
			}

			// Fix youtube poster
			let util = new Util();
			if(util.isYoutubePlayer(videoelement) && !options.poster && this.tech_.poster != ""){
				this.addClass('vjs-youtube-ready');
				this.poster(this.tech_.poster);
			}

			// Add resolution switching
			// this.controlBar.addChild("ResolutionSwitchingButton");

			// Launch the callback if there is one
			if(typeof _callback == "function"){
				_callback(this);
			}
		});
		this.videojs = player;
	}

	/**
	 * Applies the default classes to the videoelement and removes sublime's class
	 * @return {void}
	 */
	applyDefaultClasses(){
		// Add some classes
		this.videoelement.addClass("video-js");
		this.videoelement.addClass("afterglow");
		this.videoelement.addClass(this.config.getSkinClass());

		// Remove sublime stuff
		this.videoelement.removeClass("sublime");
		
		// Check for IE9 - IE11
		let ie = this.util.ie().actualVersion;
		if(ie >= 8 && ie <= 11){ // @see afterglow-lib.js
			this.videoelement.addClass('vjs-IE');
		}
	}

	applyParameters(){
		// Make lightboxplayer not overscale
		if(this.videoelement.getAttribute("data-overscale") == "false"){
			this.videoelement.setAttribute("data-maxwidth",this.videoelement.getAttribute("width"));
		}

		// Apply some responsive stylings
		if(this.videoelement.getAttribute("data-autoresize") === 'fit' || this.videoelement.hasClass("responsive")){
			this.videoelement.addClass("vjs-responsive");
			if(this.videoelement.getAttribute("data-ratio")){
				var ratio = this.videoelement.getAttribute("data-ratio");
			}
			else if(!this.videoelement.getAttribute("height") || !this.videoelement.getAttribute("width"))
			{
				console.error("Please provide witdh and height for your video element.")
			}
			else{
				var ratio = this.videoelement.getAttribute("height") / this.videoelement.getAttribute("width");
			}
			this.videoelement.node.style.paddingTop = (ratio * 100)+"%";
			this.videoelement.removeAttribute("height");
			this.videoelement.removeAttribute("width");
			this.videoelement.setAttribute("data-ratio",ratio);
		}
	}

	applyYoutubeClasses(){
		let ie = this.util.ie().actualVersion;

		this.videoelement.addClass("vjs-youtube");
		
		// Check for native playback
		if(document.querySelector('video').controls){
			this.videoelement.addClass("vjs-using-native-controls");
		}
		// Add iOS class, just if is iPad
		if(/iPad|iPhone|iPod/.test(navigator.platform)){
			this.videoelement.addClass("vjs-iOS");
		}

		// Check for IE9 - IE11
		if(ie >= 8 && ie <= 11){ // @see afterglow-lib.js
			this.videoelement.addClass("vjs-using-native-controls");
		}
	}

	destroy(){
		if(!this.videojs.paused()){
			this.videojs.pause();
		}
		if(this.videojs.isFullscreen()){
			this.videojs.exitFullscreen();
		}
		this.videojs.dispose();
		this.alive = false;
	}
	
	/**
	 * Getter for the player
	 */
	getPlayer(){
		return this.player;
	}
}

export default Player;