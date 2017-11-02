/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';


class Eventbus{

	constructor() {
		this.players = {};
	}

	/**
	 * Packs the events into the container to be able to listen to them lateron
	 *
	 * @param      string  playerid   The playerid
	 * @param      string  event      The event
	 * @param      executable  _callback  The callback
	 */
	subscribe(playerid, event, _callback) {
		if(!this.players[playerid]){
			this.players[playerid] = { listeners : {} };
		}
		if(!this.players[playerid].listeners[event]){
			this.players[playerid].listeners[event] = [];
		}
		this.players[playerid].listeners[event].push(_callback);
	}

	/**
	 * Removes the the first matching callback which was bound to the event
	 *
	 * @param      string  playerid   The playerid
	 * @param      string  event      The event
	 * @param      executable  _callback  The callback
	 */
	unsubscribe(playerid, event, _callback) {
		if(!this.players[playerid] || !this.players[playerid].listeners[event] || this.players[playerid].listeners[event].indexOf(_callback) === -1){
			console.error('afterglow could not unbind your event because the _callback was not bound');
		}
		else {
			let index = this.players[playerid].listeners[event].indexOf(_callback);
			this.players[playerid].listeners[event].splice(index,1);
		}
	}

	/**
	 * Dispatches an event and executes all bound callbacks
	 *
	 * @param      string  playerid   The playerid
	 * @param      string  event      The event
	 * @param      executable  _callback  The callback
	 */
	dispatch(playerid, event) {
		if(!this.players[playerid] || !this.players[playerid].listeners[event]){
			return false;
		}
		for (var i = 0; i < this.players[playerid].listeners[event].length; i++) {
			this.players[playerid].listeners[event][i]({type: event, playerid: playerid, player: window.afterglow.getPlayer(playerid)});
		}
	}
}

export default Eventbus;