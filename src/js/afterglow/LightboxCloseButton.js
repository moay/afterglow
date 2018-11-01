/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */

import DOMElement from '../lib/DOMElement';
import Controller from './AfterglowController';

export default class LightboxCloseButton extends DOMElement {
  constructor() {
    super();
    this.prepareNode();
    this.bindEvents();
  }

  prepareNode() {
    this.node = document.createElement('a');
    this.addClass('afterglow__button');
    this.addClass('afterglow__lightbox-close');
  }

  bindEvents() {
    this.bind('click', () => {
      Controller.closeLightbox();
    });
  }
}
