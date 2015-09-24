/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */

'use strict';

import AfterglowPlayer from './AfterglowPlayer';
import AfterglowLightbox from './AfterglowLightbox';
import AfterglowLightboxTrigger from './AfterglowLightboxTrigger';

class Afterglow {

	constructor(){
		/**
		 * Will hold the players in order to make them accessible
		 */
		this.players = [];
		/**
		 * Will hold the trigger elements which will launch lightbox players
		 */
		this.lightboxtriggers = [];
	}

	/**
	 * Initiate all players that were found and need to be initiated
	 * @return void
	 */
	init(){
		// Run some preparations
		this.configureVideoJS();

		// initialize regular players
		this.initVideoElements();

		// prepare Lightboxes
		this.prepareLightboxVideos();
	}

	initVideoElements(){
		// Get players including sublime fallback
		var players = document.querySelectorAll("video.afterglow,video.sublime");

		// Initialize players
		for (var i = 0; i < players.length; i++){
			var player = new AfterglowPlayer(players[i]);
			player.init();
			this.players.push(player);
		}
	}

	prepareLightboxVideos(){
		// Get lightboxplayers including sublime fallback
		var lightboxtriggers = document.querySelectorAll("a.afterglow,a.sublime");
		
		// Initialize players launching in a lightbox
		for (var i = 0; i < lightboxtriggers.length; i++){
			let trigger = new AfterglowLightboxTrigger(lightboxtriggers[i]);

			this.bindLightboxTriggerEvents(trigger);

			this.lightboxtriggers.push(trigger);
		}
	}

	bindLightboxTriggerEvents(trigger){
		trigger.on('trigger',() => {
			this.players.push(trigger.getPlayer());
			this.consolidatePlayers;
		});
		trigger.on('close',() => {
			this.consolidatePlayers();
		});
	}

	/**
	 * Re-initiate a player by its ID
	 * @param  {string}  playerid  The id of the video element which should be converted
	 * @return void
	 */
	reInitPlayer(playerid){
		var player = document.querySelector("video#"+playerid);
		this.initPlayer(player);
	}

	/**
	 * Returns the the players object if it was initiated yet
	 * @param  string The player's id
	 * @return boolean false or object if found
	 */
	getPlayer(playerid){
	 	for (var i = this.players.length - 1; i >= 0; i--) {
			if(this.players[i].id() === playerid){
	 			return this.players[i].videojs;
			}
	 	};
	 	return false;
	 }

	/**
	 * Should destroy a player instance if it exists
	 * @param  {string} playerid  The player's id
	 * @return void
	 */
	destroyPlayer(playerid){
	 	for (var i = this.players.length - 1; i >= 0; i--) {
	 		if(this.players[i].id() === playerid){
	 			this.players[i].dispose();
	 			this.players.splice(i,1);
	 		}
	 	};
	}

	/**
	 * Closes the lightbox and resets the lightbox player so that it can be reopened
	 * @return void
	 */
	closeLightbox(){
		for (var i = this.lightboxtriggers.length - 1; i >= 0; i--) {
			this.lightboxtriggers[i].closeLightbox();
		};
		this.consolidatePlayers();
	}

	consolidatePlayers(){
		for (var i = this.players.length - 1; i >= 0; i--) {
			if(this.players[i] !== undefined && !this.players[i].alive){
				delete this.players[i];
				
				// Reset indexes
				this.players = this.players.filter(function(){return true;});
			}
		};
	}

	/**
	 * Run some configurations on video.js to make it work for us
	 * @return void
	 */
	configureVideoJS(){
		// Disable tracking
		window.HELP_IMPROVE_VIDEOJS = false;	
	}
}

export default Afterglow;