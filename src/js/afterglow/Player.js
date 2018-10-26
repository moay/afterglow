/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowthis.com
 * @license MIT
 */
import MediaElement from '../mediaelement/MediaElementWrapper';
import Config from './Config';
import Util from '../lib/Util';
import EventBus from './EventBus';
import DOMElement from '../lib/DOMElement'

class Player {
  constructor(videoelement) {
    // Passing to setup for testability
    this.setup(videoelement);
  }

  /**
   * Sets the player up and prepares the video element
   * @param videoelement DOMElement   The videoelement which shall be transformed
   */
  setup(videoelement) {
    this.videoelement = videoelement;
    this.mediaelement = null;
    this.id = videoelement.getAttribute('id');

    // Prepare needed dependencies
    this.config = new Config(videoelement, this.getSkinName());
    this.util = new Util();

    // Prepare the element
    this.prepareMediaElement();

    // Set an activity variable to be able to detect if the player can be deleted
    this.alive = true;
  }

  /**
   * Shortcut method which will apply some classes and parameters
   * to the video element via some other methods
   * @return
   */
  prepareMediaElement() {
    this.applyDefaultClasses();
    this.applyParameters();

    if (this.util.isYoutubePlayer(this.videoelement)) {
      this.applyYoutubeClasses();
    } else if (this.util.isVimeoPlayer(this.videoelement)) {
      this.applyVimeoClasses();
    }
  }

  /**
   * Initializes the player and applies all needed stuff.
   * @param  {function} _callback   Callback function to be called when the player is ready
   * @return {void}
   */
  init(_callback) {
    const { options } = this.config;
    options.success = (mediaElement, node, instance) => {
      this.postInit(mediaElement, node, instance, _callback);
    };
    new MediaElement(this.videoelement.node, options);
  }

  postInit(mediaElement, originalNode, instance, _callback) {
    this.mediaelement = instance;
    this.bindEvents(instance);
    this.applyResponsiveScaling();

    // Launch the callback if there is one
    if (typeof _callback === 'function') {
      _callback(this);
    }
  }

  /**
   * Applies the default classes to the videoelement and removes sublime's class
   * @return {void}
   */
  applyDefaultClasses() {
    // Add some classes
    this.videoelement.addClass('afterglow');

    const classNames = this.config.getSkinClass().split(' ');
    classNames.forEach((className) => {
      this.videoelement.addClass(className);
    });

    // Remove sublime stuff
    this.videoelement.removeClass('sublime');

    // Check for IE9 - IE11
    const ie = this.util.ie().actualVersion;
    if (ie >= 8 && ie <= 11) { // @see afterglow-lib.js
      this.videoelement.addClass('afterglow-IE');
    }
  }

  /**
   * Applies basic parameters to the videoelement to make it well usable for video.js
   * @return {void}
   */
  applyParameters() {
    // Make lightboxplayer not overscale
    if (this.videoelement.getAttribute('data-overscale') === 'false') {
      this.videoelement.setAttribute('data-maxwidth', this.videoelement.getAttribute('width'));
    }
  }

  applyResponsiveScaling() {
    // Apply some responsive stylings
    if (this.videoelement.getAttribute('data-autoresize') !== 'none'
      && this.videoelement.getAttribute('data-autoresize') !== 'false') {
      const container = new DOMElement(this.mediaelement.container);
      container.addClass('afterglow__container--responsive');

      const ratio = this.calculateRatio();
      container.node.style.paddingTop = `${ratio * 100}%`;
      this.videoelement.removeAttribute('height');
      this.videoelement.removeAttribute('width');
      this.videoelement.setAttribute('data-ratio', ratio);
    }
  }

  /**
   * Applies all needed classes to the videoelement in order to provide proper youtube playback
   * @return {void}
   */
  applyYoutubeClasses() {
    this.videoelement.addClass('afterglow--youtube');
    this.videoelement.addClass('afterglow--youtube-headstart');

    // Check for native playback
    if (document.querySelector('video').controls) {
      this.videoelement.addClass('afterglow-using-native-controls');
    }
    // Add iOS class for iOS.
    if (/iPad|iPhone|iPod|iOS/.test(navigator.platform)) {
      this.videoelement.addClass('afterglow--iOS');
    }
  }

  /**
   * Applies all needed classes to the videoelement in order to provide proper vimeo playback
   * @return {void}
   */
  applyVimeoClasses() {
    this.videoelement.addClass('afterglow--vimeo');
  }

  /**
   * Calculates the players ratio based on the given value or on width/height
   * @return float
   */
  calculateRatio() {
    let ratio = 0;
    if (this.videoelement.getAttribute('data-ratio')) {
      ratio = this.videoelement.getAttribute('data-ratio');
    } else if (!this.videoelement.getAttribute('height') || !this.videoelement.getAttribute('width')) {
      return ratio;
    } else {
      ratio = this.videoelement.getAttribute('height') / this.videoelement.getAttribute('width');
    }
    return parseFloat(ratio);
  }

  /**
   * Gets the current player's skin name for further use in css variables and so on.
   * @return {string}
   */
  getSkinName() {
    if (this.videoelement.getAttribute('data-skin')) {
      return this.videoelement.getAttribute('data-skin');
    }
    return 'afterglow';
  }

  /**
   * Destroys the player instance and disposes it.
   * @return {void}
   */
  destroy() {
    if (!this.mediaelement.media.paused) {
      this.mediaelement.media.pause();
    }
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
    }
    this.mediaelement.remove();
    this.alive = false;
  }

  bindEvents(instance) {

    // Set initial volume if needed
    if (this.videoelement.getAttribute('data-volume') !== null) {
      const volume = parseFloat(this.videoelement.getAttribute('data-volume'));
      this.mediaelement.setVolume(volume);
    }
    return;

    this.mediaelement.addEventListener('play', () => {
      // Trigger afterglow play event
      EventBus.dispatch(this.id(), 'play');

      // // Remove youtube player class after 5 seconds if youtube player
      // if (this.el_.classList.contains('afterglow-youtube-headstart')) {
      //   const el = this.el_;
      //   setTimeout(() => {
      //     el.classList.remove('afterglow-youtube-headstart');
      //   }, 3000);
      // }
    });

    // Trigger afterglow ended event
    instance.on('pause', () => {
      EventBus.dispatch(this.id(), 'paused');
    });

    // Trigger afterglow ended event
    instance.on('ended', () => {
      EventBus.dispatch(this.id(), 'ended');
    });

    // Trigger afterglow ended event
    instance.on('volumechange', () => {
      EventBus.dispatch(this.id(), 'volume-changed');
    });

    // Trigger afterglow fullscreen events
    instance.on('fullscreenchange', () => {
      if (this.isFullscreen()) {
        EventBus.dispatch(this.id(), 'fullscreen-entered');
      } else {
        EventBus.dispatch(this.id(), 'fullscreen-left');
      }
      EventBus.dispatch(this.id(), 'fullscreen-changed');
    });

    // Trigger afterglow ready event
    EventBus.dispatch(this.id(), 'ready');

    this.on('autoplay', () => {
      // Trigger afterglow play event
      EventBus.dispatch(this.id(), 'play');
    });
  }

  // API METHODS

  play() {

  }

  pause() {

  }

  paused() {

  }

  requestFullscreen() {

  }

  exitFullscreen() {

  }

  isFullscreen() {

  }

  volume() {

  }

  duration() {

  }

  currentTime() {

  }

  remainingTime() {

  }

  ended() {

  }

}

export default Player;
