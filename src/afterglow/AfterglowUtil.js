/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';

class AfterglowUtil {

	isYoutubePlayer(videoelement){
		return videoelement.hasAttribute("data-youtube-id");
	}

	ie(){
		var ret, 
			isTheBrowser,
	        actualVersion,
	        jscriptMap, 
	        jscriptVersion;

	    isTheBrowser = false;

	    jscriptMap = {
	        "5.5": "5.5",
	        "5.6": "6",
	        "5.7": "7",
	        "5.8": "8",
	        "9": "9",
	        "10": "10"
	    };
	    jscriptVersion = new Function("/*@cc_on return @_jscript_version; @*/")();

	    if (jscriptVersion !== undefined) {
	        isTheBrowser = true;
	        actualVersion = jscriptMap[jscriptVersion];
	    }

	    ret = {
	        isTheBrowser: isTheBrowser,
	        actualVersion: actualVersion
	    };

	    if(!isTheBrowser){
	        if(window.navigator.userAgent.indexOf("Trident/7.0") > 0 && !/x64|x32/ig.test(window.navigator.userAgent)){       
	            ret = {
	                isTheBrowser: true,
	                actualVersion: "11"
	            };
	        }
	    }
	    return ret;
	}

}

export default AfterglowUtil;