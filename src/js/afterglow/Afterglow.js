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
    const players = document.querySelectorAll('video.afterglow,video.sublime');
    players.forEach((playerNode) => {
      const player = new Player(new DOMElement(playerNode));
      this.controller.addPlayer(player);
    });
  }

  /**
   * Prepares all found trigger elements and makes them open their corresponding players when needed
   * @return void
   */
  prepareLightboxVideos() {
    const lightboxTriggers = document.querySelectorAll('a.afterglow,a.sublime');
    lightboxTriggers.forEach((triggerNode) => {
      const trigger = new LightboxTrigger(triggerNode);
      return this.controller.addLightboxPlayer(trigger);
    });
  }

  addPlayer(idOrElement) {
    let videoelement = idOrElement;
    if (typeof idOrElement === 'string') {
      videoelement = document.getElementById(idOrElement);
    }
    if (!(videoelement instanceof DOMElement)) {
      videoelement = new DOMElement(videoelement);
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
      if (eventname === 'ready' && this.getPlayer(playerid) && this.getPlayer(playerid).alive) {
        EventBus.execute(_callback, 'ready', playerid);
      }
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
