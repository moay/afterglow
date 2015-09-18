/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';

class AfterglowUtil {

	static isYoutubePlayer(videoelement){
		return videoelement.hasAttribute("data-youtube-id");
	}

}

export default AfterglowUtil;