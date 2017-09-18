/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';

class Util {

    /**
     * Checks wether or not the given video element should be converted into a video element
     * @param  {DOMElement object || DOM node}  videoelement
     * @return {Boolean}
     */
	isYoutubePlayer(videoelement){
		return videoelement.hasAttribute("data-youtube-id");
	}

    /**
     * Gets a youtube video thumbnail
     * @param  {string} id  The videos youtube id
     * @return {string} the url to the thumbnail
     */
    loadYoutubeThumbnailUrl(id){
        var uri = 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg';
        return uri;
    };

    /**
     * Checks wether or not the given video element is a vimeo player
     * @param  {DOMElement object || DOM node} videoelement
     * @return {Boolean}
     */
    isVimeoPlayer(videoelement){
        return videoelement.hasAttribute("data-vimeo-id");
    }

    /**
     * Checks wether or not the given video element should trigger the dailymotion tech
     * @param  {DOMElement object || DOM node}  videoelement
     * @return {Boolean}
     */
    isDailymotionPlayer(videoelement){
        return videoelement.hasAttribute("data-dailymotion-id");
    }

    /**
     * Returns some information about the currently used IE
     * @return {object}
     */
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

    /**
     * Checks wether or not the currently used device is a mobile one
     * @return {boolean}
     */
    isMobile(){
        var Android = () => { return navigator.userAgent.match(/Android/i); };
        var BlackBerry = () => { return navigator.userAgent.match(/BlackBerry/i); };
        var iOS = () => { return navigator.userAgent.match(/iPhone|iPad|iPod/i); };
        var Opera = () => { return navigator.userAgent.match(/Opera Mini/i); };
        var Windows = () => { return navigator.userAgent.match(/IEMobile/i); };

        return (Android() || BlackBerry() || iOS() || Opera() || Windows()) ? true : false;
    }

    /**
     * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
     * @param obj1
     * @param obj2
     * @returns obj3 a new object based on obj1 and obj2
     */
    merge_objects(obj1,obj2){
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    }

    /**
     * Adds an event to some node object
     * @param {node}  object      The DOM node that should be bound
     * @param {string}   type     The event to bind
     * @param {Function} callback 
     */
    addEventListener(object, type, callback) {
        if (object == null || typeof(object) == 'undefined') return;
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
        } else if (object.attachEvent) {
            object.attachEvent("on" + type, callback);
        } else {
            object["on"+type] = callback;
        }
    };

}

export default Util;