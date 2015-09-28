/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';

import AfterglowUtil from './AfterglowUtil';

class AfterglowConfig {

	constructor(videoelement, skin = 'afterglow'){

		// Check for the video element
		if(videoelement == undefined){
			console.error('Please provide a proper video element to afterglow');
		}
		else{
			// Set videoelement
			this.videoelement = videoelement;

			// Prepare option variables
			this.setDefaultOptions();
			this.setSkinControls();

			if(AfterglowUtil.isYoutubePlayer(this.videoelement)){
				this.setYoutubeOptions();
			}

			this.skin = skin;
		}
	}

	/**
	 * Sets some basic options based on the videoelement's attributes
	 */
	setDefaultOptions(){	
		this.options = {
			// Controls needed for the player
			controls : true,
			
			// Default tech order
			techOrder : ["html5","flash"],
			
			preload : this.getPreloadValue(),
			autoplay : this.getAutoplayValue(),
			poster : this.getPosterframeValue()
		};
	}

	getAutoplayValue(){
		if(this.videoelement.getAttribute("data-autoplay") !== null && this.videoelement.getAttribute("data-autoplay") !== "false"){
			return this.videoelement.getAttribute("data-autoplay");
		} else if(this.videoelement.getAttribute("autoplay") !== null && this.videoelement.getAttribute("autoplay") !== "false"){
			return this.videoelement.getAttribute("autoplay");
		} else {
			return false;
		}
	}

	getPreloadValue(){
		if(this.videoelement.getAttribute("data-preload") !== null){
			return this.videoelement.getAttribute("data-preload");
		} else if(this.videoelement.getAttribute("preload") !== null){
			return this.videoelement.getAttribute("preload");
		} else {
			return "auto";
		}
	}

	getPosterframeValue(){
		if(this.videoelement.getAttribute("data-poster") !== null){
			return this.videoelement.getAttribute("data-poster");
		} else if(this.videoelement.getAttribute("poster") !== null){
			return this.videoelement.getAttribute("poster");
		} else {
			return false;
		}
	}

	setSkinControls(){
		// If there will be other skins to know, they will be added here. For now, we just output the 'afterglow' skin children
		var children = {
			TopControlBar: {
				children: [
					{
						name: "fullscreenToggle"
					}
				]
			},
			controlBar: {
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
			}
		};
		this.options.children = children;
	}

	setYoutubeOptions(){
		this.options.showinfo = 0;
		this.options.techOrder = ["youtube"];
		this.options.sources = [{
			"type": "video/youtube",
			"src": "https://www.youtube.com/watch?v="+this.videoelement.getAttribute("data-youtube-id")
		}];

		if(ie >= 8 && ie <= 11){
			this.options.youtube = {
				ytControls : 2,
				color : "white"
			};
		}
	}

	getSkinClass(){
		var cssclass="vjs-afterglow-skin";
		if(this.skin !== 'afterglow'){
			cssclass = cssclass + " afterglow-skin-"+this.skin;
		}
		return cssclass;
	}
}

export default AfterglowConfig;