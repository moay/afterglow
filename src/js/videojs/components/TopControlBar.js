import videojs from 'video.js';

/**
 * Container of some controls at the top of the player
 *
 * @extends Component
 * @class TopControlBar
 */
class TopControlBar extends videojs.getComponent('Component') {
  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */
  createEl() {
    return super.createEl('div', {
      className: 'vjs-top-control-bar',
    });
  }
}

TopControlBar.prototype.options_ = {
  loadEvent: 'play',
  children: [
    'fullscreenToggle',
  ],
};

export default TopControlBar;
