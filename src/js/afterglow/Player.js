/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowthis.com
 * @license MIT
 */
import Api from './PlayerApi';
import MediaElement from '../mediaelement/MediaElementWrapper';
import Config from './Config';
import Util from '../lib/Util';
import EventBus from './EventBus';
import DOMElement from '../lib/DOMElement';
import TopControlBar from './TopControlBar';
import ContextMenu from './ContextMenu';

class Player extends Api {
  constructor(videoelement) {
    super(videoelement);
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

    if (this.videoelement.getAttribute('data-contextmenu') !== 'false') {
      this.contextMenu = new ContextMenu();
    }

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
    (() => new MediaElement(this.videoelement.node, options))();
  }

  /**
   * Initiates callback and binds events when the player has been created   *
   * @param mediaElement
   * @param originalNode
   * @param instance
   * @param _callback
   */
  postInit(mediaElement, originalNode, instance, _callback) {
    this.mediaelement = instance;
    this.bindEvents(instance);
    this.applyResponsiveScaling();
    this.buildTopControlBar();

    if (typeof _callback === 'function') {
      _callback(this);
    }
  }

  /**
   * Applies the default classes to the videoelement and removes sublime's class
   * @return {void}
   */
  applyDefaultClasses() {
    this.videoelement.addClass('afterglow');

    const classNames = this.config.getSkinClass().split(' ');
    classNames.forEach((className) => {
      this.videoelement.addClass(className);
    });

    this.videoelement.removeClass('sublime');

    // Check for IE9 - IE11
    const ie = this.util.ie().actualVersion;
    if (ie >= 8 && ie <= 11) {
      this.videoelement.addClass('afterglow--IE');
    }
  }

  /**
   * Applies basic parameters to the videoelement to make it well usable for video.js
   * @return {void}
   */
  applyParameters() {
    if (this.videoelement.getAttribute('data-overscale') === 'false') {
      this.videoelement.setAttribute('data-maxwidth', this.videoelement.getAttribute('width'));
    }
  }

  applyResponsiveScaling() {
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

    if (document.querySelector('video').controls) {
      this.videoelement.addClass('afterglow-using-native-controls');
    }

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
   * Appends the top control bar to the player ui
   */
  buildTopControlBar() {
    const topControls = new TopControlBar(this);
    this.mediaelement.controls.appendChild(topControls.node);
  }

  /**
   * Calculates the players ratio based on the given value or on width/height
   * @return float
   */
  calculateRatio() {
    let ratio = 9 / 16;
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
  destroy(willBeDeleted) {
    if (!this.mediaelement.media.paused) {
      this.mediaelement.media.pause();
    }
    if (mejs.Features.isFullScreen()) {
      mejs.Features.cancelFullScreen();
    }
    if(!willBeDeleted) {
      this.mediaelement.remove();
    }
    this.alive = false;
  }

  bindEvents() {
    if (this.videoelement.getAttribute('data-volume') !== null) {
      const volume = parseFloat(this.videoelement.getAttribute('data-volume'));
      this.mediaelement.setVolume(volume);
    }

    const container = new DOMElement(this.mediaelement.container);

    this.mediaelement.media.addEventListener('play', () => {
      EventBus.dispatch(this.id, 'play');
      container.addClass('afterglow--started');
      container.removeClass('afterglow--paused');

      if (container.hasClass('afterglow--youtube-headstart')) {
        setTimeout(() => {
          container.removeClass('afterglow--youtube-headstart');
        }, 3000);
      }
    });

    this.mediaelement.media.addEventListener('pause', () => {
      EventBus.dispatch(this.id, 'paused');
      container.addClass('afterglow--paused');
    });

    this.mediaelement.media.addEventListener('ended', () => {
      EventBus.dispatch(this.id, 'ended');
      container.removeClass('afterglow-started');
    });

    this.mediaelement.media.addEventListener('volumechange', () => {
      EventBus.dispatch(this.id, 'volume-changed');
    });

    const browserPrefixes = ['webkit', 'fullscreenchange', 'ms', ''];
    browserPrefixes.forEach((prefix) => {
      document.addEventListener(`${prefix}fullscreenchange`, (event) => {
        this.handleFullscreenEvents(event);
      });
    });

    // Handle simple click somewhere in the video as play event
    this.mediaelement.controls.addEventListener('click', (e) => {
      if (e.target !== this.mediaelement.controls) {
        return;
      }
      if (this.paused()) {
        this.play();
      } else this.pause();
    });

    if (this.contextMenu instanceof ContextMenu) {
      container.appendChild(this.contextMenu.node);
      this.mediaelement.container.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.mediaelement.media.pause();
        this.contextMenu.open();
      });
    }

    EventBus.dispatch(this.id, 'ready');

    EventBus.subscribe(this.id, 'autoplay', () => {
      EventBus.dispatch(this.id, 'play');
    });
  }

  handleFullscreenEvents(event) {
    if (event.target !== this.mediaelement.container) {
      return;
    }

    if (!this.isFullscreen()) {
      this.mediaelement.container.classList.add('afterglow--fullscreen');
      EventBus.dispatch(this.id, 'fullscreen-entered');
    } else {
      this.mediaelement.container.classList.remove('afterglow--fullscreen');
      EventBus.dispatch(this.id, 'fullscreen-left');
    }
    EventBus.dispatch(this.id, 'fullscreen-changed');
  }

}

export default Player;
