/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */

import AfterglowController from './AfterglowController';

class EventBus {
  constructor() {
    this.players = {};
  }

  /**
   * Packs the events into the container to be able to listen to them lateron
   *
   * @param playerid
   * @param event
   * @param _callback
   */
  subscribe(playerid, event, _callback) {
    if (!this.players[playerid]) {
      this.players[playerid] = { listeners: {} };
    }
    if (!this.players[playerid].listeners[event]) {
      this.players[playerid].listeners[event] = [];
    }
    this.players[playerid].listeners[event].push(_callback);
  }

  /**
   * Removes the the first matching callback which was bound to the event
   *
   * @param playerid
   * @param event
   * @param _callback
   */
  unsubscribe(playerid, event, _callback) {
    if (!this.players[playerid]
      || !this.players[playerid].listeners[event]
      || this.players[playerid].listeners[event].indexOf(_callback) === -1) {
    } else {
      const index = this.players[playerid].listeners[event].indexOf(_callback);
      this.players[playerid].listeners[event].splice(index, 1);
    }
  }

  /**
   * Dispatches an event and triggers all bound callbacks
   *
   * @param playerid
   * @param event
   * @return void;
   */
  dispatch(playerid, event) {
    if (!this.players[playerid] || !this.players[playerid].listeners[event]) {
      return;
    }
    for (let i = 0; i < this.players[playerid].listeners[event].length; i += 1) {
      this.execute(this.players[playerid].listeners[event][i], event, playerid);
    }
  }

  /**
   * Executes the actual callback functions
   *
   * @param callback
   * @param event
   * @param playerid
   */
  execute(callback, event, playerid) {
    callback({
      type: event,
      playerid,
      player: AfterglowController.getPlayer(playerid),
    });
  }
}

export default new EventBus();
