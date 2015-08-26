afterglow = {
	/**
	 * Will hold the players in order to make them accessible
	 * @type Object
	 */
	players : [],

	/**
	 * Initiate all players that were found and need to be initiated
	 * @return void
	 */
	init : function(){
		// Run some preparations
		this.configureVideoJS();

		// Get players including sublime fallback
		var players = $dom.get("video.afterglow, video.sublime");
		for (var i = 0; i < players.length; i++){
			this.initPlayer(players[i]);
		}

		// Get players to open in a lightbox including sublime fallback
		var lightboxplayers = $dom.get("a.afterglow, a.sublime");
		for (var i = 0; i < lightboxplayers.length; i++){
			this.initLightboxPlayer(lightboxplayers[i]);
		}

	},

	/**
	 * Initiate one player
	 * @param  {domelement}  videoel  The video element which should be converted
	 * @return void
	 */
	initPlayer : function(videoel){
		// Prepare the player element for videojs
		this.preparePlayer(videoel);

		// Get the options object for videojs
		var options = this.getPlayerOptions(videoel);

		if(this.isYoutubePlayer(videoel)){
			options = merge_options(options, this.getYoutubeOptions(videoel));
		}

		// initiate videojs and do some post initiation stuff
		var player = videojs(videoel, options).ready(function(){
			// Apply the styles that might be needed by the skin
			afterglow.applySkinStyles(player);

			// Enable hotkeys
			this.hotkeys({
				enableFullscreen: false,
				enableNumbers: false
			});
		})

		// Push the player to the accessible ones
		this.players.push(player);
	},

	/**
	 * Re-initiate a player by its ID
	 * @param  {string}  playerid  The id of the video element which should be converted
	 * @return void
	 */
	reInitPlayer : function(playerid){
		var player = $dom.get("video#"+playerid)[0];
		this.initPlayer(player);
	},

	/**
	 * Method to prepare the lightbox players and make them initiate when their time has come
	 * @param  {domelement} linkel  The DOM element which initiates the lightbox
	 * @return {void}
	 */
	initLightboxPlayer : function(linkel){
		// Get the playerid
		var playerid = linkel.getAttribute("href");

		// Hide the video element
		var videoel = $dom.get(playerid)[0];
		$dom.addClass(videoel, "afterglow-lightboxplayer");

		// Prepare the element
		if(videoel.hasAttribute("poster")){
			videoel.removeAttribute("poster");
		}
		if(videoel.hasAttribute("data-poster")){
			videoel.removeAttribute("data-poster");
		}
		videoel.setAttribute("data-autoresize","fit");

		linkel.onclick = function(e){
			// Prevent the click event, IE8 compatible
			e = e ? e : window.event;
			e.preventDefault();

			// Launch the lightbox
			afterglow.launchLightbox(videoel);
		};
	},

	/**
	 * Re-initiate a player lightbox by its player ID
	 * @param  {string}  playerid  The id of the video element which should be converted
	 * @return void
	 */
	reInitLightboxPlayer : function(playerid){
		var lightboxplayers = $dom.get("a.afterglow, a.sublime");
		for (var i = 0; i < lightboxplayers.length; i++){
			if(lightboxplayers[i].getAttribute('href') === '#'+playerid){
				this.initLightboxPlayer(lightboxplayers[i]);
			}
		}
	},

	/**
	 * Prepare a video element for further use with videojs
	 * @param  domelement  videoel  The video element which should be prepared
	 * @return void
	 */
	preparePlayer : function(videoel){
		// Add some classes
		$dom.addClass(videoel, "video-js");
		$dom.addClass(videoel, "afterglow");

		// Set the skin
		var skin = "afterglow";
		// WILL BE ADDED LATER
		// if(videoel.getAttribute("data-skin") !== null)
		// {
		// 	skin = videoel.getAttribute("data-skin");
		// }
		videoel.skin = skin;
		$dom.addClass(videoel, "vjs-"+skin+"-skin");

		// Remove sublime stuff
		$dom.removeClass(videoel, "sublime");

		// Apply some stylings
		if(videoel.getAttribute("data-autoresize") === 'fit' || $dom.hasClass(videoel, "responsive")){
			$dom.addClass(videoel, "vjs-responsive");
			if(videoel.getAttribute("data-ratio")){
				var ratio = videoel.getAttribute("data-ratio");
			}
			else if(!videoel.getAttribute("height") || !videoel.getAttribute("width"))
			{
				console.error("Please provide witdh and height for your video element.")
			}
			else{
				var ratio = videoel.getAttribute("height") / videoel.getAttribute("width");
			}
			$dom.style(videoel, "padding-top", (ratio * 100)+"%");
			videoel.removeAttribute("width");
			videoel.removeAttribute("height");
			videoel.setAttribute("data-ratio",ratio);
		}

		// Apply youtube class
		if(videoel.getAttribute("data-youtube-id") !== null && videoel.getAttribute("data-youtube-id") !== ""){
			$dom.addClass(videoel,"vjs-youtube");
		}
		
	},

	/**
	 * Get the options for a video element in order to pass them to videojs
	 * @param  domelement  videoel  The video element which should be prepared
	 * @return {Object} The options object for videojs
	 */
	getPlayerOptions : function(videoel){
		// Prepare some options based on the elements attributes
		// Preloading
		if(videoel.getAttribute("data-preload") !== null){
			var preload = videoel.getAttribute("data-preload");
		} else if(videoel.getAttribute("preload") !== null){
			var preload = videoel.getAttribute("preload");
		} else {
			var preload = "auto";
		}

		// Autoplay
		if(videoel.getAttribute("data-autoplay") !== null){
			var autoplay = videoel.getAttribute("data-autoplay");
		} else if(videoel.getAttribute("autoplay") !== null){
			var autoplay = videoel.getAttribute("autoplay");
		} else {
			var autoplay = false;
		}

		// Posterframe
		if(videoel.getAttribute("data-poster") !== null){
			var poster = videoel.getAttribute("data-poster");
		} else if(videoel.getAttribute("poster") !== null){
			var poster = videoel.getAttribute("poster");
		} else {
			var poster = false;
		}

		// Set the options
		var options = {
			"controls" : true,
			"preload" : preload,
			"autoplay" : autoplay,
			"poster" : poster
		};

		// Get the skin buttons that are needed
		options.children = this.getSkinControls(videoel.skin);

		return options;
	},

	/**
	 * Method to get the skin controls for the given skin
	 * @param  {string} skin  For now there is just one skin, so pass 'afterglow' into the function
	 * @return {object}       The controls that are needed, usable for the vjs options
	 */
	getSkinControls : function(skin){
		// If there will be other skins to know, they will be added here. For now, we just output the 'afterglow' skin children
		var children = {
			controlBar: {
				children: [
				{
					name: "playToggle"
				},
				{
					name: "currentTimeDisplay"
				},
				{
					name: "durationDisplay"
				},
				{
					name: "progressControl"
				},
				{
					name: "volumeMenuButton",
					inline:true
				}
				]
			}
		};
		return children;
	},

	/**
	 * Applies skin styles and adds skin children to the player DOM
	 * @param  {object} player  The player object
	 * @return {void}
	 */
	applySkinStyles : function(player){
		// If there will be other skins, they will be added here. For now, we just output the 'afterglow' skin children
		player.addChild("fullscreenToggle");
	},

	/**
	 * Returns the the players object if it was initiated yet
	 * @param  string The player's id
	 * @return boolean false or object if found
	 */
	getPlayer : function (playerid){
	 	for (var i = this.players.length - 1; i >= 0; i--) {
			if(this.players[i].id() === playerid){
	 			return this.players[i];
			}
	 	};
	 	return false;
	 },

	/**
	 * Should destroy a player instance if it exists
	 * @param  {string} playerid  The player's id
	 * @return void
	 */
	destroyPlayer : function(playerid){
	 	for (var i = this.players.length - 1; i >= 0; i--) {
	 		if(this.players[i].id() === playerid){
	 			this.players[i].dispose();
	 			this.players.splice(i,1);
	 		}
	 	};
	},

	/**
	 * Check wether or not the player to load is a youtube video
	 */
	isYoutubePlayer : function(videoel){
		return videoel.hasAttribute("data-youtube-id");
	},

	/**
	 * get options to play youtube video correctly
	 */
	getYoutubeOptions : function(videoel){
		var ytoptions = {};

		// Prepare Youtube playback
		ytoptions.sources = [{
			"type": "video/youtube",
			"src": "https://www.youtube.com/watch?v="+videoel.getAttribute("data-youtube-id")
		}];
		ytoptions.techOrder = ["youtube"];

		return ytoptions;
	},

	/**
	 * Check wether or not the player to load is a vimeo video
	 */
	isVimeoPlayer : function(videoel){
		return videoel.hasAttribute("data-vimeo-id");
	},

	/**
	 * Launches a lightbox containing the player and plays it
	 * @param  {domelement} videoel  the video element to launch
	 * @return void
	 */
	launchLightbox : function(videoel){
		var playerid = videoel.getAttribute("id");

		// Prepare the lightbox element
		var wrapper = $dom.create("div.afterglow-lightbox-wrapper.hidden");
		var cover = $dom.create("div.cover");
		wrapper.appendChild(cover);
		document.body.appendChild(wrapper);

		// Prepare the player element add push it to the lightbox holder
		var lightbox = $dom.create("div.afterglow-lightbox");
		wrapper.appendChild(lightbox);
		lightbox.appendChild(videoel);

		// initiate the player and launch it
		afterglow.initPlayer(videoel);
		afterglow.getPlayer(playerid).play();

		// resize the lightbox and make it autoresize
		afterglow.resizeLightbox();
		addEventHandler(window,'resize',function(){ afterglow.resizeLightbox(); });

		// bind the closing event
		addEventHandler(cover,'click',function(){ afterglow.closeLightbox(); });

		// bind the escape key
		addEventHandler(window,'keyup',function(e){
			// Fallback for IE8
			e = e ? e : window.event;
			if(e.keyCode == 27)
			{
				afterglow.closeLightbox();
			}
		});
	},

	/**
	 * Resize the lightbox according to the media ratio
	 * @return void
	 */
	resizeLightbox : function(){
		// Get window width && height
		var width = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;
		var height = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;

		// prepare the wrapper
		var wrapper = $dom.get("div.afterglow-lightbox-wrapper")[0];

		// Do if it exists
		if(wrapper != undefined){
			var videoel = $dom.get("div.afterglow-lightbox-wrapper video")[0];
			$dom.style(wrapper,{"width":width, "height":height});
			
			var ratio = videoel.getAttribute("data-ratio");

			// Window is wide enough
			if(height/width > ratio)
			{
				var playerwidth = width * .90;
				var playerheight = playerwidth * ratio;
			}
			else{
				var playerheight = height * .92;
				var playerwidth = playerheight / ratio;
			}
			var playeroffsettop = ( height - playerheight ) / 2;
			var playeroffsetleft = ( width - playerwidth ) / 2;

			// Apply the height and width
			$dom.style(videoel.parentNode.parentNode, {
				"height": playerheight + "px",
				"width": playerwidth + "px",
				"top": playeroffsettop + "px",
				"left": playeroffsetleft + "px" 
			});
		}
	},

	/**
	 * Closes the lightbox and resets the lightbox player so that it can be reopened
	 * @return void
	 */
	closeLightbox : function(){
		// Get the needed elements
		var wrapper = $dom.get("div.afterglow-lightbox-wrapper")[0];
		
		// Do if the wrapper exists
		if(wrapper != undefined){
			var videoel = $dom.get("div.afterglow-lightbox-wrapper video")[0];
			var playerid = videoel.parentNode.getAttribute("id");

			// Stop the player
			afterglow.getPlayer(playerid).pause().exitFullscreen();

			// Create a clone which can be added to the dom after deleting the old one.
			var ratio = videoel.getAttribute("data-ratio");
			var rawvideoel = videoel.cloneNode(true);

			// destroy the player
			afterglow.destroyPlayer(playerid);

			// remove the lightbox
			wrapper.parentNode.removeChild(wrapper);

			// add the raw one
			document.body.appendChild(rawvideoel);
			rawvideoel.setAttribute("class","afterglow-lightboxplayer");
			rawvideoel.setAttribute("id",playerid);

			// Reinitiate the player, else it won't work the next time
			afterglow.reInitLightboxPlayer(playerid);
		}
	},

	/**
	 * Run some configurations on video.js to make it work for us
	 * @return void
	 */
	configureVideoJS: function(){
		// Disable tracking
		window.HELP_IMPROVE_VIDEOJS = false;	
	}
}

// Initiate all players
$dom.onready(function(){
	afterglow.init();
});