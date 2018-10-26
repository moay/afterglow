/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */


import Player from './Player';
import LightboxTrigger from './LightboxTrigger';
import EventBus from './EventBus';
import DOMElement from '../lib/DOMElement';
import AfterglowController from './AfterglowController';


class Afterglow {
  constructor() {
    /**
     * Holds all of the controlling power of afterglow
     * @type {AfterglowController}
     */
    this.controller = AfterglowController;

    /**
     * Will be true after initialization
     */
    this.initialized = false;

    /**
     * Container for callbacks that have to be executed when afterglow is initalized
     */
    this.afterinit = [];
  }

  /**
   * Initiate all players that were found and need to be initiated
   * @return void
   */
  init() {
    this.initVideoElements();
    this.prepareLightboxVideos();

    this.initialized = true;

    // execute things to do when init done
    for (let i = 0; i < this.afterinit.length; i += 1) {
      this.afterinit[i]();
    }
    this.afterinit = [];
  }

  /**
   * Looks for players to initiate and creates AfterglowPlayer objects based on those elements
   * @return void
   */
  initVideoElements() {
    // Get players including sublime fallback
    const players = document.querySelectorAll('video.afterglow,video.sublime');

    // Initialize players
    for (let i = 0; i < players.length; i += 1) {
      const videoelement = new DOMElement(players[i]);
      const player = new Player(videoelement);
      this.controller.addPlayer(player);
    }
  }

  /**
   * Prepares all found trigger elements and makes them open their corresponding players when needed
   * @return void
   */
  prepareLightboxVideos() {
    // Get lightboxplayers including sublime fallback
    const lightboxtriggers = document.querySelectorAll('a.afterglow,a.sublime');

    // Initialize players launching in a lightbox
    for (let i = 0; i < lightboxtriggers.length; i += 1) {
      const trigger = new LightboxTrigger(lightboxtriggers[i]);
      this.controller.addLightboxPlayer(trigger);
    }
  }

  addPlayer(idOrElement) {
    let videoelement;
    if (typeof idOrElement === 'string') {
      videoelement = document.getElementById(idOrElement);
    } else {
      videoelement = idOrElement;
    }
    this.controller.addPlayer(new Player(videoelement));
  }

  /**
   * Binds an event for any given player
   *
   * @param playerid
   * @param eventname
   * @param _callback
   */
  on(playerid, eventname, _callback) {
    if (!this.initialized) {
      this.afterinit.push(() => {
        this.on(playerid, eventname, _callback);
      });
    } else {
      EventBus.subscribe(playerid, eventname, _callback);
    }
  }

  /**
   * Removes an event for any given player
   *
   * @param playerid
   * @param eventname
   * @param _callback
   */
  off(playerid, eventname, _callback) {
    if (!this.initialized) {
      this.afterinit.push(() => {
        this.off(playerid, eventname, _callback);
      });
    } else {
      EventBus.unsubscribe(playerid, eventname, _callback);
    }
  }

  /**
   * Shortcut method to trigger a player's play method. Will launch lightboxes if needed.
   *
   * @param playerid
   * @return self
   */
  play(playerid) {
    this.controller.play(playerid);
    return this;
  }

  /**
   * Returns the the players object if it was initiated yet
   * @param playerid
   * @return boolean false or object if found
   */
  getPlayer(playerid) {
    return this.controller.getPlayer(playerid);
  }

  /**
   * Should destroy a player instance if it exists. Lightbox players should be just closed.
   * @param playerid
   * @return void
   */
  destroyPlayer(playerid) {
    this.controller.removePlayer(playerid);
  }

  /**
   * Closes the lightbox and resets the lightbox player so that it can be reopened
   * @return void
   */
  closeLightbox() {
    this.controller.closeLightbox();
  }

  /**
   * Consolidates the players container and removes players that are not alive any more.
   * @return {[type]} [description]
   */
  consolidatePlayers() {
    this.controller.consolidatePlayers();
  }
}

export default Afterglow;
