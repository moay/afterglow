/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';

import Player from './Player';
import Util from '../lib/Util';
import DOMElement from '../lib/DOMElement';

// For emitting and receiving events
import Emitter from '../../../../vendor/Emitter/Emitter';

class Lightbox extends DOMElement{

	constructor(){
		super(document.createElement('div'));
		this.addClass("afterglow-lightbox-wrapper");
		this.build();
		this.bindEmitter();
	}

	/**
	 * Prepares the lightbox elements which are needed to properly add them to the DOM
	 * @return {void}
	 */
	build(){
		// Prepare the lightbox elements
		let cover = this.buildCover();
		let lightbox = this.buildLightbox(); 
		
		this.appendDomElement(cover, 'cover');
		this.appendDomElement(lightbox, 'lightbox');
	}

	/**
	 * Builds the Cover element
	 * @return {DOMElement object}
	 */
	buildCover(){
		var cover = document.createElement('div');
		cover = new DOMElement(cover);
		cover.addClass("cover");
		return cover;
	}

	/**
	 * Builds the Lightbox element
	 * @return {DOMElement object}
	 */
	buildLightbox(){
		var lightbox = document.createElement('div');
		lightbox = new DOMElement(lightbox);
		lightbox.addClass("afterglow-lightbox");
		return lightbox;
	}

 	/**
 	 * Initiating the Lightbox and enabling element binding
 	 * @return void
 	 */
	bindEmitter(){
		Emitter(this);
	}

	/**
	 * Appends the real videoElement to the wrapper.
	 * @param  {[type]} videoelement [description]
	 * @return {[type]}              [description]
	 */
	passVideoElement(videoelement){
		this.playerid = videoelement.getAttribute("id");
		// This is not easily testable. But the constructor of DOMElement is so simple, that we rely on the UTs that exist for DOMElement.
		videoelement = new DOMElement(videoelement);
		this.lightbox.appendDomElement(videoelement, 'videoelement');
		this.lightbox.videoelement = videoelement;
		this.lightbox.videoelement.setAttribute("autoplay","autoplay");

		this.player = new Player(this.lightbox.videoelement);
	}

	/**
	 * Method which will actually launch the player. Nodes will be appended to the DOM and all events will be bound.
	 * @param  {closure} _callback A callback function which will be executed after having completed the launch if needed.
	 * @return {void}
	 */
	launch(_callback){
		var util = new Util;
		document.body.appendChild(this.node);

		this.player.init(() => {

			// Prevent autoplay for mobile devices, won't work anyways...
			if(!util.isMobile()){
				// If autoplay didn't work
				if(this.player.videojs.paused()){
					this.player.videojs.posterImage.show();
					this.player.videojs.bigPlayButton.show();
				}
			}

			// Adding autoclose functionality
			if(this.lightbox.videoelement.getAttribute("data-autoclose") == "true"){
				this.player.videojs.on('ended', () => {
					this.close();
				});
			}
			// Else show the poster frame on ended.
			else{
				this.player.videojs.on('ended', () => {
					this.player.videojs.posterImage.show();
				});
			}

			this.player.videojs.getChild('TopControlBar').addChild("LightboxCloseButton");
		});

		// Stop all active players if there are any playing
		for(let key in window.videojs.getPlayers()) {
		    if(window.videojs.getPlayers()[key] !== null && window.videojs.getPlayers()[key].id_ !== this.playerid){
		    	window.videojs.getPlayers()[key].pause();
		    }
		}

		// resize the lightbox and make it autoresize
		this.resize();
		util.addEventListener(window,'resize',() => {
			this.resize();
		});

		// bind the closing event
		this.cover.bind('click',() => { 
			this.close(); 
		});

		// bind the escape key
		util.addEventListener(window,'keyup',(e) => {
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
		// Standard HTML5 player
		if(this.lightbox.videoelement !== undefined){			
			var ratio = this.lightbox.videoelement.getAttribute("data-ratio");
			if(this.lightbox.videoelement.getAttribute("data-overscale") == "false")
			{
				// Calculate the new size of the player with maxwidth
				var sizes = this.calculateLightboxSizes(ratio, parseInt(this.lightbox.videoelement.getAttribute("data-maxwidth")));
			}
			else{
				// Calculate the new size of the player without maxwidth
				var sizes = this.calculateLightboxSizes(ratio);
			}
		}
		else{
			// Youtube
			if(document.querySelectorAll("div.afterglow-lightbox-wrapper .vjs-youtube").length == 1){
				var playerelement = document.querySelector("div.afterglow-lightbox-wrapper .vjs-youtube");
				var ratio = playerelement.getAttribute("data-ratio");
				var sizes = this.calculateLightboxSizes(ratio);
			}
		}
		
		// Apply the height and width
		this.node.style.width = sizes.width;
		this.node.style.height = sizes.height;

		this.lightbox.node.style.height = sizes.playerheight + "px";
		this.lightbox.node.style.width = sizes.playerwidth + "px";
		this.lightbox.node.style.top = sizes.playeroffsettop + "px";
		this.lightbox.node.style.left = sizes.playeroffsetleft + "px";
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

	/**
	 * Closes the lightbox and removes the nodes from the DOM.
	 * @return void
	 */
	close(){
		window.afterglow.eventbus.dispatch(this.player.id, 'before-lightbox-close');
		this.player.destroy(true);
		this.node.parentNode.removeChild(this.node);
		this.emit('close');
	}

	/**
	 * Returns the player
	 * @return {Player object}	
	 */
	getPlayer(){
		if(this.player !== undefined){
			return this.player.getPlayer();
		}
		return undefined;
	}
}

export default Lightbox;