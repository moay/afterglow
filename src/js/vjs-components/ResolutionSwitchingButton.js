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
 		return `vjs-ag-res-button ${super.buildCSSClass()}`;
 	}

 	/**
 	 * Initiates the button and its functionality
 	 * @return {void}
 	 */
 	init(){
 		this.prepareSources();
 		this.setResolutionsNeededFromPlayer();
 		if(this.resolutionsNeeded){
 			this.switchSource(this.sources[0]);
	 		this.setCurrentResFromPlayer();

	 		// Bind events
	 		this.on('click',this.switchResolution);
	 		this.on('tap',this.switchResolution);
	 	}
	 	this.updateButton();

	 	var this_ = this;
	 	this.player_.on('ready', function(){
	 		this_.updateButton;
	 	});
	 	this.player_.on('play', function(){
	 		this_.updateButton;
	 	});
 	}

 	/**
 	 * Prepares the sources that are needed for the button functionality
 	 * @return {void}
 	 */
 	prepareSources(){
 		this.sources = this.getAbsoluteSources();
		this.sourcesByType = videojs.reduce(this.sources, function(init, val, i){
			(init[val.type] = init[val.type] || []).push(val);
			return init;
		}, {}, this.player_);
		this.typeAndTech = this.selectTypeAndTech(this.sources);
    }
    
    /**
     * Sets the currentRes based on the currently played source
     */
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
    	var videoEl = this.player_.el_.getElementsByTagName("video")[0];

    	if (this.player_.techName_ !== "Html5" || !videoEl) return;

    	var srcs = videoEl.getElementsByTagName("source");
    	for(var i=0;i<srcs.length;i++){
    		videoEl.removeChild(srcs[i]);
    	}
    }

    getAbsoluteSources(){
    	var sources = this.player_.options_['sources'];
		var base = window.location.href.match(/(.*\/)/)[0];
		var protocol = window.location.protocol;
		var origin = window.location.origin;
    	for (var i = sources.length - 1; i >= 0; i--) {
    		var src = sources[i].src;
    		if(src !== undefined && src !== ''){
    			// Handle absolute URLs (with protocol-relative prefix)
			    // Example: //domain.com/file.png
			    if (src.search(/^\/\//) != -1) {
			        src = protocol + src;
			    }

			    // Handle absolute URLs (with explicit origin)
			    // Example: http://domain.com/file.png
			    else if (src.search(/:\/\//) != -1) {
			        continue;
			    }

			    // Handle absolute URLs (without explicit origin)
			    // Example: /file.png
			    else if (src.search(/^\//) != -1) {
			        src = origin + src;
			    }

			    // Handle relative URLs
			    // Example: file.png
			    else{
			 		src = base + src;
			    }
			    sources[i].src = src;
    		}
    	};
    	return sources;
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
		switch(this.player_.techName_){
			case "Flash":
			    this.player_.tech_.el_.vjs_stop();
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

    	for (var i=0,j=this.player_.options_['techOrder'];i<j.length;i++) {
    		techName = this.player_.techName_;
    		tech     = window.videojs.getTech(techName);

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
	    if (this.player_.techName_ === "Html5"){
	        this.player_.src(new_source.src);
	    } else {
	        this.player_.loadTech(this.player_.techName_, {src: new_source.src});
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

	/**
	 * Updates the button display the currently active quality.
	 */
	updateButton(){
		var buttonEl = this.prepareButtonElement(this.el_);

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

	prepareButtonElement(buttonEl){
		if(typeof buttonEl.addClass !== 'function'){
			buttonEl.addClass = function(className){
				if(this.classList) {
			        this.classList.add(className);
			    } else if (-1 == this.className.indexOf(className)) {
			        var classes = this.className.split(" ");
			        classes.push(className);
			        this.className = classes.join(" ");
			    }
			    return this;
			}
		}
		if(typeof buttonEl.removeClass !== 'function'){
			buttonEl.removeClass = function(className){
			    if (this.classList) {
			        this.classList.remove(className);
			    } else {
			        var classes = this.className.split(" ");
			        classes.splice(classes.indexOf(className), 1);
			        this.className = classes.join(" ");
			    }
			    return this;
			}
		}
		return buttonEl;
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