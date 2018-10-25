/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */


import Player from './Player';
import LightboxTrigger from './LightboxTrigger';
import EventBus from './EventBus';
import DOMElement from '../lib/DOMElement';


class Afterglow {
  constructor() {
    /**
     * Will hold the players in order to make them accessible
     */
    this.players = [];

    /**
     * Will hold the trigger elements which will launch lightbox players
     */
    this.lightboxtriggers = [];

    /**
     * Will be true after initialization
     */
    this.initialized = false;

    /**
     * Container for callbacks that have to be executed when afterglow is initalized
     */
    this.afterinit = [];

    /**
     * Indicated whether or not video js has been configured
     * @type {boolean}
     */
    this.videoJsConfigured = false;
  }

  /**
   * Initiate all players that were found and need to be initiated
   * @return void
   */
  init() {
    this.configureVideoJS();
    this.initVideoElements();
    this.prepareLightboxVideos();

    this.initialized = true;

    // execute things to do when init done
    for (let i = 0; i < this.afterinit.length; i++) {
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
    for (let i = 0; i < players.length; i = i + 1) {
      const videoelement = new DOMElement(players[i]);
      const player = new Player(videoelement);
      player.init();
      this.players.push(player);
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
    for (let i = 0; i < lightboxtriggers.length; i++) {
      const trigger = new LightboxTrigger(lightboxtriggers[i]);

      this.bindLightboxTriggerEvents(trigger);

      this.lightboxtriggers.push(trigger);
    }
  }

  /**
   * Binds an event for any given player
   *
   * @param      string    playerid   The playerid
   * @param      string    eventname  The eventname
   * @param      mixed   _callback  The callback
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
   * Binds some elements for lightbox triggers.
   * @return void
   * @param trigger
   */
  bindLightboxTriggerEvents(trigger) {
    trigger.on('trigger', () => {
      this.consolidatePlayers;
    });
    trigger.on('close', () => {
      this.consolidatePlayers();
    });
  }

  /**
   * Shortcut method to trigger a player's play method. Will launch lightboxes if needed.
   *
   * @return void
   * @param playerid
   */
  play(playerid) {
    // Look out for regular player
    for (let i = this.players.length - 1; i >= 0; i -= 1) {
      if (this.players[i].id === playerid) {
        this.players[i].getPlayer().play();
      }
    }
    // Else try to trigger lightbox player
    for (let i = this.lightboxtriggers.length - 1; i >= 0; i -= 1) {
      if (this.lightboxtriggers[i].playerid === playerid) {
        this.lightboxtriggers[i].trigger();
      }
    }
  }

  /**
   * Returns the the players object if it was initiated yet
   * @param  string The player's id
   * @return boolean false or object if found
   */
  getPlayer(playerid) {
    // Try to get regular player
    for (let i = this.players.length - 1; i >= 0; i -= 1) {
      if (this.players[i].id === playerid) {
        return this.players[i].getPlayer();
      }
    }
    // Else try to find lightbox player
    for (let i = this.lightboxtriggers.length - 1; i >= 0; i -= 1) {
      if (this.lightboxtriggers[i].playerid === playerid) {
        return this.lightboxtriggers[i].getPlayer();
      }
    }
    return false;
  }

  /**
   * Should destroy a player instance if it exists. Lightbox players should be just closed.
   * @param  {string} playerid  The player's id
   * @return void
   */
  destroyPlayer(playerid) {
    // Look for regular players
    for (let i = this.players.length - 1; i >= 0; i -= 1) {
      if (this.players[i].id === playerid) {
        this.players[i].destroy();
        this.players.splice(i, 1);
        return true;
      }
    }
    // Else look for an active lightbox
    for (let i = this.lightboxtriggers.length - 1; i >= 0; i -= 1) {
      if (this.lightboxtriggers[i].playerid === playerid) {
        this.closeLightbox();
        return true;
      }
    }
    return false;
  }

  /**
   * Closes the lightbox and resets the lightbox player so that it can be reopened
   * @return void
   */
  closeLightbox() {
    for (let i = this.lightboxtriggers.length - 1; i >= 0; i -= 1) {
      this.lightboxtriggers[i].closeLightbox();
    }
    this.consolidatePlayers();
  }

  /**
   * Consolidates the players container and removes players that are not alive any more.
   * @return {[type]} [description]
   */
  consolidatePlayers() {
    for (let i = this.players.length - 1; i >= 0; i -= 1) {
      if (this.players[i] !== undefined && !this.players[i].alive) {
        delete this.players[i];

        // Reset indexes
        this.players = this.players.filter(() => true);
      }
    }
  }

  /**
   * Run some configurations on video.js to make it work for us
   * @return void
   */
  configureVideoJS() {
    // Disable tracking
    window.HELP_IMPROVE_VIDEOJS = false;
    this.videoJsConfigured = true;
  }
}

export default Afterglow;
