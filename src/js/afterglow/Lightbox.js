/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */

import Player from './Player';
import EventBus from './EventBus';
import Util from '../lib/Util';
import DOMElement from '../lib/DOMElement';
import Emitter from '../lib/Emitter';

require('../../less/components/lightbox.less');

class Lightbox extends DOMElement {
  constructor() {
    super(document.createElement('div'));
    this.addClass('afterglow__lightbox-wrapper');
    this.build();
    this.bindEmitter();
  }

  /**
   * Prepares the lightbox elements which are needed to properly add them to the DOM
   * @return {void}
   */
  build() {
    // Prepare the lightbox elements
    const cover = this.buildCover();
    const lightbox = this.buildLightbox();

    this.appendDomElement(cover, 'cover');
    this.appendDomElement(lightbox, 'lightbox');
  }

  /**
   * Builds the Cover element
   * @return {DOMElement object}
   */
  buildCover() {
    let cover = document.createElement('div');
    cover = new DOMElement(cover);
    cover.addClass('afterglow__lightbox-cover');
    return cover;
  }

  /**
   * Builds the Lightbox element
   * @return {DOMElement object}
   */
  buildLightbox() {
    let lightbox = document.createElement('div');
    lightbox = new DOMElement(lightbox);
    lightbox.addClass('afterglow__lightbox');
    return lightbox;
  }

  /**
   * Initiating the Lightbox and enabling element binding
   * @return void
   */
  bindEmitter() {
    Emitter(this);
  }

  /**
   * Appends the real videoElement to the wrapper.
   * @param  videoelement
   * @return void
   */
  passVideoElement(videoelement) {
    this.playerid = videoelement.getAttribute('id');
    // This is not easily testable. But the constructor of DOMElement
    // is so simple that we rely on the UTs that exist for DOMElement.
    const domElement = new DOMElement(videoelement);
    this.lightbox.videoelement = domElement;
    this.lightbox.videoelement.setAttribute('autoplay', 'autoplay');
    this.lightbox.appendDomElement(domElement, 'videoelement');

    this.player = new Player(this.lightbox.videoelement);
  }

  /**
   * Method which will actually launch the player. Nodes will be appended to the DOM and all events will be bound.
   * @param _callback A callback function which will be executed after having completed the launch if needed.
   * @return {void}
   */
  launch(_callback) {
    const util = new Util();
    document.body.appendChild(this.node);
    this.lightbox.addClass('afterglow__lightbox-wrapper--launched');

    this.player.init(() => {
      // Adding autoclose functionality
      if (this.lightbox.videoelement.getAttribute('data-autoclose') === 'true') {
        this.player.mediaelement.media.addEventListener('ended', () => {
          this.close();
        });
      } else {
        // Else show the poster frame on ended.
        this.player.mediaelement.media.addEventListener('ended', () => {
          this.player.videojs.posterImage.show();
        });
      }

      // this.player.videojs.getChild('TopControlBar').addChild('LightboxCloseButton');
    });

    // Stop all active players if there are any playing
    // Object.keys(window.videojs.getPlayers()).forEach(key => {
    //   if (window.videojs.getPlayers()[key] !== null
    //     && window.videojs.getPlayers()[key].id_ !== this.playerid) {
    //     window.videojs.getPlayers()[key].pause();
    //   }
    // });

    // resize the lightbox and make it autoresize
    this.resize();
    util.addEventListener(window, 'resize', () => {
      this.resize();
    });

    // bind the closing event
    this.cover.bind('click', () => {
      this.close();
    });

    // bind the escape key
    util.addEventListener(window, 'keyup', (e) => {
      if (e.keyCode == 27) {
        this.close();
      }
    });

    // Launch the callback if there is one
    if (typeof _callback === 'function') {
      _callback(this);
    }

    // Triggering play in order to force autoplay
    this.player.mediaelement.media.play();
  }

  /**
   * Resize the lightbox according to the media ratio
   * @return void
   */
  resize() {
    // Standard HTML5 player
    if (this.lightbox.videoelement !== undefined) {
      var ratio = this.lightbox.videoelement.getAttribute('data-ratio');
      if (this.lightbox.videoelement.getAttribute('data-overscale') == 'false') {
        // Calculate the new size of the player with maxwidth
        var sizes = this.calculateLightboxSizes(ratio, parseInt(this.lightbox.videoelement.getAttribute('data-maxwidth')));
      } else {
        // Calculate the new size of the player without maxwidth
        var sizes = this.calculateLightboxSizes(ratio);
      }
    } else {
      // Youtube
      if (document.querySelectorAll('div.afterglow__lightbox-wrapper .vjs-youtube').length == 1) {
        const playerelement = document.querySelector('div.afterglow__lightbox-wrapper .vjs-youtube');
        var ratio = playerelement.getAttribute('data-ratio');
        var sizes = this.calculateLightboxSizes(ratio);
      }
    }

    // Apply the height and width
    this.node.style.width = sizes.width;
    this.node.style.height = sizes.height;

    this.lightbox.node.style.height = `${sizes.playerheight}px`;
    this.lightbox.node.style.width = `${sizes.playerwidth}px`;
    this.lightbox.node.style.top = `${sizes.playeroffsettop}px`;
    this.lightbox.node.style.left = `${sizes.playeroffsetleft}px`;
  }

  /**
   * calculates the current lightbox size based on window width and height and on the players ratio
   * @param ratio float The players ratio
   * @param maxwidth
   * @return object     Some sizes which can be used
   */
  calculateLightboxSizes(ratio, maxwidth) {
    const sizes = {};

    // Get window width && height
    sizes.width = window.clientWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth
    || window.innerWidth;
    sizes.height = window.clientHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight
    || window.innerHeight;

    // Window is wide enough
    if (sizes.height / sizes.width > ratio) {
      // Check if the lightbox should overscale, even if video is smaller
      if (typeof maxwidth !== 'undefined' && maxwidth < sizes.width * 0.90) {
        sizes.playerwidth = maxwidth;
      } else { // Else scale up as much as possible
        sizes.playerwidth = sizes.width * 0.90;
      }
      sizes.playerheight = sizes.playerwidth * ratio;
    } else {
      // Check if the lightbox should overscale, even if video is smaller
      if (typeof maxwidth !== 'undefined' && maxwidth < (sizes.height * 0.92) / ratio) {
        sizes.playerheight = maxwidth * ratio;
      } else { // Else scale up as much as possible
        sizes.playerheight = sizes.height * 0.92;
      }
      sizes.playerwidth = sizes.playerheight / ratio;
    }
    sizes.playeroffsettop = (sizes.height - sizes.playerheight) / 2;
    sizes.playeroffsetleft = (sizes.width - sizes.playerwidth) / 2;

    return sizes;
  }

  /**
   * Closes the lightbox and removes the nodes from the DOM.
   * @return void
   */
  close() {
    EventBus.dispatch(this.player.id, 'before-lightbox-close');
    this.player.destroy(true);
    this.lightbox.removeClass('afterglow__lightbox-wrapper--launched');
    this.node.parentNode.removeChild(this.node);
    this.emit('close');
  }

  /**
   * Returns the player
   * @return Player
   */
  getPlayer() {
    if (this.player !== undefined) {
      return this.player;
    }
    return undefined;
  }
}

export default Lightbox;
