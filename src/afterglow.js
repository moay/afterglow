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
		// Make sure to not double-initiate a player - means, we'll destroy if for sure.
		this.destroyPlayer(videoel.getAttribute('id'));

		// Prepare the player element for videojs
		this.preparePlayer(videoel);

		// Get the options object for videojs
		var options = this.getPlayerOptions(videoel)

		// initiate videojs and do some post initiation stuff
		var player = videojs(videoel, options, function(){

		}).ready(function(){
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
	 * Method to prepare the lightbox players and make them initiate when their time has come
	 * @param  {domelement} linkel  The DOM element which initiates the lightbox
	 * @return {void}
	 */
	initLightboxPlayer : function(linkel){
		// Get the playerid
		var playerid = linkel.getAttribute("href");

		// Hide the video element
		var playerel = $dom.get(playerid)[0];
		$dom.addClass(playerel, "afterglow-lightboxplayer");

		linkel.onclick = function(e){
			// Prevent the click event, IE8 compatible
			e = e ? e : window.event;
			e.preventDefault();

			// Launch the lightbox
			afterglow.launchLightbox(playerel);
		};
	},

	launchLightbox : function(playerel){
		var playerid = playerel.getAttribute('id');

		// Destroy the player, just in case...
		afterglow.destroyPlayer(playerid);

		// Prepare the lightbox element
		var wrapper = $dom.create("div.afterglow-lightbox-wrapper");
		wrapper.appendChild($dom.create("div.cover"));

		// Prepare the player element add push it to the lightbox holder
		var lightbox = $dom.create("div.afterglow-lightbox");
		lightbox.appendChild(playerel);
		wrapper.appendChild(lightbox);

		// Set some defaults
		playerel.setAttribute("autoplay", "false");
		playerel.setAttribute("data-autoplay","false");

		// append the lightbox to the DOM
		document.body.appendChild(wrapper);

		// initiate the player and launch it
		afterglow.initPlayer(playerel);

		// resize the lightbox and make it autoresize
		afterglow.resizeLightbox();
		window.onresize = function(){
			afterglow.resizeLightbox();
		}
	},

	resizeLightbox : function(){
		// Get window width && height
		var width = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;
		var height = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;

		// prepare the elements
		var wrapper = $dom.get("div.afterglow-lightbox-wrapper")[0];
		var playerel = $dom.get("div.afterglow-lightbox-wrapper video")[0];
		$dom.style(wrapper,{"width":width, "height":height});
		
// NOT WORKING YET

		// Get the player proportion
		// var proportion = playerel.getAttribute('height') / playerel.getAttribute('width');

		// console.log(proportion);
		// // Window is wide enough
		// if(height/width > proportion)
		// {
		// 	console.log('true');
		// }
		// else{
		// 	console.log('false');
		// }

	},

	/**
	 * Should destroy a player instance if it exists
	 * @param  {string} playerid  The player's id
	 * @return void
	 */
	destroyPlayer : function(playerid){
	 	for (var i = this.players.length - 1; i >= 0; i--) {
	 		if(this.players[i].id === playerid){
	 			this.players[i].destroy();
	 			this.players.splice(i,1);
	 		}
	 	};
	 },

	/**
	 * Prepare a video element for further use with videojs
	 * @param  domelement  videoel  The video element which should be prepared
	 * @return void
	 */
	preparePlayer : function(videoel){
		// Add some classes
		$dom.addClass(videoel, 'video-js');
		$dom.addClass(videoel, 'afterglow');

		// Set the skin
		var skin = 'afterglow';
		// WILL BE ADDED LATER
		// if(videoel.getAttribute('data-skin') !== null)
		// {
		// 	skin = videoel.getAttribute('data-skin');
		// }
		videoel.skin = skin;
		$dom.addClass(videoel, 'vjs-'+skin+'-skin');

		// Remove sublime stuff
		$dom.removeClass(videoel, 'sublime');

		// Apply some stylings
		if(videoel.getAttribute('data-autoresize') === 'fit' || $dom.hasClass(videoel, 'responsive')){
			$dom.addClass(videoel, 'vjs-responsive');
			var proportion = videoel.getAttribute('height') / videoel.getAttribute('width');
			$dom.style(videoel, 'padding-top', (proportion * 100)+'%');
			videoel.removeAttribute('width');
			videoel.removeAttribute('height');
		}

		// Apply youtube class
		if(videoel.getAttribute('data-youtube-id') !== null && videoel.getAttribute('data-youtube-id') !== ''){
			$dom.addClass(videoel,'vjs-youtube');
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
		if(videoel.getAttribute('data-preload') !== null){
			var preload = videoel.getAttribute('data-preload');
		} else if(videoel.getAttribute('preload') !== null){
			var preload = videoel.getAttribute('preload');
		} else {
			var preload = "auto";
		}

		// Autoplay
		if(videoel.getAttribute('data-autoplay') !== null){
			var autoplay = videoel.getAttribute('data-autoplay');
		} else if(videoel.getAttribute('autoplay') !== null){
			var autoplay = videoel.getAttribute('autoplay');
		} else {
			var autoplay = false;
		}

		// Posterframe
		if(videoel.getAttribute('data-poster') !== null){
			var poster = videoel.getAttribute('data-poster');
		} else if(videoel.getAttribute('poster') !== null){
			var poster = videoel.getAttribute('poster');
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

		// Prepare Youtube and Vimeo playback
		if(videoel.getAttribute('data-youtube-id') !== null && videoel.getAttribute('data-youtube-id') !== '')
		{
			options.sources = [{
				"type": "video/youtube",
				"src": 'https://www.youtube.com/watch?v='+videoel.getAttribute('data-youtube-id')
			}];
			options.youtube = {
				showinfo : 0
			};
			options.techOrder = ['youtube'];
		}
		if(videoel.getAttribute('data-vimeo-id') !== null && videoel.getAttribute('data-vimeo-id') !== '')
		{
			options.src= 'https://vimeo.com/'+videoel.getAttribute('data-vimeo-id');
			options.techOrder = ['vimeo', 'html5', 'flash'];
		}

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
					name: 'playToggle'
				},
				{
					name: 'currentTimeDisplay'
				},
				{
					name: 'durationDisplay'
				},
				{
					name: 'progressControl'
				},
				{
					name: 'volumeMenuButton',
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
		player.addChild('fullscreenToggle');
	},

	/**
	 * Returns the the players object if it was initiated yet
	 * @param  string The player's id
	 * @return boolean false or object if found
	 */
	getPlayer : function (playerid){
	 	for (var i = this.players.length - 1; i >= 0; i--) {
	 		if(this.players[i].id === playerid)
	 			return this.players[i];
	 	};
	 	return false;
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