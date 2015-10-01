/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';

import Player from './Player';
import Util from '../lib/Util';

// For emitting and receiving events
import Emitter from '../../../../vendor/Emitter/Emitter';

class Lightbox {

	constructor(){
		this.init();
	}

 	/**
 	 * Initiating the Lightbox and enabling element binding
 	 * @return void
 	 */
	init(){
		this.build();
		Emitter(this);
	}

	/**
	 * Prepares the lightbox elements which are needed to properly add them to the DOM
	 * @return {void}
	 */
	build(){
		// Prepare the lightbox elements
		var wrapper = document.createElement('div').addClass("afterglow-lightbox-wrapper");
		var cover = document.createElement('div').addClass("cover");
		var lightbox = document.createElement('div').addClass("afterglow-lightbox");

		wrapper.appendChild(cover);
		wrapper.appendChild(lightbox);

		this.wrapper = wrapper;
		this.cover = cover;
		this.lightbox = lightbox;
	}

	/**
	 * Appends the real videoElement to the wrapper.
	 * @param  {[type]} videoelement [description]
	 * @return {[type]}              [description]
	 */
	passVideoElement(videoelement){
		this.playerid = videoelement.getAttribute("id");
		this.lightbox.appendChild(videoelement);
		this.videoelement = videoelement;
		this.videoelement.setAttribute("autoplay","autoplay");

		this.player = new Player(this.videoelement);
	}

	launch(_callback){
		document.body.appendChild(this.wrapper);

		this.player.init(fn => {

			var videojs = this.player.videojs;

			// Prevent autoplay for mobile devices, won't work anyways...
			if(!isMobile){
				// If autoplay didn't work
				if(videojs.paused()){
					videojs.posterImage.show();
					videojs.bigPlayButton.show();
				}
			}

			// Adding autoclose functionality
			if(this.videoelement.getAttribute("data-autoclose") == "true"){
				videojs.on('ended', () => {
					this.close();
				});
			}
			// Else show the poster frame on ended.
			else{
				videojs.on('ended', () => {
					videojs.posterImage.show();
				});
			}

			videojs.TopControlBar.addChild("LightboxCloseButton");
		});

		// resize the lightbox and make it autoresize
		this.resize();
		addEventHandler(window,'resize',() => {
			this.resize();
		});

		// bind the closing event
		addEventHandler(this.cover,'click', () => { 
			this.close(); 
		});

		// bind the escape key
		addEventHandler(window,'keyup',(e) => {
			// Fallback for IE8
			e = e ? e : window.event;
			if(e.keyCode == 27)
			{
				this.close();
			}
		});

		// Launch the callback if there is one
		if(typeof _callback == "function"){
			_callback(this);
		}
	}

	/**
	 * Resize the lightbox according to the media ratio
	 * @return void
	 */
	resize(){
		// Do if it exists
		if(this.wrapper != undefined){
			// Standard HTML5 player
			if(this.videoelement !== undefined){			
				var ratio = this.videoelement.getAttribute("data-ratio");
				if(this.videoelement.getAttribute("data-overscale") == "false")
				{
					// Calculate the new size of the player with maxwidth
					var sizes = this.calculateLightboxSizes(ratio, parseInt(this.videoelement.getAttribute("data-maxwidth")));
				}
				else{
					// Calculate the new size of the player without maxwidth
					var sizes = this.calculateLightboxSizes(ratio);
				}
			}
			else{
				// Youtube
				if(document.querySelectorAll("div.afterglow-lightbox-wrapper .vjs-youtube").length == 1){
					playerelement = document.querySelector("div.afterglow-lightbox-wrapper .vjs-youtube");
					var ratio = playerelement.getAttribute("data-ratio");
					var sizes = this.calculateLightboxSizes(ratio);
				}
			}
			
			// Apply the height and width
			this.wrapper.style.width = sizes.width;
			this.wrapper.style.height = sizes.height;

			this.lightbox.style.height = sizes.playerheight + "px";
			this.lightbox.style.width = sizes.playerwidth + "px";
			this.lightbox.style.top = sizes.playeroffsettop + "px";
			this.lightbox.style.left = sizes.playeroffsetleft + "px";
		}
	}

	/**
	 * calculates the current lightbox size based on window width and height and on the players ratio
	 * @param  {float} ratio   The players ratio
	 * @return {object}        Some sizes which can be used
	 */
	calculateLightboxSizes(ratio, maxwidth){
		var sizes = {};

		// Get window width && height
		sizes.width = window.clientWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth
		|| window.innerWidth;
		sizes.height = window.clientHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight
		|| window.innerHeight;

		// Window is wide enough
		if(sizes.height/sizes.width > ratio)
		{	
			// Check if the lightbox should overscale, even if video is smaller
			if(typeof maxwidth !== 'undefined' && maxwidth < sizes.width * .90){
				sizes.playerwidth = maxwidth;
			}
			// Else scale up as much as possible
			else{
				sizes.playerwidth = sizes.width * .90;
			}
			sizes.playerheight = sizes.playerwidth * ratio;
		}
		else{
			// Check if the lightbox should overscale, even if video is smaller
			if(typeof maxwidth !== 'undefined' && maxwidth < (sizes.height * .92)/ratio)
			{
				sizes.playerheight = maxwidth * ratio;
			}
			// Else scale up as much as possible
			else{
				sizes.playerheight = sizes.height * .92;
			}
			sizes.playerwidth = sizes.playerheight / ratio;
		}
		sizes.playeroffsettop = ( sizes.height - sizes.playerheight ) / 2;
		sizes.playeroffsetleft = ( sizes.width - sizes.playerwidth ) / 2;

		return sizes;
	}

	close(){
		this.player.destroy(true);
		this.wrapper.parentNode.removeChild(this.wrapper);
		this.emit('close');
	}
}

export default Lightbox;