'use strict';

const VjsButton = videojs.getComponent('Button');

/**
 * Button to close the lightbox
 *
 * @extends Button
 * @class LightboxCloseButton
 */
class LightboxCloseButton extends VjsButton {

  constructor(player, options) {
    super(player, options);
  }

  buildCSSClass(){
  	return 'vjs-lightbox-close-button vjs-button vjs-control';
  }
}


(function(){

	videojs.registerComponent('LightboxCloseButton', LightboxCloseButton);

})();