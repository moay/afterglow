/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */

import DOMElement from '../lib/DOMElement';
import LightboxCloseButton from './LightboxCloseButton';
import FullScreenButton from './FullScreenButton';

export default class TopControlBar extends DOMElement {
  constructor(player) {
    super();
    this.prepareNode();
    this.addButtons(player);
  }

  prepareNode() {
    this.node = document.createElement('div');
    this.addClass('afterglow__top-control-bar');
  }

  addButtons(player) {
    const fullScreenButton = new FullScreenButton(player);
    this.appendDomElement(fullScreenButton, 'fullScreen');
    const lightboxCloseButton = new LightboxCloseButton(player);
    this.appendDomElement(lightboxCloseButton, 'closeLightbox');
  }
}
