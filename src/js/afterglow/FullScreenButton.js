import DOMElement from '../lib/DOMElement';

/**
 * Button to enter and leave fullscreen
*/
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

  /**
   * @param player
   */
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
