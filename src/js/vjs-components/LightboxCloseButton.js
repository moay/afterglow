'use strict';

const VjsLBButtonClose = videojs.getComponent('Button');

/**
 * Button to close the lightbox
 *
 * @extends Button
 * @class LightboxCloseButton
*/
class LightboxCloseButton extends VjsLBButtonClose {

 	constructor(player, options) {
 		super(player, options);
 		this.on('click', this.closeClick);
 		this.on('tap', this.closeClick);
 	}

 	buildCSSClass(){
 		return 'vjs-lightbox-close-button vjs-button vjs-control';
 	}

 	/**
 	 * This will close afterglow's lightbox and remove the player from the DOM
 	 * @return {void}
 	 */
 	closeClick(){
 		afterglow.closeLightbox();
 	}
}


(function(){

 	videojs.registerComponent('LightboxCloseButton', LightboxCloseButton);

})();