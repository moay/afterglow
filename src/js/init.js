/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */

import Afterglow from './afterglow/Afterglow';

window.afterglow = new Afterglow();

document.addEventListener('DOMContentLoaded', () => {
  window.afterglow.init();
});
