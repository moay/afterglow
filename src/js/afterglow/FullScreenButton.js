/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */

import DOMElement from '../lib/DOMElement';

export default class FullScreenButton extends DOMElement {
  constructor(player) {
    super(player);
    this.prepareNode();
    this.bindEvents(player);
  }

  prepareNode() {
    this.node = document.createElement('a');
    this.addClass('afterglow__button');
    this.addClass('afterglow__fullscreen-toggle');
  }

  bindEvents(player) {
    this.bind('click', () => {
      if (player.isFullscreen()) {
        player.exitFullscreen();
      } else {
        player.requestFullscreen();
      }
    });
  }
}
