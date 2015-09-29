/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';

import Lightbox from './Lightbox';

// For emitting and receiving events
import Emitter from '../../../../vendor/Emitter/Emitter';
import DOMElement from '../lib/DOMElement';

class LightboxTrigger extends DOMElement {

	constructor(node){
		super(node);
		this.init();
	}

	init(){
		// Get the playerid
		this.playerid = this.node.getAttribute("href");
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

		this.bind('click', (e) => {
			// Prevent the click event, IE8 compatible
			e = e ? e : window.event;
			e.preventDefault();

			// Launch the lightbox
			this.trigger();
		});
	}

	trigger(){
		this.lightbox = new Lightbox();

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

export default LightboxTrigger;