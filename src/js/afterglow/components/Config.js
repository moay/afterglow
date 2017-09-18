/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';

import Util from '../lib/Util';

class Config {

	constructor(videoelement, skin = 'afterglow'){
		return this.init(videoelement, skin);
	}

	init(videoelement, skin = 'afterglow'){

		// Check for the video element
		if(videoelement == undefined){
			console.error('Please provide a proper video element to afterglow');
		}
		else{
			// Set videoelement
			this.videoelement = videoelement;

			// Prepare the options container
			this.options = {};

			// Set the skin
			this.skin = skin;

			// Prepare option variables
			this.setDefaultOptions();
			this.setSkinControls();

			let util = new Util;
			// Initialize youtube if the current player is a youtube player
			if(util.isYoutubePlayer(this.videoelement)){
				this.setYoutubeOptions();	
			}
			// Initialize vimeo if the current player is a vimeo player
			if(util.isVimeoPlayer(this.videoelement)){
				this.setVimeoOptions();	
			}
		}
	}

	/**
	 * Sets some basic options based on the videoelement's attributes
	 * @return {void}
	 */
	setDefaultOptions(){
		// Controls needed for the player
		this.options.controls = true;
		
		// Default tech order
		this.options.techOrder = ["Html5"];
	
		// Some default player parameters
		this.options.preload = this.getPlayerAttributeFromVideoElement('preload','auto');
		this.options.autoplay = this.getPlayerAttributeFromVideoElement('autoplay');
		this.options.poster = this.getPlayerAttributeFromVideoElement('poster');
	}

	/**
	 * Gets a configuration value that has been passed to the videoelement as HTML tag attribute
	 * @param  {string}  attributename  The name of the attribute to get
	 * @param  {mixed} fallback      	The expected fallback if the attribute was not set - false by default
	 * @return {mixed}					The attribute (with data-attributename being preferred) or the fallback if none.
	 */
	getPlayerAttributeFromVideoElement(attributename, fallback = false){
		if(this.videoelement.getAttribute("data-"+attributename) !== null){
			return this.videoelement.getAttribute("data-"+attributename);
		} else if(this.videoelement.getAttribute(attributename) !== null){
			return this.videoelement.getAttribute(attributename);
		} else {
			return fallback;
		}
	}

	/**
	 * Sets the controls which are needed for the player to work properly.
	 */
	setSkinControls(){
		// For now, we just output the default 'afterglow' skin children, as there isn't any other skin defined yet
		let controlBar = {
			children: [
				{
					name: "currentTimeDisplay"
				},
				{
					name: "playToggle"
				},
				{
					name: "durationDisplay"
				},
				{
					name: "progressControl"
				},
				{
					name: "ResolutionSwitchingButton"
				},
				{
					name: "volumeMenuButton",
					inline:true
				},
				{
					name: "subtitlesButton"
				},
				{
					name: "captionsButton"
				}
			]
		};
		this.options.controlBar = controlBar;
	}

	/**
	 * Sets options needed for youtube to work and replaces the sources with the correct youtube source
	 */
	setYoutubeOptions(){
		this.options.showinfo = 0;
		this.options.techOrder = ["youtube"];
		this.options.sources = [{
			"type": "video/youtube",
			"src": "https://www.youtube.com/watch?v="+this.getPlayerAttributeFromVideoElement('youtube-id')
		}];

		let util = new Util;
		if(util.ie().actualVersion >= 8 && util.ie().actualVersion <= 11){
			this.options.youtube = {
				ytControls : 2,
				color : "white",
				modestbranding : 1
			};
		}
		else{
			this.options.youtube = {
				'iv_load_policy' : 3,
				modestbranding: 1
			};
		}
	}

	/**
	 * Sets options needed for vimeo to work and replaces the sources with the correct vimeo source
	 */
	setVimeoOptions(){
		this.options.techOrder = ["vimeo"];
		this.options.sources = [{
			"type": "video/vimeo",
			"src": "https://vimeo.com/"+this.getPlayerAttributeFromVideoElement('vimeo-id')
		}];
	}

	/**
	 * Returns the CSS class for the video element
	 * @return {string}
	 */
	getSkinClass(){
		var cssclass="vjs-afterglow-skin";
		if(this.skin !== 'afterglow'){
			cssclass += " afterglow-skin-"+this.skin;
		}

		// Fix for IE9. Somehow, this is necessary. Won't hurt anyone, so this hack is installed.
		let util = new Util;
		if(util.ie().actualVersion == 9){
			cssclass += ' ie9-is-bad';
		}

		return cssclass;
	}
}

export default Config;