'use strict';

const VjsButtonResBBase = videojs.getComponent('Button');

/**
 * Button to switch resolutions based on the data-quality attribute.
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

 	/**
 	 * Initiates the button and its functionality
 	 * @return {void}
 	 */
 	init(){
 		this.prepareSources();
 		
 		this.setCurrentResFromPlayer();
 		this.setResolutionsNeededFromPlayer();

 		this.updateButton();
 		this.on('click',this.switchResolution);
 		this.on('tap',this.switchResolution);
 	}

 	/**
 	 * Prepares the sources that are needed for the button functionality
 	 * @return {void}
 	 */
 	prepareSources(){
 		this.sources = this.player().options_['sources'];
		this.sourcesByType = videojs.reduce(this.sources, function(init, val, i){
			(init[val.type] = init[val.type] || []).push(val);
			return init;
		}, {}, this.player());
		this.typeAndTech = this.selectTypeAndTech(this.sources);
    }
    
    /**
     * Sets the currentRes based on the currently played source
     */
    setCurrentResFromPlayer(){
    	var currentSrc = this.player().src();
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

    /**
     * Checks if the plugin is needed for that player
     */
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

	/**
	 * Removes all sources without actually disposing the player
	 * @return {void}
	 */
    removeSources(){
    	var videoEl = this.player().el_.getElementsByTagName("video")[0];

    	if (this.player().techName !== "Html5" || !videoEl) return;

    	var srcs = videoEl.getElementsByTagName("source");
    	for(var i=0;i<srcs.length;i++){
    		videoEl.removeChild(srcs[i]);
    	}
    }

    /**
     * Gets the source that should be launched on the next resolution change
     * @return {object} The source object which should be played
     */
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

    /**
     * Changes the currently played source to another solution if possible
     * @return {[type]} [description]
     */
 	switchResolution(){
 		var sourceToPlay = this.getSourceForResolutionChange();
 		this.switchSource(sourceToPlay);
 	}

 	/**
 	 * Stops the currently playing stream without disposing the player
 	 * @return {[type]} [description]
 	 */
 	stopStream(){
		switch(this.player().techName){
			case "Flash":
			    this.player().tech.el_.vjs_stop();
			    break;
		}
    }

    /**
     * Selectes sources by type
     */
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

    	for (var i=0,j=this.player().options_['techOrder'];i<j.length;i++) {
    		techName = this.player().techName;
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

	/**
	 * Selects a source for a given resolution
	 */
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
	    if (this.player().cache_.src === new_source.src){
			this.player().trigger('resolutionchange');
			return this.player(); // basically a no-op
	    }

	    // remember our position and playback state
	    var curTime      = this.player().currentTime();
	    var remainPaused = this.player().paused();

	    // pause playback
	    this.player().pause();

	    // attempts to stop the download of the existing video
	    this.stopStream();

	    // HTML5 tends to not recover from reloading the tech but it can
	    // generally handle changing src. Flash generally cannot handle
	    // changing src but can reload its tech.
	    if (this.player().techName === "Html5"){
	        this.player().src(new_source.src);
	    } else {
	        this.player().loadTech(this.player().techName, {src: new_source.src});
	    }

	    var _this = this;

	    // when the technology is re-started, kick off the new stream
	    this.player().ready(function() {
			this.player().one('loadeddata', videojs.bind(this.player(), function() {
				this.player().currentTime(curTime);
			}));

			this.player().trigger('resolutionchange');

			if (!remainPaused) {
				this.player().load();
				this.player().play();
			}

			// remember this selection
			localStorage.setItem('videojs_preferred_res', parseInt(new_source.index, 10));

			_this.setCurrentResFromPlayer();
			_this.updateButton();
	    });
	}

	/**
	 * Updates the button display the currently active quality.
	 */
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

		// Get rid of the focus when having clicked the button
		this.el_.blur();
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