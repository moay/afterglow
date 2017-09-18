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

	/**
	 * Initializes all atributes and prepares the trigger element for further interaction
	 * @return {void}
	 */
	init(){
		// Get the playerid
		this.playerid = this.node.getAttribute("href").replace('#','');
		
		// Get the videoelement for this trigger
		let videoelement = document.querySelector('#'+this.playerid);
		this.videoelement = new DOMElement(videoelement);

		this.prepare();

		Emitter(this);
	}

	/**
	 * Prepares the video element to be used for the lightbox player.
	 * @return {void}
	 */
	prepare(){
		// Add major class
		this.videoelement.addClass("afterglow-lightboxplayer");
		// Prepare the element
		this.videoelement.setAttribute("data-autoresize","fit");

		this.bind('click', (e) => {
			e.preventDefault();

			// Launch the lightbox
			this.trigger();
		});
	}

	/**
	 * Creates all elements needed for the lightbox and launches the player.
	 * @return {void}
	 */
	trigger(){
		this.lightbox = new Lightbox();

		var videoelement = this.videoelement.cloneNode(true);
		
		this.lightbox.passVideoElement(videoelement);

		this.emit('trigger');
		window.afterglow.eventbus.dispatch(this.playerid, 'lightbox-launched');
		
		this.lightbox.launch();

		// Pass event to afterglow core
		// TODO: This must be tested. But it will break lightbox closing if it doesn't work, so that should be pretty obvious...
		this.lightbox.on('close', () => {
			window.afterglow.eventbus.dispatch(this.playerid, 'lightbox-closed');
			this.emit('close');
		});
	}

	/**
	 * Closes the lightbox if possible and removes the player from the trigger element so that it gets reinitiated on next trigger
	 * @return {void}
	 */
	closeLightbox(){
		if(this.lightbox != undefined){
			this.lightbox.close();
			this.deleteLightbox();
		}
	}

	/**
	 * Deletes the lightbox element if there is one.
	 * @return {void}
	 */
	deleteLightbox(){
		if(this.lightbox != undefined){
			delete this.lightbox;
		}
	}

	/**
	 * @return {object} Returns the player from the lightbox.
	 */
	getPlayer(){
		if(this.lightbox !== undefined){
			return this.lightbox.getPlayer();
		}
	}

}

export default LightboxTrigger;