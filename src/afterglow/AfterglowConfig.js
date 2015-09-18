/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';

import AfterglowUtil from './AfterglowUtil';

class AfterglowConfig {

	constructor(videoelement, skin = 'afterglow'){
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

	setDefaultOptions(){
		// Prepare some options based on the elements attributes
		
		// Preloading
		if(this.videoelement.getAttribute("data-preload") !== null){
			var preload = this.videoelement.getAttribute("data-preload");
		} else if(this.videoelement.getAttribute("preload") !== null){
			var preload = this.videoelement.getAttribute("preload");
		} else {
			var preload = "auto";
		}

		// Autoplay
		if(this.videoelement.getAttribute("data-autoplay") !== null && this.videoelement.getAttribute("data-autoplay") !== "false"){
			var autoplay = this.videoelement.getAttribute("data-autoplay");
		} else if(this.videoelement.getAttribute("autoplay") !== null && this.videoelement.getAttribute("autoplay") !== "false"){
			var autoplay = this.videoelement.getAttribute("autoplay");
		} else {
			var autoplay = false;
		}

		// Posterframe
		if(this.videoelement.getAttribute("data-poster") !== null){
			var poster = this.videoelement.getAttribute("data-poster");
		} else if(this.videoelement.getAttribute("poster") !== null){
			var poster = this.videoelement.getAttribute("poster");
		} else {
			var poster = false;
		}

		// Set the options
		var options = {
			controls : true,
			preload : preload,
			autoplay : autoplay,
			poster : poster,
			techOrder : ["html5","flash"]
		};

		this.options = options;
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