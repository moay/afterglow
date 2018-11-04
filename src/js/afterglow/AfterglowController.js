/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
class AfterglowController {
  constructor() {
    /**
     * Will hold the players in order to make them accessible
     */
    this.players = [];

    /**
     * Will hold the trigger elements which will launch lightbox players
     */
    this.lightboxtriggers = [];
  }

  addPlayer(player) {
    if (this.getPlayer(player.id) !== undefined) {
      return;
    }
    player.init();
    this.players.push(player);
  }

  addLightboxPlayer(trigger) {
    if (this.getPlayer(trigger.id) !== undefined) {
      return;
    }
    trigger.init();
    this.bindLightboxTriggerEvents(trigger);
    this.lightboxtriggers.push(trigger);
  }

  /**
   * Binds some elements for lightbox triggers.
   * @return void
   * @param trigger
   */
  bindLightboxTriggerEvents(trigger) {
    trigger.on('trigger', () => {
      this.consolidatePlayers();
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
        this.players[i].play();
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
        return this.players[i];
      }
    }
    // Else try to find lightbox player
    for (let i = this.lightboxtriggers.length - 1; i >= 0; i -= 1) {
      if (this.lightboxtriggers[i].playerid === playerid) {
        return this.lightboxtriggers[i].getPlayer();
      }
    }
    return undefined;
  }

  /**
   * Should destroy a player instance if it exists. Lightbox players should be just closed.
   * @param  {string} playerid  The player's id
   * @return void
   */
  removePlayer(playerid) {
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
}

export default new AfterglowController();
