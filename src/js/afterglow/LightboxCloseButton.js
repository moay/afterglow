import DOMElement from '../lib/DOMElement';
import Controller from './AfterglowController';

/**
 * Button to close the lightbox
*/
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
