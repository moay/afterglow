/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';

import AfterglowLightbox from './AfterglowLightbox';

// For emitting and receiving events
import Emitter from './components/Emitter';

class AfterglowLightboxTrigger {

	constructor(element){
		this.element = element;
		this.init();
	}

	init(){
		// Get the playerid
		this.playerid = this.element.getAttribute("href");
		// Hide the video element
		this.videoelement = document.querySelector(this.playerid);
		
		this.prepare();

		Emitter(this);
	}

	prepare(){
		// Add major class
		this.videoelement.addClass("afterglow-lightboxplayer");
		// Prepare the element
		this.videoelement.setAttribute("data-autoresize","fit");

		this.element.onclick = (e) => {
			// Prevent the click event, IE8 compatible
			e = e ? e : window.event;
			e.preventDefault();

			// Launch the lightbox
			this.trigger();
		};
	}

	trigger(){
		this.lightbox = new AfterglowLightbox();

		var videoelement = this.videoelement.cloneNode(true);
		
		this.lightbox.passVideoElement(videoelement);

		this.emit('trigger');

		this.lightbox.launch();

		// Pass event to afterglow core
		this.lightbox.on('close', fn => {
			this.emit('close');
		});
	}

	closeLightbox(){
		if(this.lightbox != undefined){
			this.lightbox.close();
			delete this.lightbox;
		}
	}

	getPlayer(){
		return this.lightbox.player;
	}

}

export default AfterglowLightboxTrigger;