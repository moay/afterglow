/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */

import Lightbox from './Lightbox';
import EventBus from './EventBus';
import Emitter from '../lib/Emitter';
import DOMElement from '../lib/DOMElement';

class LightboxTrigger extends DOMElement {
  constructor(node) {
    super(node);
    this.setup();
  }

  setup() {
    this.playerid = this.node.getAttribute('href').replace('#', '');

    const videoelement = document.querySelector(`#${this.playerid}`);
    this.videoelement = new DOMElement(videoelement);
  }

  /**
   * Initializes all atributes and prepares the trigger element for further interaction
   * @return {void}
   */
  init() {
    this.prepare();

    Emitter(this);
  }

  /**
   * Prepares the video element to be used for the lightbox player.
   * @return {void}
   */
  prepare() {
    this.videoelement.addClass('afterglow__lightbox-player');

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
  trigger() {
    this.lightbox = new Lightbox();

    const videoelement = this.videoelement.cloneNode(true);

    this.lightbox.passVideoElement(videoelement);

    this.emit('trigger');
    EventBus.dispatch(this.playerid, 'lightbox-launched');

    this.lightbox.launch();

    this.lightbox.on('close', () => {
      EventBus.dispatch(this.playerid, 'lightbox-closed');
      this.emit('close');
    });
  }

  /**
   * Closes the lightbox if possible and removes the player from the
   * trigger element so that it gets reinitiated on next trigger
   * @return {void}
   */
  closeLightbox() {
    if (this.lightbox !== undefined) {
      this.lightbox.close();
      this.deleteLightbox();
    }
  }

  /**
   * Deletes the lightbox element if there is one.
   * @return {void}
   */
  deleteLightbox() {
    if (this.lightbox !== undefined) {
      delete this.lightbox;
    }
  }

  /**
   * @return {object} Returns the player from the lightbox.
   */
  getPlayer() {
    if (this.lightbox !== undefined) {
      return this.lightbox.getPlayer();
    }
    return undefined;
  }
}

export default LightboxTrigger;
