'use strict';

const VjsButtonResBBase = videojs.getComponent('Button');

/**
 * Button to close the lightbox
 *
 * @extends Button
 * @class LightboxCloseButton
 */
 class ResolutionSwitchingButton extends VjsButtonResBBase {

 	constructor(player, options) {
 		super(player, options);
 		this.init();
 	}

 	buildCSSClass(){
 		return 'vjs-ag-res-button vjs-control vjs-button';
 	}

 	init(){
 		this.createPlayerMethods();
 		this.prepareSources();
 		
 		this.setCurrentResFromPlayer();
 		this.setResolutionsNeededFromPlayer();

 		this.updateButton();
 		this.on('click',this.switchResolution);
 	}

 	prepareSources(){
 		this.sources = this.player_.options_['sources'];
		this.sourcesByType = videojs.reduce(this.sources, function(init, val, i){
			(init[val.type] = init[val.type] || []).push(val);
			return init;
		}, {}, this.player_);
		this.typeAndTech = this.selectTypeAndTech(this.sources);
    }
    
    setCurrentResFromPlayer(){
    	var currentSrc = this.player_.src();
    	var allSources = this.sources;
    	for (var i = allSources.length - 1; i >= 0; i--) {
    		if(allSources[i]['src'] == currentSrc){
		    	if(allSources[i]['data-quality'] !== 'hd'){
		    		this.currentRes = 'sd';
		    	}
		    	else{
		    		this.currentRes = 'hd';
		    	}
    		}
    	};
    }

	setResolutionsNeededFromPlayer(){
		// Fallback
		this.resolutionsNeeded = false;
		
		// Real determination
		if(typeof this.typeAndTech == 'object'){
			var type = this.typeAndTech.type;
			if(this.sourcesByType[type] !== undefined
				&& this.sourcesByType[type].length > 1){
				for (var i = this.sourcesByType[type].length - 1; i >= 0; i--) {
					if(this.sourcesByType[type][i]['data-quality'] !== undefined
						|| this.sourcesByType[type][i]['data-quality'] != this.currentRes){
						this.resolutionsNeeded = true;
						return;
					}
				};
			}
		}
	}

    removeSources(){
    	var videoEl = this.player_.el_.getElementsByTagName("video")[0];

    	if (this.player_.techName !== "Html5" || !videoEl) return;

    	var srcs = videoEl.getElementsByTagName("source");
    	for(var i=0;i<srcs.length;i++){
    		videoEl.removeChild(srcs[i]);
    	}
    }

    getSourceForResolutionChange(){
    	var type = this.typeAndTech.type;
    	var availableSources = this.sourcesByType[type];
    	for (var i = availableSources.length - 1; i >= 0; i--) {
    		if(this.currentRes == 'hd'){
    			if(availableSources[i]['data-quality'] == undefined 
    				|| availableSources[i]['data-quality'] !== 'hd')
    				return availableSources[i];
    		}
    		else{
    			if(availableSources[i]['data-quality'] == 'hd')
    				return availableSources[i];
    		}
    	};
    	// Fallback if all other options failed...
    	return availableSources[0];
    }

 	switchResolution(){
 		var sourceToPlay = this.getSourceForResolutionChange();
 		console.log(sourceToPlay);
 		this.switchSource(sourceToPlay);
 	}

 	stopStream(){
		switch(this.player_.techName){
			case "Flash":
			    this.player_.tech.el_.vjs_stop();
			    break;
		}

		// this may cause flash or the native player to emit errors but
		// they are harmless
		this.player_.src("");
    }

    selectSource(sources){
		this.removeSources();

		var sourcesByType = this.sourcesByType;
		var typeAndTech   = this.selectTypeAndTech(sources);

		if (!typeAndTech) return false;

		// even though we choose the best resolution for the user here, we
		// should remember the resolutions so that we can potentially
		// change resolution later
		this.options_['sourceResolutions'] = sourcesByType[typeAndTech.type];

		return this.selectResolution(this.options_['sourceResolutions']);
    }

    /**
     * Returns the media type and tech to use
     * @return {object}
     */
    selectTypeAndTech(sources) {
    	var techName;
    	var tech;

    	for (var i=0,j=this.player_.options_['techOrder'];i<j.length;i++) {
    		techName = this.player_.techName;
    		tech     = window['videojs'].getComponent(techName);

	        // Check if the browser supports this technology
	        if (tech.isSupported()) {
				// Loop through each source object
				for (var a=0,b=sources;a<b.length;a++) {
		          	var source = b[a];
		            // Check if source can be played with this technology
		            if (tech['canPlaySource'](source)) {
		            	return { type: source.type, tech: techName };
		            }
		        }
		    }
		}
	}

	selectResolution(typeSources) {
		var defaultRes = 0;
		var supportsLocalStorage = !!window.localStorage;

		// if the user has previously selected a preference, check if
		// that preference is available. if not, use the source marked
		// default
		var preferredRes = defaultRes;

		// trying to follow the videojs code conventions of if statements
		if (supportsLocalStorage){
			var storedRes = parseInt(window.localStorage.getItem('videojs_preferred_res'), 10);

			if (!isNaN(storedRes))
				preferredRes = storedRes;
		}

		var maxRes    = (typeSources.length - 1);
		var actualRes = preferredRes > maxRes ? maxRes : preferredRes;

		return typeSources[actualRes];
	}

	/** takes a source and switches the player's stream to it on the fly
	* @param {Object} singular source:
	* {
	*     "data-default": "true",
	*     "data-res": "SD",
	*     "type": "video/mp4",
	*     "src": "http://some_video_url_sd"
	* }
	*/
	switchSource(new_source){
	    // has the exact same source been chosen?
	    if (this.player_.cache_.src === new_source.src){
			this.player_.trigger('resolutionchange');
			return this.player_; // basically a no-op
	    }

	    // remember our position and playback state
	    var curTime      = this.player_.currentTime();
	    var remainPaused = this.player_.paused();

	    // pause playback
	    this.player_.pause();

	    // attempts to stop the download of the existing video
	    this.stopStream();

	    // HTML5 tends to not recover from reloading the tech but it can
	    // generally handle changing src. Flash generally cannot handle
	    // changing src but can reload its tech.
	    if (this.player_.techName === "Html5"){
	        this.player_.src(new_source.src);
	    } else {
	        this.player_.loadTech(this.player_.techName, {src: new_source.src});
	    }

	    var _this = this;

	    // when the technology is re-started, kick off the new stream
	    this.player_.ready(function() {
			this.player_.one('loadeddata', videojs.bind(this.player_, function() {
				this.player_.currentTime(curTime);
			}));

			this.player_.trigger('resolutionchange');

			if (!remainPaused) {
				this.player_.load();
				this.player_.play();
			}

			// remember this selection
			localStorage.setItem('videojs_preferred_res', parseInt(new_source.index, 10));

			_this.setCurrentResFromPlayer();
			_this.updateButton();
	    });
	}

	updateButton(){
		var buttonEl = this.el_;
		if(!this.resolutionsNeeded){
			buttonEl.addClass("vjs-hidden");
		}
		else{
			buttonEl.removeClass("vjs-hidden");
		}

		if(this.currentRes == 'hd'){
			buttonEl.addClass("vjs-ag-res-hd");
		}
		else{
			buttonEl.removeClass("vjs-ag-res-hd");
		}
		this.el_.blur();
	}

	createPlayerMethods(){
		// this.player_.resolution = function(){
		// 	return this.cache_.src.res;
		// }
	}
}

/**
 * 'reduce' utility method
 * @param {Array} array to iterate over
 * @param {Function} iterator function for collector
 * @param {Array|Object|Number|String} initial collector
 * @return collector
 */
videojs.reduce = function(arr, fn, init, n) {
	if (!arr || arr.length === 0) { return; }
	for (var i=0,j=arr.length; i<j; i++) {
		init = fn.call(arr, init, arr[i], i);
	}
	return init;
};

(function(){

	videojs.registerComponent('ResolutionSwitchingButton', ResolutionSwitchingButton);

})();