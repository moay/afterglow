(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _componentsPlayer = require('./components/Player');

var _componentsPlayer2 = _interopRequireDefault(_componentsPlayer);

var _componentsLightbox = require('./components/Lightbox');

var _componentsLightbox2 = _interopRequireDefault(_componentsLightbox);

var _componentsLightboxTrigger = require('./components/LightboxTrigger');

var _componentsLightboxTrigger2 = _interopRequireDefault(_componentsLightboxTrigger);

var Afterglow = (function () {
	function Afterglow() {
		_classCallCheck(this, Afterglow);

		/**
   * Will hold the players in order to make them accessible
   */
		this.players = [];
		/**
   * Will hold the trigger elements which will launch lightbox players
   */
		this.lightboxtriggers = [];
	}

	/**
  * Initiate all players that were found and need to be initiated
  * @return void
  */

	_createClass(Afterglow, [{
		key: 'init',
		value: function init() {
			// Run some preparations
			this.configureVideoJS();

			// initialize regular players
			this.initVideoElements();

			// prepare Lightboxes
			this.prepareLightboxVideos();
		}

		/**
   * Looks for players to initiate and creates AfterglowPlayer objects based on those elements
   * @return void
   */
	}, {
		key: 'initVideoElements',
		value: function initVideoElements() {
			// Get players including sublime fallback
			var players = document.querySelectorAll("video.afterglow,video.sublime");

			// Initialize players
			for (var i = 0; i < players.length; i++) {
				var player = new _componentsPlayer2['default'](players[i]);
				player.init();
				this.players.push(player);
			}
		}

		/**
   * Prepares all found trigger elements and makes them open their corresponding players when needed
   * @return void
   */
	}, {
		key: 'prepareLightboxVideos',
		value: function prepareLightboxVideos() {
			// Get lightboxplayers including sublime fallback
			var lightboxtriggers = document.querySelectorAll("a.afterglow,a.sublime");

			// Initialize players launching in a lightbox
			for (var i = 0; i < lightboxtriggers.length; i++) {
				var trigger = new _componentsLightboxTrigger2['default'](lightboxtriggers[i]);

				this.bindLightboxTriggerEvents(trigger);

				this.lightboxtriggers.push(trigger);
			}
		}

		/**
   * Binds some elements for lightbox triggers.
   * @param  {object} the trigger object
   * @return void
   */
	}, {
		key: 'bindLightboxTriggerEvents',
		value: function bindLightboxTriggerEvents(trigger) {
			var _this = this;

			trigger.on('trigger', function () {
				_this.players.push(trigger.getPlayer());
				_this.consolidatePlayers;
			});
			trigger.on('close', function () {
				_this.consolidatePlayers();
			});
		}

		/**
   * Returns the the players object if it was initiated yet
   * @param  string The player's id
   * @return boolean false or object if found
   */
	}, {
		key: 'getPlayer',
		value: function getPlayer(playerid) {
			// Try to get regular player
			for (var i = this.players.length - 1; i >= 0; i--) {
				if (this.players[i].id === playerid) {
					return this.players[i];
				}
			};
			// Else try to find lightbox player
			for (var i = this.lightboxtriggers.length - 1; i >= 0; i--) {
				if (this.lightboxtriggers[i].playerid === playerid) {
					return this.lightboxtriggers[i].getPlayer();
				}
			};
			return false;
		}

		/**
   * Should destroy a player instance if it exists. Lightbox players should be just closed.
   * @param  {string} playerid  The player's id
   * @return void
   */
	}, {
		key: 'destroyPlayer',
		value: function destroyPlayer(playerid) {
			// Look for regular players
			for (var i = this.players.length - 1; i >= 0; i--) {
				if (this.players[i].id === playerid) {
					this.players[i].destroy();
					this.players.splice(i, 1);
					return true;
				}
			};
			// Else look for an active lightbox
			for (var i = this.lightboxtriggers.length - 1; i >= 0; i--) {
				if (this.lightboxtriggers[i].playerid === playerid) {
					this.closeLightbox();
					return true;
				}
			};
			return false;
		}

		/**
   * Closes the lightbox and resets the lightbox player so that it can be reopened
   * @return void
   */
	}, {
		key: 'closeLightbox',
		value: function closeLightbox() {
			for (var i = this.lightboxtriggers.length - 1; i >= 0; i--) {
				this.lightboxtriggers[i].closeLightbox();
			};
			this.consolidatePlayers();
		}

		/**
   * Consolidates the players container and removes players that are not alive any more.
   * @return {[type]} [description]
   */
	}, {
		key: 'consolidatePlayers',
		value: function consolidatePlayers() {
			for (var i = this.players.length - 1; i >= 0; i--) {
				if (this.players[i] !== undefined && !this.players[i].alive) {
					delete this.players[i];

					// Reset indexes
					this.players = this.players.filter(function () {
						return true;
					});
				}
			};
		}

		/**
   * Run some configurations on video.js to make it work for us
   * @return void
   */
	}, {
		key: 'configureVideoJS',
		value: function configureVideoJS() {
			// Disable tracking
			window.HELP_IMPROVE_VIDEOJS = false;
		}
	}]);

	return Afterglow;
})();

exports['default'] = Afterglow;
module.exports = exports['default'];

},{"./components/Lightbox":3,"./components/LightboxTrigger":4,"./components/Player":5}],2:[function(require,module,exports){
/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _libUtil = require('../lib/Util');

var _libUtil2 = _interopRequireDefault(_libUtil);

var Config = (function () {
	function Config(videoelement) {
		var skin = arguments.length <= 1 || arguments[1] === undefined ? 'afterglow' : arguments[1];

		_classCallCheck(this, Config);

		// Check for the video element
		if (videoelement == undefined) {
			console.error('Please provide a proper video element to afterglow');
		} else {
			// Set videoelement
			this.videoelement = videoelement;

			// Prepare the options container
			this.options = {};

			// Prepare option variables
			this.setDefaultOptions();
			this.setSkinControls();

			var util = new _libUtil2['default']();
			// Initialize youtube if the current player is a youtube player
			if (util.isYoutubePlayer(this.videoelement)) {
				this.setYoutubeOptions();
			}

			// Set the skin
			this.skin = skin;
		}
	}

	/**
  * Sets some basic options based on the videoelement's attributes
  * @return {void}
  */

	_createClass(Config, [{
		key: 'setDefaultOptions',
		value: function setDefaultOptions() {
			// Controls needed for the player
			this.options.controls = true;

			// Default tech order
			this.options.techOrder = ["html5", "flash"];

			// Some default player parameters
			this.options.preload = this.getPlayerAttributeFromVideoElement('preload', 'auto');
			this.options.autoplay = this.getPlayerAttributeFromVideoElement('autoplay');
			this.options.poster = this.getPlayerAttributeFromVideoElement('poster');
		}

		/**
   * Gets a configuration value that has been passed to the videoelement as HTML tag attribute
   * @param  {string}  attributename  The name of the attribute to get
   * @param  {mixed} fallback      	The expected fallback if the attribute was not set - false by default
   * @return {mixed}					The attribute (with data-attributename being preferred) or the fallback if none.
   */
	}, {
		key: 'getPlayerAttributeFromVideoElement',
		value: function getPlayerAttributeFromVideoElement(attributename) {
			var fallback = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

			if (this.videoelement.getAttribute("data-" + attributename) !== null) {
				return this.videoelement.getAttribute("data-" + attributename);
			} else if (this.videoelement.getAttribute(attributename) !== null) {
				return this.videoelement.getAttribute(attributename);
			} else {
				return fallback;
			}
		}

		/**
   * Sets the controls which are needed for the player to work properly.
   */
	}, {
		key: 'setSkinControls',
		value: function setSkinControls() {
			// For now, we just output the default 'afterglow' skin children, as there isn't any other skin defined yet
			var children = {
				TopControlBar: {
					children: [{
						name: "fullscreenToggle"
					}]
				},
				controlBar: {
					children: [{
						name: "currentTimeDisplay"
					}, {
						name: "playToggle"
					}, {
						name: "durationDisplay"
					}, {
						name: "progressControl"
					}, {
						name: "ResolutionSwitchingButton"
					}, {
						name: "volumeMenuButton",
						inline: true
					}, {
						name: "subtitlesButton"
					}, {
						name: "captionsButton"
					}]
				}
			};
			this.options.children = children;
		}

		/**
   * Sets options needed for youtube to work and replaces the sources with the correct youtube source
   */
	}, {
		key: 'setYoutubeOptions',
		value: function setYoutubeOptions() {
			this.options.showinfo = 0;
			this.options.techOrder = ["youtube"];
			this.options.sources = [{
				"type": "video/youtube",
				"src": "https://www.youtube.com/watch?v=" + this.getPlayerAttributeFromVideoElement('youtube-id')
			}];

			var util = new _libUtil2['default']();
			if (util.ie().actualVersion >= 8 && util.ie().actualVersion <= 11) {
				this.options.youtube = {
					ytControls: 2,
					color: "white"
				};
			}
		}
	}, {
		key: 'getSkinClass',
		value: function getSkinClass() {
			var cssclass = "vjs-afterglow-skin";
			if (this.skin !== 'afterglow') {
				cssclass = cssclass + " afterglow-skin-" + this.skin;
			}
			return cssclass;
		}
	}]);

	return Config;
})();

exports['default'] = Config;
module.exports = exports['default'];

},{"../lib/Util":7}],3:[function(require,module,exports){
/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Player = require('./Player');

var _Player2 = _interopRequireDefault(_Player);

var _libUtil = require('../lib/Util');

var _libUtil2 = _interopRequireDefault(_libUtil);

// For emitting and receiving events

var _vendorEmitterEmitter = require('../../../../vendor/Emitter/Emitter');

var _vendorEmitterEmitter2 = _interopRequireDefault(_vendorEmitterEmitter);

var Lightbox = (function () {
	function Lightbox() {
		_classCallCheck(this, Lightbox);

		this.build();
		(0, _vendorEmitterEmitter2['default'])(this);
	}

	_createClass(Lightbox, [{
		key: 'build',
		value: function build() {
			// Prepare the lightbox element
			var wrapper = document.createElement('div').addClass("afterglow-lightbox-wrapper");
			var cover = document.createElement('div').addClass("cover");
			wrapper.appendChild(cover);

			// Prepare the player element add push it to the lightbox holder
			var lightbox = document.createElement('div').addClass("afterglow-lightbox");
			wrapper.appendChild(lightbox);

			this.wrapper = wrapper;
			this.cover = cover;
			this.lightbox = lightbox;
		}
	}, {
		key: 'passVideoElement',
		value: function passVideoElement(videoelement) {
			this.playerid = videoelement.getAttribute("id");
			this.lightbox.appendChild(videoelement);
			this.videoelement = videoelement;
			this.videoelement.setAttribute("autoplay", "autoplay");

			this.player = new _Player2['default'](this.videoelement);
		}
	}, {
		key: 'launch',
		value: function launch(_callback) {
			var _this = this;

			document.body.appendChild(this.wrapper);

			this.player.init(function (fn) {

				var videojs = _this.player.videojs;

				// Prevent autoplay for mobile devices, won't work anyways...
				if (!isMobile) {
					// If autoplay didn't work
					if (videojs.paused()) {
						videojs.posterImage.show();
						videojs.bigPlayButton.show();
					}
				}

				// Adding autoclose functionality
				if (_this.videoelement.getAttribute("data-autoclose") == "true") {
					videojs.on('ended', function () {
						_this.close();
					});
				}
				// Else show the poster frame on ended.
				else {
						videojs.on('ended', function () {
							videojs.posterImage.show();
						});
					}

				videojs.TopControlBar.addChild("LightboxCloseButton");
			});

			// resize the lightbox and make it autoresize
			this.resize();
			addEventHandler(window, 'resize', function () {
				_this.resize();
			});

			// bind the closing event
			addEventHandler(this.cover, 'click', function () {
				_this.close();
			});

			// bind the escape key
			addEventHandler(window, 'keyup', function (e) {
				// Fallback for IE8
				e = e ? e : window.event;
				if (e.keyCode == 27) {
					_this.close();
				}
			});

			// Launch the callback if there is one
			if (typeof _callback == "function") {
				_callback(this);
			}
		}

		/**
   * Resize the lightbox according to the media ratio
   * @return void
   */
	}, {
		key: 'resize',
		value: function resize() {
			// Do if it exists
			if (this.wrapper != undefined) {
				// Standard HTML5 player
				if (this.videoelement !== undefined) {
					var ratio = this.videoelement.getAttribute("data-ratio");
					if (this.videoelement.getAttribute("data-overscale") == "false") {
						// Calculate the new size of the player with maxwidth
						var sizes = this.calculateLightboxSizes(ratio, parseInt(this.videoelement.getAttribute("data-maxwidth")));
					} else {
						// Calculate the new size of the player without maxwidth
						var sizes = this.calculateLightboxSizes(ratio);
					}
				} else {
					// Youtube
					if (document.querySelectorAll("div.afterglow-lightbox-wrapper .vjs-youtube").length == 1) {
						playerelement = document.querySelector("div.afterglow-lightbox-wrapper .vjs-youtube");
						var ratio = playerelement.getAttribute("data-ratio");
						var sizes = this.calculateLightboxSizes(ratio);
					}
				}

				// Apply the height and width
				this.wrapper.style.width = sizes.width;
				this.wrapper.style.height = sizes.height;

				this.lightbox.style.height = sizes.playerheight + "px";
				this.lightbox.style.width = sizes.playerwidth + "px";
				this.lightbox.style.top = sizes.playeroffsettop + "px";
				this.lightbox.style.left = sizes.playeroffsetleft + "px";
			}
		}

		/**
   * calculates the current lightbox size based on window width and height and on the players ratio
   * @param  {float} ratio   The players ratio
   * @return {object}        Some sizes which can be used
   */
	}, {
		key: 'calculateLightboxSizes',
		value: function calculateLightboxSizes(ratio, maxwidth) {
			var sizes = {};

			// Get window width && height
			sizes.width = window.clientWidth || document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
			sizes.height = window.clientHeight || document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;

			// Window is wide enough
			if (sizes.height / sizes.width > ratio) {
				// Check if the lightbox should overscale, even if video is smaller
				if (typeof maxwidth !== 'undefined' && maxwidth < sizes.width * .90) {
					sizes.playerwidth = maxwidth;
				}
				// Else scale up as much as possible
				else {
						sizes.playerwidth = sizes.width * .90;
					}
				sizes.playerheight = sizes.playerwidth * ratio;
			} else {
				// Check if the lightbox should overscale, even if video is smaller
				if (typeof maxwidth !== 'undefined' && maxwidth < sizes.height * .92 / ratio) {
					sizes.playerheight = maxwidth * ratio;
				}
				// Else scale up as much as possible
				else {
						sizes.playerheight = sizes.height * .92;
					}
				sizes.playerwidth = sizes.playerheight / ratio;
			}
			sizes.playeroffsettop = (sizes.height - sizes.playerheight) / 2;
			sizes.playeroffsetleft = (sizes.width - sizes.playerwidth) / 2;

			return sizes;
		}
	}, {
		key: 'close',
		value: function close() {
			this.player.destroy(true);
			this.wrapper.parentNode.removeChild(this.wrapper);
			this.emit('close');
		}
	}]);

	return Lightbox;
})();

exports['default'] = Lightbox;
module.exports = exports['default'];

},{"../../../../vendor/Emitter/Emitter":9,"../lib/Util":7,"./Player":5}],4:[function(require,module,exports){
/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Lightbox = require('./Lightbox');

var _Lightbox2 = _interopRequireDefault(_Lightbox);

// For emitting and receiving events

var _vendorEmitterEmitter = require('../../../../vendor/Emitter/Emitter');

var _vendorEmitterEmitter2 = _interopRequireDefault(_vendorEmitterEmitter);

var _libDOMElement = require('../lib/DOMElement');

var _libDOMElement2 = _interopRequireDefault(_libDOMElement);

var LightboxTrigger = (function (_DOMElement) {
	_inherits(LightboxTrigger, _DOMElement);

	function LightboxTrigger(node) {
		_classCallCheck(this, LightboxTrigger);

		_get(Object.getPrototypeOf(LightboxTrigger.prototype), 'constructor', this).call(this, node);
		this.init();
	}

	_createClass(LightboxTrigger, [{
		key: 'init',
		value: function init() {
			// Get the playerid
			this.playerid = this.node.getAttribute("href");
			// Hide the video element
			this.videoelement = document.querySelector(this.playerid);

			this.prepare();

			(0, _vendorEmitterEmitter2['default'])(this);
		}
	}, {
		key: 'prepare',
		value: function prepare() {
			var _this = this;

			// Add major class
			this.videoelement.addClass("afterglow-lightboxplayer");
			// Prepare the element
			this.videoelement.setAttribute("data-autoresize", "fit");

			this.bind('click', function (e) {
				// Prevent the click event, IE8 compatible
				e = e ? e : window.event;
				e.preventDefault();

				// Launch the lightbox
				_this.trigger();
			});
		}
	}, {
		key: 'trigger',
		value: function trigger() {
			var _this2 = this;

			this.lightbox = new _Lightbox2['default']();

			var videoelement = this.videoelement.cloneNode(true);

			this.lightbox.passVideoElement(videoelement);

			this.emit('trigger');

			this.lightbox.launch();

			// Pass event to afterglow core
			this.lightbox.on('close', function (fn) {
				_this2.emit('close');
			});
		}
	}, {
		key: 'closeLightbox',
		value: function closeLightbox() {
			if (this.lightbox != undefined) {
				this.lightbox.close();
				delete this.lightbox;
			}
		}
	}, {
		key: 'getPlayer',
		value: function getPlayer() {
			return this.lightbox.player;
		}
	}]);

	return LightboxTrigger;
})(_libDOMElement2['default']);

exports['default'] = LightboxTrigger;
module.exports = exports['default'];

},{"../../../../vendor/Emitter/Emitter":9,"../lib/DOMElement":6,"./Lightbox":3}],5:[function(require,module,exports){
/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Config = require('./Config');

var _Config2 = _interopRequireDefault(_Config);

var _libUtil = require('../lib/Util');

var _libUtil2 = _interopRequireDefault(_libUtil);

var Player = (function () {
	function Player(videoelement) {
		_classCallCheck(this, Player);

		// Passing to setup for testability
		this.setup(videoelement);
	}

	_createClass(Player, [{
		key: 'setup',
		value: function setup(videoelement) {
			this.videoelement = videoelement;
			this.id = videoelement.getAttribute('id');
			this.config = new _Config2['default'](videoelement);
			this.prepareVideoElement();
			// Set an activity variable to be able to detect if the player can be deleted
			this.alive = true;
		}
	}, {
		key: 'init',
		value: function init(_callback) {
			var videoelement = this.videoelement;
			var options = this.config.options;

			// initiate videojs and do some post initiation stuff
			var player = videojs(videoelement, options).ready(function () {

				// Enable hotkeys
				this.hotkeys({
					enableFullscreen: false,
					enableNumbers: false
				});

				// Set initial volume if needed
				if (videoelement.getAttribute('data-volume') !== null) {
					var volume = parseFloat(videoelement.getAttribute('data-volume'));
					this.volume(volume);
				}

				// Fix youtube poster
				var util = new _libUtil2['default']();
				if (util.isYoutubePlayer(videoelement) && !options.poster && this.tech_.poster != "") {
					this.addClass('vjs-youtube-ready');
					this.poster(this.tech_.poster);
				}

				// Add resolution switching
				// this.controlBar.addChild("ResolutionSwitchingButton");

				// Launch the callback if there is one
				if (typeof _callback == "function") {
					_callback(this);
				}
			});
			this.videojs = player;
		}
	}, {
		key: 'prepareVideoElement',
		value: function prepareVideoElement() {
			// Add some classes
			this.videoelement.addClass("video-js");
			this.videoelement.addClass("afterglow");

			this.videoelement.addClass(this.config.getSkinClass());

			// Remove sublime stuff
			this.videoelement.removeClass("sublime");

			// Make lightboxplayer not overscale
			if (this.videoelement.getAttribute("data-overscale") == "false") {
				this.videoelement.setAttribute("data-maxwidth", this.videoelement.getAttribute("width"));
			}

			// Apply some stylings
			if (this.videoelement.getAttribute("data-autoresize") === 'fit' || this.videoelement.hasClass("responsive")) {
				this.videoelement.addClass("vjs-responsive");
				if (this.videoelement.getAttribute("data-ratio")) {
					var ratio = this.videoelement.getAttribute("data-ratio");
				} else if (!this.videoelement.getAttribute("height") || !this.videoelement.getAttribute("width")) {
					console.error("Please provide witdh and height for your video element.");
				} else {
					var ratio = this.videoelement.getAttribute("height") / this.videoelement.getAttribute("width");
				}
				this.videoelement.style.paddingTop = ratio * 100 + "%";
				this.videoelement.removeAttribute("height");
				this.videoelement.removeAttribute("width");
				this.videoelement.setAttribute("data-ratio", ratio);
			}

			// Apply youtube class
			var util = new _libUtil2['default']();
			if (util.isYoutubePlayer(this.videoelement)) {
				this.videoelement.addClass("vjs-youtube");

				// Check for native playback
				if (document.querySelector('video').controls) {
					this.videoelement.addClass("vjs-using-native-controls");
				}
				// Add iOS class, just if is iPad
				if (/iPad|iPhone|iPod/.test(navigator.platform)) {
					this.videoelement.addClass("vjs-iOS");
				}

				// Check for IE9 - IE11
				if (ie >= 8 && ie <= 11) {
					// @see afterglow-lib.js
					this.videoelement.addClass("vjs-using-native-controls");
				}
			}

			// Check for IE9 - IE11
			if (ie >= 8 && ie <= 11) {
				// @see afterglow-lib.js
				this.videoelement.addClass('vjs-IE');
			}
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			if (!this.videojs.paused()) {
				this.videojs.pause();
			}
			if (this.videojs.isFullscreen()) {
				this.videojs.exitFullscreen();
			}
			this.videojs.dispose();
			this.alive = false;
		}
	}]);

	return Player;
})();

exports['default'] = Player;
module.exports = exports['default'];

},{"../lib/Util":7,"./Config":2}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DOMElement = (function () {
	function DOMElement(node) {
		_classCallCheck(this, DOMElement);

		this.node = node;
	}

	/**
  * Adds a given class to the DOM node if the node doesn't have it.
  * @param {string} className
  * @return {object} this - for method chaining
  */

	_createClass(DOMElement, [{
		key: "addClass",
		value: function addClass(className) {
			if (this.node.classList) {
				this.node.classList.add(className);
			} else if (!this.node.hasClass(className)) {
				var classes = this.node.className.split(" ");
				classes.push(className);
				this.node.className = classes.join(" ");
			}
			return this;
		}

		/**
   * Removes a given class from the DOM node if the node doesn't have it.
   * @param {string} className
   * @return {object} this - for method chaining
   */
	}, {
		key: "removeClass",
		value: function removeClass(className) {
			if (this.node.classList) {
				this.node.classList.remove(className);
			} else {
				var classes = this.node.className.split(" ");
				classes.splice(classes.indexOf(className), 1);
				this.node.className = classes.join(" ");
			}
			return this;
		}

		/**
   * Will detect if the node does have the given className
   * @param  {string}  className
   * @return {Boolean}  
   */
	}, {
		key: "hasClass",
		value: function hasClass(className) {
			if (this.node.classList) {
				return this.node.classList.contains(className);
			} else {
				return -1 < this.node.className.indexOf(className);
			}
		}

		/**
   * IE8 compliant way of handling event bindings with the possibility to remove them lateron, with support for multiple events at once
   * @param {string} eventType The events to react to
   * @param {function} handler The function to execute
   * @return {object} this - for method chaining
   */
	}, {
		key: "bind",
		value: function bind(eventType, handler) {
			var evts = eventType.split(' ');
			for (var i = 0, iLen = evts.length; i < iLen; i++) {
				if (this.node.addEventListener) this.node.addEventListener(evts[i], handler, false);else if (this.node.attachEvent) this.node.attachEvent('on' + evts[i], handler);
			}
			return this;
		}

		/**
   * IE8 compliant way of handling removing event bindings which were added before
   * @param {string} eventType The events to react to
   * @param {function} handler The function to detach
   * @return {object} this - for method chaining
   */
	}, {
		key: "unbind",
		value: function unbind(eventType, handler) {
			var evts = eventType.split(' ');
			for (var i = 0, iLen = evts.length; i < iLen; i++) {
				if (this.node.removeEventListener) this.node.removeEventListener(evts[i], handler, false);
				if (this.node.detachEvent) this.node.detachEvent('on' + evts[i], handler);
			}
			return this;
		}

		/** PROXY METHODS */

	}, {
		key: "getAttribute",
		value: function getAttribute(input) {
			return this.node.getAttribute(input);
		}
	}, {
		key: "setAttribute",
		value: function setAttribute(key, value) {
			return this.node.setAttribute(key, value);
		}
	}]);

	return DOMElement;
})();

exports["default"] = DOMElement;
module.exports = exports["default"];

},{}],7:[function(require,module,exports){
/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Util = (function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, [{
    key: 'isYoutubePlayer',

    /**
     * Checks wether or not the given video element should be converted into a video element
     * @param  {node}  videoelement
     * @return {Boolean}
     */
    value: function isYoutubePlayer(videoelement) {
      return videoelement.hasAttribute("data-youtube-id");
    }

    /**
     * Gets a youtube video thumbnail
     * @param  {string} id  The videos youtube id
     * @return {string} the url to the thumbnail
     */
  }, {
    key: 'loadYoutubeThumbnailUrl',
    value: function loadYoutubeThumbnailUrl(id) {
      var uri = 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg';
      return uri;
    }
  }, {
    key: 'ie',

    /**
     * Returns some information about the currently used IE
     * @return {object}
     */
    value: function ie() {
      var ret, isTheBrowser, actualVersion, jscriptMap, jscriptVersion;

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

      if (!isTheBrowser) {
        if (window.navigator.userAgent.indexOf("Trident/7.0") > 0 && !/x64|x32/ig.test(window.navigator.userAgent)) {
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
     */
  }, {
    key: 'isMobile',
    value: function isMobile() {
      var Android = function Android() {
        return navigator.userAgent.match(/Android/i);
      };
      var BlackBerry = function BlackBerry() {
        return navigator.userAgent.match(/BlackBerry/i);
      };
      var iOS = function iOS() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      };
      var Opera = function Opera() {
        return navigator.userAgent.match(/Opera Mini/i);
      };
      var Windows = function Windows() {
        return navigator.userAgent.match(/IEMobile/i);
      };

      return Android() || BlackBerry() || iOS() || Opera() || Windows();
    }

    /**
     * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
     * @param obj1
     * @param obj2
     * @returns obj3 a new object based on obj1 and obj2
     */
  }, {
    key: 'merge_objects',
    value: function merge_objects(obj1, obj2) {
      var obj3 = {};
      for (var attrname in obj1) {
        obj3[attrname] = obj1[attrname];
      }
      for (var attrname in obj2) {
        obj3[attrname] = obj2[attrname];
      }
      return obj3;
    }
  }]);

  return Util;
})();

exports['default'] = Util;
module.exports = exports['default'];

},{}],8:[function(require,module,exports){
/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _afterglowAfterglow = require('./afterglow/Afterglow');

var _afterglowAfterglow2 = _interopRequireDefault(_afterglowAfterglow);

// Initiate afterglow when the DOM is ready. This is not IE8 compatible!
document.addEventListener("DOMContentLoaded", function () {
  window.afterglow = new _afterglowAfterglow2["default"]();
  afterglow.init();
});

},{"./afterglow/Afterglow":1}],9:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

'use strict';

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function (event, fn) {
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function (event) {
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1),
      callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function (event) {
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function (event) {
  return !!this.listeners(event).length;
};

},{}]},{},[8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVm9sdW1lcy9NYWMgRGF0ZW4vVXNlciBEYXRhL21hbnVlbHZvc3MvRG9jdW1lbnRzL2FmdGVyZ2xvdy1wbGF5ZXIvc3JjL2pzL2FmdGVyZ2xvdy9BZnRlcmdsb3cuanMiLCIvVm9sdW1lcy9NYWMgRGF0ZW4vVXNlciBEYXRhL21hbnVlbHZvc3MvRG9jdW1lbnRzL2FmdGVyZ2xvdy1wbGF5ZXIvc3JjL2pzL2FmdGVyZ2xvdy9jb21wb25lbnRzL0NvbmZpZy5qcyIsIi9Wb2x1bWVzL01hYyBEYXRlbi9Vc2VyIERhdGEvbWFudWVsdm9zcy9Eb2N1bWVudHMvYWZ0ZXJnbG93LXBsYXllci9zcmMvanMvYWZ0ZXJnbG93L2NvbXBvbmVudHMvTGlnaHRib3guanMiLCIvVm9sdW1lcy9NYWMgRGF0ZW4vVXNlciBEYXRhL21hbnVlbHZvc3MvRG9jdW1lbnRzL2FmdGVyZ2xvdy1wbGF5ZXIvc3JjL2pzL2FmdGVyZ2xvdy9jb21wb25lbnRzL0xpZ2h0Ym94VHJpZ2dlci5qcyIsIi9Wb2x1bWVzL01hYyBEYXRlbi9Vc2VyIERhdGEvbWFudWVsdm9zcy9Eb2N1bWVudHMvYWZ0ZXJnbG93LXBsYXllci9zcmMvanMvYWZ0ZXJnbG93L2NvbXBvbmVudHMvUGxheWVyLmpzIiwiL1ZvbHVtZXMvTWFjIERhdGVuL1VzZXIgRGF0YS9tYW51ZWx2b3NzL0RvY3VtZW50cy9hZnRlcmdsb3ctcGxheWVyL3NyYy9qcy9hZnRlcmdsb3cvbGliL0RPTUVsZW1lbnQuanMiLCIvVm9sdW1lcy9NYWMgRGF0ZW4vVXNlciBEYXRhL21hbnVlbHZvc3MvRG9jdW1lbnRzL2FmdGVyZ2xvdy1wbGF5ZXIvc3JjL2pzL2FmdGVyZ2xvdy9saWIvVXRpbC5qcyIsIi9Wb2x1bWVzL01hYyBEYXRlbi9Vc2VyIERhdGEvbWFudWVsdm9zcy9Eb2N1bWVudHMvYWZ0ZXJnbG93LXBsYXllci9zcmMvanMvaW5pdC5qcyIsIi9Wb2x1bWVzL01hYyBEYXRlbi9Vc2VyIERhdGEvbWFudWVsdm9zcy9Eb2N1bWVudHMvYWZ0ZXJnbG93LXBsYXllci92ZW5kb3IvRW1pdHRlci9FbWl0dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDTUEsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Z0NBRU0scUJBQXFCOzs7O2tDQUNuQix1QkFBdUI7Ozs7eUNBQ2hCLDhCQUE4Qjs7OztJQUVwRCxTQUFTO0FBRUgsVUFGTixTQUFTLEdBRUQ7d0JBRlIsU0FBUzs7Ozs7QUFNYixNQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7OztBQUlsQixNQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0VBQzNCOzs7Ozs7O2NBWEksU0FBUzs7U0FpQlYsZ0JBQUU7O0FBRUwsT0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7OztBQUd4QixPQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7O0FBR3pCLE9BQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0dBQzdCOzs7Ozs7OztTQU1nQiw2QkFBRTs7QUFFbEIsT0FBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLCtCQUErQixDQUFDLENBQUM7OztBQUd6RSxRQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztBQUN2QyxRQUFJLE1BQU0sR0FBRyxrQ0FBVyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxVQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDZCxRQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQjtHQUNEOzs7Ozs7OztTQU1vQixpQ0FBRTs7QUFFdEIsT0FBSSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7O0FBRzFFLFFBQUssSUFBSSxDQUFD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QUFLLENBQUMsQ0FBQzs7QUFFN0MsTUFBSSxTQUFTLEVBQUU7QUFDYixhQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQ3BELGVBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2hDO0dBQ0Y7O0FBRUQsU0FBTyxJQUFJLENBQUM7Q0FDYixDQUFDOzs7Ozs7Ozs7O0FBVUYsT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsVUFBUyxLQUFLLEVBQUM7QUFDM0MsTUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztBQUN4QyxTQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztDQUMzQyxDQUFDOzs7Ozs7Ozs7O0FBVUYsT0FBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsVUFBUyxLQUFLLEVBQUM7QUFDOUMsU0FBTyxDQUFDLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUM7Q0FDeEMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIGFmdGVyZ2xvdyAtIEFuIGVhc3kgdG8gaW50ZWdyYXRlIEhUTUw1IHZpZGVvIHBsYXllciB3aXRoIGxpZ2h0Ym94IHN1cHBvcnQuXG4gKiBAbGluayBodHRwOi8vYWZ0ZXJnbG93cGxheWVyLmNvbVxuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgUGxheWVyIGZyb20gJy4vY29tcG9uZW50cy9QbGF5ZXInO1xuaW1wb3J0IExpZ2h0Ym94IGZyb20gJy4vY29tcG9uZW50cy9MaWdodGJveCc7XG5pbXBvcnQgTGlnaHRib3hUcmlnZ2VyIGZyb20gJy4vY29tcG9uZW50cy9MaWdodGJveFRyaWdnZXInO1xuXG5jbGFzcyBBZnRlcmdsb3cge1xuXG5cdGNvbnN0cnVjdG9yKCl7XG5cdFx0LyoqXG5cdFx0ICogV2lsbCBob2xkIHRoZSBwbGF5ZXJzIGluIG9yZGVyIHRvIG1ha2UgdGhlbSBhY2Nlc3NpYmxlXG5cdFx0ICovXG5cdFx0dGhpcy5wbGF5ZXJzID0gW107XG5cdFx0LyoqXG5cdFx0ICogV2lsbCBob2xkIHRoZSB0cmlnZ2VyIGVsZW1lbnRzIHdoaWNoIHdpbGwgbGF1bmNoIGxpZ2h0Ym94IHBsYXllcnNcblx0XHQgKi9cblx0XHR0aGlzLmxpZ2h0Ym94dHJpZ2dlcnMgPSBbXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWF0ZSBhbGwgcGxheWVycyB0aGF0IHdlcmUgZm91bmQgYW5kIG5lZWQgdG8gYmUgaW5pdGlhdGVkXG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0aW5pdCgpe1xuXHRcdC8vIFJ1biBzb21lIHByZXBhcmF0aW9uc1xuXHRcdHRoaXMuY29uZmlndXJlVmlkZW9KUygpO1xuXG5cdFx0Ly8gaW5pdGlhbGl6ZSByZWd1bGFyIHBsYXllcnNcblx0XHR0aGlzLmluaXRWaWRlb0VsZW1lbnRzKCk7XG5cblx0XHQvLyBwcmVwYXJlIExpZ2h0Ym94ZXNcblx0XHR0aGlzLnByZXBhcmVMaWdodGJveFZpZGVvcygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIExvb2tzIGZvciBwbGF5ZXJzIHRvIGluaXRpYXRlIGFuZCBjcmVhdGVzIEFmdGVyZ2xvd1BsYXllciBvYmplY3RzIGJhc2VkIG9uIHRob3NlIGVsZW1lbnRzXG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0aW5pdFZpZGVvRWxlbWVudHMoKXtcblx0XHQvLyBHZXQgcGxheWVycyBpbmNsdWRpbmcgc3VibGltZSBmYWxsYmFja1xuXHRcdHZhciBwbGF5ZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInZpZGVvLmFmdGVyZ2xvdyx2aWRlby5zdWJsaW1lXCIpO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBwbGF5ZXJzXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwbGF5ZXJzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBwbGF5ZXIgPSBuZXcgUGxheWVyKHBsYXllcnNbaV0pO1xuXHRcdFx0cGxheWVyLmluaXQoKTtcblx0XHRcdHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFByZXBhcmVzIGFsbCBmb3VuZCB0cmlnZ2VyIGVsZW1lbnRzIGFuZCBtYWtlcyB0aGVtIG9wZW4gdGhlaXIgY29ycmVzcG9uZGluZyBwbGF5ZXJzIHdoZW4gbmVlZGVkXG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0cHJlcGFyZUxpZ2h0Ym94VmlkZW9zKCl7XG5cdFx0Ly8gR2V0IGxpZ2h0Ym94cGxheWVycyBpbmNsdWRpbmcgc3VibGltZSBmYWxsYmFja1xuXHRcdHZhciBsaWdodGJveHRyaWdnZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImEuYWZ0ZXJnbG93LGEuc3VibGltZVwiKTtcblx0XHRcblx0XHQvLyBJbml0aWFsaXplIHBsYXllcnMgbGF1bmNoaW5nIGluIGEgbGlnaHRib3hcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxpZ2h0Ym94dHJpZ2dlcnMubGVuZ3RoOyBpKyspe1xuXHRcdFx0bGV0IHRyaWdnZXIgPSBuZXcgTGlnaHRib3hUcmlnZ2VyKGxpZ2h0Ym94dHJpZ2dlcnNbaV0pO1xuXG5cdFx0XHR0aGlzLmJpbmRMaWdodGJveFRyaWdnZXJFdmVudHModHJpZ2dlcik7XG5cblx0XHRcdHRoaXMubGlnaHRib3h0cmlnZ2Vycy5wdXNoKHRyaWdnZXIpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBCaW5kcyBzb21lIGVsZW1lbnRzIGZvciBsaWdodGJveCB0cmlnZ2Vycy5cblx0ICogQHBhcmFtICB7b2JqZWN0fSB0aGUgdHJpZ2dlciBvYmplY3Rcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRiaW5kTGlnaHRib3hUcmlnZ2VyRXZlbnRzKHRyaWdnZXIpe1xuXHRcdHRyaWdnZXIub24oJ3RyaWdnZXInLCgpID0+IHtcblx0XHRcdHRoaXMucGxheWVycy5wdXNoKHRyaWdnZXIuZ2V0UGxheWVyKCkpO1xuXHRcdFx0dGhpcy5jb25zb2xpZGF0ZVBsYXllcnM7XG5cdFx0fSk7XG5cdFx0dHJpZ2dlci5vbignY2xvc2UnLCgpID0+IHtcblx0XHRcdHRoaXMuY29uc29saWRhdGVQbGF5ZXJzKCk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgdGhlIHBsYXllcnMgb2JqZWN0IGlmIGl0IHdhcyBpbml0aWF0ZWQgeWV0XG5cdCAqIEBwYXJhbSAgc3RyaW5nIFRoZSBwbGF5ZXIncyBpZFxuXHQgKiBAcmV0dXJuIGJvb2xlYW4gZmFsc2Ugb3Igb2JqZWN0IGlmIGZvdW5kXG5cdCAqL1xuXHRnZXRQbGF5ZXIocGxheWVyaWQpe1xuXHRcdC8vIFRyeSB0byBnZXQgcmVndWxhciBwbGF5ZXJcblx0IFx0Zm9yICh2YXIgaSA9IHRoaXMucGxheWVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0aWYodGhpcy5wbGF5ZXJzW2ldLmlkID09PSBwbGF5ZXJpZCl7XG5cdCBcdFx0XHRyZXR1cm4gdGhpcy5wbGF5ZXJzW2ldO1xuXHRcdFx0fVxuXHQgXHR9O1xuXHRcdC8vIEVsc2UgdHJ5IHRvIGZpbmQgbGlnaHRib3ggcGxheWVyXG5cdCBcdGZvciAodmFyIGkgPSB0aGlzLmxpZ2h0Ym94dHJpZ2dlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdGlmKHRoaXMubGlnaHRib3h0cmlnZ2Vyc1tpXS5wbGF5ZXJpZCA9PT0gcGxheWVyaWQpe1xuXHQgXHRcdFx0cmV0dXJuIHRoaXMubGlnaHRib3h0cmlnZ2Vyc1tpXS5nZXRQbGF5ZXIoKTtcblx0XHRcdH1cblx0IFx0fTtcblx0IFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNob3VsZCBkZXN0cm95IGEgcGxheWVyIGluc3RhbmNlIGlmIGl0IGV4aXN0cy4gTGlnaHRib3ggcGxheWVycyBzaG91bGQgYmUganVzdCBjbG9zZWQuXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gcGxheWVyaWQgIFRoZSBwbGF5ZXIncyBpZFxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICovXG5cdGRlc3Ryb3lQbGF5ZXIocGxheWVyaWQpe1xuXHRcdC8vIExvb2sgZm9yIHJlZ3VsYXIgcGxheWVyc1xuXHQgXHRmb3IgKHZhciBpID0gdGhpcy5wbGF5ZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdCBcdFx0aWYodGhpcy5wbGF5ZXJzW2ldLmlkID09PSBwbGF5ZXJpZCl7XG5cdCBcdFx0XHR0aGlzLnBsYXllcnNbaV0uZGVzdHJveSgpO1xuXHQgXHRcdFx0dGhpcy5wbGF5ZXJzLnNwbGljZShpLDEpO1xuXHQgXHRcdFx0cmV0dXJuIHRydWU7XG5cdCBcdFx0fVxuXHQgXHR9O1xuXHQgXHQvLyBFbHNlIGxvb2sgZm9yIGFuIGFjdGl2ZSBsaWdodGJveFxuXHQgXHRmb3IgKHZhciBpID0gdGhpcy5saWdodGJveHRyaWdnZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdCBcdFx0aWYodGhpcy5saWdodGJveHRyaWdnZXJzW2ldLnBsYXllcmlkID09PSBwbGF5ZXJpZCl7XG5cdCBcdFx0XHR0aGlzLmNsb3NlTGlnaHRib3goKTtcblx0IFx0XHRcdHJldHVybiB0cnVlO1xuXHQgXHRcdH1cblx0IFx0fTtcblx0IFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsb3NlcyB0aGUgbGlnaHRib3ggYW5kIHJlc2V0cyB0aGUgbGlnaHRib3ggcGxheWVyIHNvIHRoYXQgaXQgY2FuIGJlIHJlb3BlbmVkXG5cdCAqIEByZXR1cm4gdm9pZFxuXHQgKi9cblx0Y2xvc2VMaWdodGJveCgpe1xuXHRcdGZvciAodmFyIGkgPSB0aGlzLmxpZ2h0Ym94dHJpZ2dlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdHRoaXMubGlnaHRib3h0cmlnZ2Vyc1tpXS5jbG9zZUxpZ2h0Ym94KCk7XG5cdFx0fTtcblx0XHR0aGlzLmNvbnNvbGlkYXRlUGxheWVycygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnNvbGlkYXRlcyB0aGUgcGxheWVycyBjb250YWluZXIgYW5kIHJlbW92ZXMgcGxheWVycyB0aGF0IGFyZSBub3QgYWxpdmUgYW55IG1vcmUuXG5cdCAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblx0Y29uc29saWRhdGVQbGF5ZXJzKCl7XG5cdFx0Zm9yICh2YXIgaSA9IHRoaXMucGxheWVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0aWYodGhpcy5wbGF5ZXJzW2ldICE9PSB1bmRlZmluZWQgJiYgIXRoaXMucGxheWVyc1tpXS5hbGl2ZSl7XG5cdFx0XHRcdGRlbGV0ZSB0aGlzLnBsYXllcnNbaV07XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBSZXNldCBpbmRleGVzXG5cdFx0XHRcdHRoaXMucGxheWVycyA9IHRoaXMucGxheWVycy5maWx0ZXIoKCkgPT57cmV0dXJuIHRydWV9KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJ1biBzb21lIGNvbmZpZ3VyYXRpb25zIG9uIHZpZGVvLmpzIHRvIG1ha2UgaXQgd29yayBmb3IgdXNcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRjb25maWd1cmVWaWRlb0pTKCl7XG5cdFx0Ly8gRGlzYWJsZSB0cmFja2luZ1xuXHRcdHdpbmRvdy5IRUxQX0lNUFJPVkVfVklERU9KUyA9IGZhbHNlO1x0XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWZ0ZXJnbG93OyIsIi8qKlxuICogYWZ0ZXJnbG93IC0gQW4gZWFzeSB0byBpbnRlZ3JhdGUgSFRNTDUgdmlkZW8gcGxheWVyIHdpdGggbGlnaHRib3ggc3VwcG9ydC5cbiAqIEBsaW5rIGh0dHA6Ly9hZnRlcmdsb3dwbGF5ZXIuY29tXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgVXRpbCBmcm9tICcuLi9saWIvVXRpbCc7XG5cbmNsYXNzIENvbmZpZyB7XG5cblx0Y29uc3RydWN0b3IodmlkZW9lbGVtZW50LCBza2luID0gJ2FmdGVyZ2xvdycpe1xuXG5cdFx0Ly8gQ2hlY2sgZm9yIHRoZSB2aWRlbyBlbGVtZW50XG5cdFx0aWYodmlkZW9lbGVtZW50ID09IHVuZGVmaW5lZCl7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdQbGVhc2UgcHJvdmlkZSBhIHByb3BlciB2aWRlbyBlbGVtZW50IHRvIGFmdGVyZ2xvdycpO1xuXHRcdH1cblx0XHRlbHNle1xuXHRcdFx0Ly8gU2V0IHZpZGVvZWxlbWVudFxuXHRcdFx0dGhpcy52aWRlb2VsZW1lbnQgPSB2aWRlb2VsZW1lbnQ7XG5cblx0XHRcdC8vIFByZXBhcmUgdGhlIG9wdGlvbnMgY29udGFpbmVyXG5cdFx0XHR0aGlzLm9wdGlvbnMgPSB7fTtcblxuXHRcdFx0Ly8gUHJlcGFyZSBvcHRpb24gdmFyaWFibGVzXG5cdFx0XHR0aGlzLnNldERlZmF1bHRPcHRpb25zKCk7XG5cdFx0XHR0aGlzLnNldFNraW5Db250cm9scygpO1xuXG5cdFx0XHRsZXQgdXRpbCA9IG5ldyBVdGlsO1xuXHRcdFx0Ly8gSW5pdGlhbGl6ZSB5b3V0dWJlIGlmIHRoZSBjdXJyZW50IHBsYXllciBpcyBhIHlvdXR1YmUgcGxheWVyXG5cdFx0XHRpZih1dGlsLmlzWW91dHViZVBsYXllcih0aGlzLnZpZGVvZWxlbWVudCkpe1xuXHRcdFx0XHR0aGlzLnNldFlvdXR1YmVPcHRpb25zKCk7XHRcblx0XHRcdH1cblxuXHRcdFx0Ly8gU2V0IHRoZSBza2luXG5cdFx0XHR0aGlzLnNraW4gPSBza2luO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHNvbWUgYmFzaWMgb3B0aW9ucyBiYXNlZCBvbiB0aGUgdmlkZW9lbGVtZW50J3MgYXR0cmlidXRlc1xuXHQgKiBAcmV0dXJuIHt2b2lkfVxuXHQgKi9cblx0c2V0RGVmYXVsdE9wdGlvbnMoKXtcblx0XHQvLyBDb250cm9scyBuZWVkZWQgZm9yIHRoZSBwbGF5ZXJcblx0XHR0aGlzLm9wdGlvbnMuY29udHJvbHMgPSB0cnVlO1xuXHRcdFxuXHRcdC8vIERlZmF1bHQgdGVjaCBvcmRlclxuXHRcdHRoaXMub3B0aW9ucy50ZWNoT3JkZXIgPSBbXCJodG1sNVwiLFwiZmxhc2hcIl07XG5cdFxuXHRcdC8vIFNvbWUgZGVmYXVsdCBwbGF5ZXIgcGFyYW1ldGVyc1xuXHRcdHRoaXMub3B0aW9ucy5wcmVsb2FkID0gdGhpcy5nZXRQbGF5ZXJBdHRyaWJ1dGVGcm9tVmlkZW9FbGVtZW50KCdwcmVsb2FkJywnYXV0bycpO1xuXHRcdHRoaXMub3B0aW9ucy5hdXRvcGxheSA9IHRoaXMuZ2V0UGxheWVyQXR0cmlidXRlRnJvbVZpZGVvRWxlbWVudCgnYXV0b3BsYXknKTtcblx0XHR0aGlzLm9wdGlvbnMucG9zdGVyID0gdGhpcy5nZXRQbGF5ZXJBdHRyaWJ1dGVGcm9tVmlkZW9FbGVtZW50KCdwb3N0ZXInKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGEgY29uZmlndXJhdGlvbiB2YWx1ZSB0aGF0IGhhcyBiZWVuIHBhc3NlZCB0byB0aGUgdmlkZW9lbGVtZW50IGFzIEhUTUwgdGFnIGF0dHJpYnV0ZVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9ICBhdHRyaWJ1dGVuYW1lICBUaGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlIHRvIGdldFxuXHQgKiBAcGFyYW0gIHttaXhlZH0gZmFsbGJhY2sgICAgICBcdFRoZSBleHBlY3RlZCBmYWxsYmFjayBpZiB0aGUgYXR0cmlidXRlIHdhcyBub3Qgc2V0IC0gZmFsc2UgYnkgZGVmYXVsdFxuXHQgKiBAcmV0dXJuIHttaXhlZH1cdFx0XHRcdFx0VGhlIGF0dHJpYnV0ZSAod2l0aCBkYXRhLWF0dHJpYnV0ZW5hbWUgYmVpbmcgcHJlZmVycmVkKSBvciB0aGUgZmFsbGJhY2sgaWYgbm9uZS5cblx0ICovXG5cdGdldFBsYXllckF0dHJpYnV0ZUZyb21WaWRlb0VsZW1lbnQoYXR0cmlidXRlbmFtZSwgZmFsbGJhY2sgPSBmYWxzZSl7XG5cdFx0aWYodGhpcy52aWRlb2VsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1cIithdHRyaWJ1dGVuYW1lKSAhPT0gbnVsbCl7XG5cdFx0XHRyZXR1cm4gdGhpcy52aWRlb2VsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1cIithdHRyaWJ1dGVuYW1lKTtcblx0XHR9IGVsc2UgaWYodGhpcy52aWRlb2VsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZW5hbWUpICE9PSBudWxsKXtcblx0XHRcdHJldHVybiB0aGlzLnZpZGVvZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlbmFtZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxsYmFjaztcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgY29udHJvbHMgd2hpY2ggYXJlIG5lZWRlZCBmb3IgdGhlIHBsYXllciB0byB3b3JrIHByb3Blcmx5LlxuXHQgKi9cblx0c2V0U2tpbkNvbnRyb2xzKCl7XG5cdFx0Ly8gRm9yIG5vdywgd2UganVzdCBvdXRwdXQgdGhlIGRlZmF1bHQgJ2FmdGVyZ2xvdycgc2tpbiBjaGlsZHJlbiwgYXMgdGhlcmUgaXNuJ3QgYW55IG90aGVyIHNraW4gZGVmaW5lZCB5ZXRcblx0XHRsZXQgY2hpbGRyZW4gPSB7XG5cdFx0XHRUb3BDb250cm9sQmFyOiB7XG5cdFx0XHRcdGNoaWxkcmVuOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bmFtZTogXCJmdWxsc2NyZWVuVG9nZ2xlXCJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdF1cblx0XHRcdH0sXG5cdFx0XHRjb250cm9sQmFyOiB7XG5cdFx0XHRcdGNoaWxkcmVuOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bmFtZTogXCJjdXJyZW50VGltZURpc3BsYXlcIlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bmFtZTogXCJwbGF5VG9nZ2xlXCJcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdG5hbWU6IFwiZHVyYXRpb25EaXNwbGF5XCJcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdG5hbWU6IFwicHJvZ3Jlc3NDb250cm9sXCJcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdG5hbWU6IFwiUmVzb2x1dGlvblN3aXRjaGluZ0J1dHRvblwiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRuYW1lOiBcInZvbHVtZU1lbnVCdXR0b25cIixcblx0XHRcdFx0XHRcdGlubGluZTp0cnVlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRuYW1lOiBcInN1YnRpdGxlc0J1dHRvblwiXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRuYW1lOiBcImNhcHRpb25zQnV0dG9uXCJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdF1cblx0XHRcdH1cblx0XHR9O1xuXHRcdHRoaXMub3B0aW9ucy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgb3B0aW9ucyBuZWVkZWQgZm9yIHlvdXR1YmUgdG8gd29yayBhbmQgcmVwbGFjZXMgdGhlIHNvdXJjZXMgd2l0aCB0aGUgY29ycmVjdCB5b3V0dWJlIHNvdXJjZVxuXHQgKi9cblx0c2V0WW91dHViZU9wdGlvbnMoKXtcblx0XHR0aGlzLm9wdGlvbnMuc2hvd2luZm8gPSAwO1xuXHRcdHRoaXMub3B0aW9ucy50ZWNoT3JkZXIgPSBbXCJ5b3V0dWJlXCJdO1xuXHRcdHRoaXMub3B0aW9ucy5zb3VyY2VzID0gW3tcblx0XHRcdFwidHlwZVwiOiBcInZpZGVvL3lvdXR1YmVcIixcblx0XHRcdFwic3JjXCI6IFwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1cIit0aGlzLmdldFBsYXllckF0dHJpYnV0ZUZyb21WaWRlb0VsZW1lbnQoJ3lvdXR1YmUtaWQnKVxuXHRcdH1dO1xuXG5cdFx0bGV0IHV0aWwgPSBuZXcgVXRpbDtcblx0XHRpZih1dGlsLmllKCkuYWN0dWFsVmVyc2lvbiA+PSA4ICYmIHV0aWwuaWUoKS5hY3R1YWxWZXJzaW9uIDw9IDExKXtcblx0XHRcdHRoaXMub3B0aW9ucy55b3V0dWJlID0ge1xuXHRcdFx0XHR5dENvbnRyb2xzIDogMixcblx0XHRcdFx0Y29sb3IgOiBcIndoaXRlXCJcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0Z2V0U2tpbkNsYXNzKCl7XG5cdFx0dmFyIGNzc2NsYXNzPVwidmpzLWFmdGVyZ2xvdy1za2luXCI7XG5cdFx0aWYodGhpcy5za2luICE9PSAnYWZ0ZXJnbG93Jyl7XG5cdFx0XHRjc3NjbGFzcyA9IGNzc2NsYXNzICsgXCIgYWZ0ZXJnbG93LXNraW4tXCIrdGhpcy5za2luO1xuXHRcdH1cblx0XHRyZXR1cm4gY3NzY2xhc3M7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29uZmlnOyIsIi8qKlxuICogYWZ0ZXJnbG93IC0gQW4gZWFzeSB0byBpbnRlZ3JhdGUgSFRNTDUgdmlkZW8gcGxheWVyIHdpdGggbGlnaHRib3ggc3VwcG9ydC5cbiAqIEBsaW5rIGh0dHA6Ly9hZnRlcmdsb3dwbGF5ZXIuY29tXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgUGxheWVyIGZyb20gJy4vUGxheWVyJztcbmltcG9ydCBVdGlsIGZyb20gJy4uL2xpYi9VdGlsJztcblxuLy8gRm9yIGVtaXR0aW5nIGFuZCByZWNlaXZpbmcgZXZlbnRzXG5pbXBvcnQgRW1pdHRlciBmcm9tICcuLi8uLi8uLi8uLi92ZW5kb3IvRW1pdHRlci9FbWl0dGVyJztcblxuY2xhc3MgTGlnaHRib3gge1xuXG5cdGNvbnN0cnVjdG9yKCl7XG5cdFx0dGhpcy5idWlsZCgpO1xuXHRcdEVtaXR0ZXIodGhpcyk7XG5cdH1cblxuXHRidWlsZCgpe1xuXHRcdC8vIFByZXBhcmUgdGhlIGxpZ2h0Ym94IGVsZW1lbnRcblx0XHR2YXIgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLmFkZENsYXNzKFwiYWZ0ZXJnbG93LWxpZ2h0Ym94LXdyYXBwZXJcIik7XG5cdFx0dmFyIGNvdmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykuYWRkQ2xhc3MoXCJjb3ZlclwiKTtcblx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKGNvdmVyKTtcblxuXHRcdC8vIFByZXBhcmUgdGhlIHBsYXllciBlbGVtZW50IGFkZCBwdXNoIGl0IHRvIHRoZSBsaWdodGJveCBob2xkZXJcblx0XHR2YXIgbGlnaHRib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKS5hZGRDbGFzcyhcImFmdGVyZ2xvdy1saWdodGJveFwiKTtcblx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKGxpZ2h0Ym94KTtcblxuXHRcdHRoaXMud3JhcHBlciA9IHdyYXBwZXI7XG5cdFx0dGhpcy5jb3ZlciA9IGNvdmVyO1xuXHRcdHRoaXMubGlnaHRib3ggPSBsaWdodGJveDtcblx0fVxuXG5cdHBhc3NWaWRlb0VsZW1lbnQodmlkZW9lbGVtZW50KXtcblx0XHR0aGlzLnBsYXllcmlkID0gdmlkZW9lbGVtZW50LmdldEF0dHJpYnV0ZShcImlkXCIpO1xuXHRcdHRoaXMubGlnaHRib3guYXBwZW5kQ2hpbGQodmlkZW9lbGVtZW50KTtcblx0XHR0aGlzLnZpZGVvZWxlbWVudCA9IHZpZGVvZWxlbWVudDtcblx0XHR0aGlzLnZpZGVvZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhdXRvcGxheVwiLFwiYXV0b3BsYXlcIik7XG5cblx0XHR0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIodGhpcy52aWRlb2VsZW1lbnQpO1xuXHR9XG5cblx0bGF1bmNoKF9jYWxsYmFjayl7XG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLndyYXBwZXIpO1xuXG5cdFx0dGhpcy5wbGF5ZXIuaW5pdChmbiA9PiB7XG5cblx0XHRcdHZhciB2aWRlb2pzID0gdGhpcy5wbGF5ZXIudmlkZW9qcztcblxuXHRcdFx0Ly8gUHJldmVudCBhdXRvcGxheSBmb3IgbW9iaWxlIGRldmljZXMsIHdvbid0IHdvcmsgYW55d2F5cy4uLlxuXHRcdFx0aWYoIWlzTW9iaWxlKXtcblx0XHRcdFx0Ly8gSWYgYXV0b3BsYXkgZGlkbid0IHdvcmtcblx0XHRcdFx0aWYodmlkZW9qcy5wYXVzZWQoKSl7XG5cdFx0XHRcdFx0dmlkZW9qcy5wb3N0ZXJJbWFnZS5zaG93KCk7XG5cdFx0XHRcdFx0dmlkZW9qcy5iaWdQbGF5QnV0dG9uLnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGRpbmcgYXV0b2Nsb3NlIGZ1bmN0aW9uYWxpdHlcblx0XHRcdGlmKHRoaXMudmlkZW9lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtYXV0b2Nsb3NlXCIpID09IFwidHJ1ZVwiKXtcblx0XHRcdFx0dmlkZW9qcy5vbignZW5kZWQnLCAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdC8vIEVsc2Ugc2hvdyB0aGUgcG9zdGVyIGZyYW1lIG9uIGVuZGVkLlxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0dmlkZW9qcy5vbignZW5kZWQnLCAoKSA9PiB7XG5cdFx0XHRcdFx0dmlkZW9qcy5wb3N0ZXJJbWFnZS5zaG93KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHR2aWRlb2pzLlRvcENvbnRyb2xCYXIuYWRkQ2hpbGQoXCJMaWdodGJveENsb3NlQnV0dG9uXCIpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gcmVzaXplIHRoZSBsaWdodGJveCBhbmQgbWFrZSBpdCBhdXRvcmVzaXplXG5cdFx0dGhpcy5yZXNpemUoKTtcblx0XHRhZGRFdmVudEhhbmRsZXIod2luZG93LCdyZXNpemUnLCgpID0+IHtcblx0XHRcdHRoaXMucmVzaXplKCk7XG5cdFx0fSk7XG5cblx0XHQvLyBiaW5kIHRoZSBjbG9zaW5nIGV2ZW50XG5cdFx0YWRkRXZlbnRIYW5kbGVyKHRoaXMuY292ZXIsJ2NsaWNrJywgKCkgPT4geyBcblx0XHRcdHRoaXMuY2xvc2UoKTsgXG5cdFx0fSk7XG5cblx0XHQvLyBiaW5kIHRoZSBlc2NhcGUga2V5XG5cdFx0YWRkRXZlbnRIYW5kbGVyKHdpbmRvdywna2V5dXAnLChlKSA9PiB7XG5cdFx0XHQvLyBGYWxsYmFjayBmb3IgSUU4XG5cdFx0XHRlID0gZSA/IGUgOiB3aW5kb3cuZXZlbnQ7XG5cdFx0XHRpZihlLmtleUNvZGUgPT0gMjcpXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuY2xvc2UoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIExhdW5jaCB0aGUgY2FsbGJhY2sgaWYgdGhlcmUgaXMgb25lXG5cdFx0aWYodHlwZW9mIF9jYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpe1xuXHRcdFx0X2NhbGxiYWNrKHRoaXMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXNpemUgdGhlIGxpZ2h0Ym94IGFjY29yZGluZyB0byB0aGUgbWVkaWEgcmF0aW9cblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRyZXNpemUoKXtcblx0XHQvLyBEbyBpZiBpdCBleGlzdHNcblx0XHRpZih0aGlzLndyYXBwZXIgIT0gdW5kZWZpbmVkKXtcblx0XHRcdC8vIFN0YW5kYXJkIEhUTUw1IHBsYXllclxuXHRcdFx0aWYodGhpcy52aWRlb2VsZW1lbnQgIT09IHVuZGVmaW5lZCl7XHRcdFx0XG5cdFx0XHRcdHZhciByYXRpbyA9IHRoaXMudmlkZW9lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtcmF0aW9cIik7XG5cdFx0XHRcdGlmKHRoaXMudmlkZW9lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtb3ZlcnNjYWxlXCIpID09IFwiZmFsc2VcIilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vIENhbGN1bGF0ZSB0aGUgbmV3IHNpemUgb2YgdGhlIHBsYXllciB3aXRoIG1heHdpZHRoXG5cdFx0XHRcdFx0dmFyIHNpemVzID0gdGhpcy5jYWxjdWxhdGVMaWdodGJveFNpemVzKHJhdGlvLCBwYXJzZUludCh0aGlzLnZpZGVvZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1heHdpZHRoXCIpKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHQvLyBDYWxjdWxhdGUgdGhlIG5ldyBzaXplIG9mIHRoZSBwbGF5ZXIgd2l0aG91dCBtYXh3aWR0aFxuXHRcdFx0XHRcdHZhciBzaXplcyA9IHRoaXMuY2FsY3VsYXRlTGlnaHRib3hTaXplcyhyYXRpbyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdC8vIFlvdXR1YmVcblx0XHRcdFx0aWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImRpdi5hZnRlcmdsb3ctbGlnaHRib3gtd3JhcHBlciAudmpzLXlvdXR1YmVcIikubGVuZ3RoID09IDEpe1xuXHRcdFx0XHRcdHBsYXllcmVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LmFmdGVyZ2xvdy1saWdodGJveC13cmFwcGVyIC52anMteW91dHViZVwiKTtcblx0XHRcdFx0XHR2YXIgcmF0aW8gPSBwbGF5ZXJlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtcmF0aW9cIik7XG5cdFx0XHRcdFx0dmFyIHNpemVzID0gdGhpcy5jYWxjdWxhdGVMaWdodGJveFNpemVzKHJhdGlvKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQvLyBBcHBseSB0aGUgaGVpZ2h0IGFuZCB3aWR0aFxuXHRcdFx0dGhpcy53cmFwcGVyLnN0eWxlLndpZHRoID0gc2l6ZXMud2lkdGg7XG5cdFx0XHR0aGlzLndyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gc2l6ZXMuaGVpZ2h0O1xuXG5cdFx0XHR0aGlzLmxpZ2h0Ym94LnN0eWxlLmhlaWdodCA9IHNpemVzLnBsYXllcmhlaWdodCArIFwicHhcIjtcblx0XHRcdHRoaXMubGlnaHRib3guc3R5bGUud2lkdGggPSBzaXplcy5wbGF5ZXJ3aWR0aCArIFwicHhcIjtcblx0XHRcdHRoaXMubGlnaHRib3guc3R5bGUudG9wID0gc2l6ZXMucGxheWVyb2Zmc2V0dG9wICsgXCJweFwiO1xuXHRcdFx0dGhpcy5saWdodGJveC5zdHlsZS5sZWZ0ID0gc2l6ZXMucGxheWVyb2Zmc2V0bGVmdCArIFwicHhcIjtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogY2FsY3VsYXRlcyB0aGUgY3VycmVudCBsaWdodGJveCBzaXplIGJhc2VkIG9uIHdpbmRvdyB3aWR0aCBhbmQgaGVpZ2h0IGFuZCBvbiB0aGUgcGxheWVycyByYXRpb1xuXHQgKiBAcGFyYW0gIHtmbG9hdH0gcmF0aW8gICBUaGUgcGxheWVycyByYXRpb1xuXHQgKiBAcmV0dXJuIHtvYmplY3R9ICAgICAgICBTb21lIHNpemVzIHdoaWNoIGNhbiBiZSB1c2VkXG5cdCAqL1xuXHRjYWxjdWxhdGVMaWdodGJveFNpemVzKHJhdGlvLCBtYXh3aWR0aCl7XG5cdFx0dmFyIHNpemVzID0ge307XG5cblx0XHQvLyBHZXQgd2luZG93IHdpZHRoICYmIGhlaWdodFxuXHRcdHNpemVzLndpZHRoID0gd2luZG93LmNsaWVudFdpZHRoXG5cdFx0fHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXG5cdFx0fHwgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aFxuXHRcdHx8IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHNpemVzLmhlaWdodCA9IHdpbmRvdy5jbGllbnRIZWlnaHRcblx0XHR8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG5cdFx0fHwgZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHRcblx0XHR8fCB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cblx0XHQvLyBXaW5kb3cgaXMgd2lkZSBlbm91Z2hcblx0XHRpZihzaXplcy5oZWlnaHQvc2l6ZXMud2lkdGggPiByYXRpbylcblx0XHR7XHRcblx0XHRcdC8vIENoZWNrIGlmIHRoZSBsaWdodGJveCBzaG91bGQgb3ZlcnNjYWxlLCBldmVuIGlmIHZpZGVvIGlzIHNtYWxsZXJcblx0XHRcdGlmKHR5cGVvZiBtYXh3aWR0aCAhPT0gJ3VuZGVmaW5lZCcgJiYgbWF4d2lkdGggPCBzaXplcy53aWR0aCAqIC45MCl7XG5cdFx0XHRcdHNpemVzLnBsYXllcndpZHRoID0gbWF4d2lkdGg7XG5cdFx0XHR9XG5cdFx0XHQvLyBFbHNlIHNjYWxlIHVwIGFzIG11Y2ggYXMgcG9zc2libGVcblx0XHRcdGVsc2V7XG5cdFx0XHRcdHNpemVzLnBsYXllcndpZHRoID0gc2l6ZXMud2lkdGggKiAuOTA7XG5cdFx0XHR9XG5cdFx0XHRzaXplcy5wbGF5ZXJoZWlnaHQgPSBzaXplcy5wbGF5ZXJ3aWR0aCAqIHJhdGlvO1xuXHRcdH1cblx0XHRlbHNle1xuXHRcdFx0Ly8gQ2hlY2sgaWYgdGhlIGxpZ2h0Ym94IHNob3VsZCBvdmVyc2NhbGUsIGV2ZW4gaWYgdmlkZW8gaXMgc21hbGxlclxuXHRcdFx0aWYodHlwZW9mIG1heHdpZHRoICE9PSAndW5kZWZpbmVkJyAmJiBtYXh3aWR0aCA8IChzaXplcy5oZWlnaHQgKiAuOTIpL3JhdGlvKVxuXHRcdFx0e1xuXHRcdFx0XHRzaXplcy5wbGF5ZXJoZWlnaHQgPSBtYXh3aWR0aCAqIHJhdGlvO1xuXHRcdFx0fVxuXHRcdFx0Ly8gRWxzZSBzY2FsZSB1cCBhcyBtdWNoIGFzIHBvc3NpYmxlXG5cdFx0XHRlbHNle1xuXHRcdFx0XHRzaXplcy5wbGF5ZXJoZWlnaHQgPSBzaXplcy5oZWlnaHQgKiAuOTI7XG5cdFx0XHR9XG5cdFx0XHRzaXplcy5wbGF5ZXJ3aWR0aCA9IHNpemVzLnBsYXllcmhlaWdodCAvIHJhdGlvO1xuXHRcdH1cblx0XHRzaXplcy5wbGF5ZXJvZmZzZXR0b3AgPSAoIHNpemVzLmhlaWdodCAtIHNpemVzLnBsYXllcmhlaWdodCApIC8gMjtcblx0XHRzaXplcy5wbGF5ZXJvZmZzZXRsZWZ0ID0gKCBzaXplcy53aWR0aCAtIHNpemVzLnBsYXllcndpZHRoICkgLyAyO1xuXG5cdFx0cmV0dXJuIHNpemVzO1xuXHR9XG5cblx0Y2xvc2UoKXtcblx0XHR0aGlzLnBsYXllci5kZXN0cm95KHRydWUpO1xuXHRcdHRoaXMud3JhcHBlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMud3JhcHBlcik7XG5cdFx0dGhpcy5lbWl0KCdjbG9zZScpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpZ2h0Ym94OyIsIi8qKlxuICogYWZ0ZXJnbG93IC0gQW4gZWFzeSB0byBpbnRlZ3JhdGUgSFRNTDUgdmlkZW8gcGxheWVyIHdpdGggbGlnaHRib3ggc3VwcG9ydC5cbiAqIEBsaW5rIGh0dHA6Ly9hZnRlcmdsb3dwbGF5ZXIuY29tXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgTGlnaHRib3ggZnJvbSAnLi9MaWdodGJveCc7XG5cbi8vIEZvciBlbWl0dGluZyBhbmQgcmVjZWl2aW5nIGV2ZW50c1xuaW1wb3J0IEVtaXR0ZXIgZnJvbSAnLi4vLi4vLi4vLi4vdmVuZG9yL0VtaXR0ZXIvRW1pdHRlcic7XG5pbXBvcnQgRE9NRWxlbWVudCBmcm9tICcuLi9saWIvRE9NRWxlbWVudCc7XG5cbmNsYXNzIExpZ2h0Ym94VHJpZ2dlciBleHRlbmRzIERPTUVsZW1lbnQge1xuXG5cdGNvbnN0cnVjdG9yKG5vZGUpe1xuXHRcdHN1cGVyKG5vZGUpO1xuXHRcdHRoaXMuaW5pdCgpO1xuXHR9XG5cblx0aW5pdCgpe1xuXHRcdC8vIEdldCB0aGUgcGxheWVyaWRcblx0XHR0aGlzLnBsYXllcmlkID0gdGhpcy5ub2RlLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XG5cdFx0Ly8gSGlkZSB0aGUgdmlkZW8gZWxlbWVudFxuXHRcdHRoaXMudmlkZW9lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnBsYXllcmlkKTtcblx0XHRcblx0XHR0aGlzLnByZXBhcmUoKTtcblxuXHRcdEVtaXR0ZXIodGhpcyk7XG5cdH1cblxuXHRwcmVwYXJlKCl7XG5cdFx0Ly8gQWRkIG1ham9yIGNsYXNzXG5cdFx0dGhpcy52aWRlb2VsZW1lbnQuYWRkQ2xhc3MoXCJhZnRlcmdsb3ctbGlnaHRib3hwbGF5ZXJcIik7XG5cdFx0Ly8gUHJlcGFyZSB0aGUgZWxlbWVudFxuXHRcdHRoaXMudmlkZW9lbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtYXV0b3Jlc2l6ZVwiLFwiZml0XCIpO1xuXG5cdFx0dGhpcy5iaW5kKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHQvLyBQcmV2ZW50IHRoZSBjbGljayBldmVudCwgSUU4IGNvbXBhdGlibGVcblx0XHRcdGUgPSBlID8gZSA6IHdpbmRvdy5ldmVudDtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Ly8gTGF1bmNoIHRoZSBsaWdodGJveFxuXHRcdFx0dGhpcy50cmlnZ2VyKCk7XG5cdFx0fSk7XG5cdH1cblxuXHR0cmlnZ2VyKCl7XG5cdFx0dGhpcy5saWdodGJveCA9IG5ldyBMaWdodGJveCgpO1xuXG5cdFx0dmFyIHZpZGVvZWxlbWVudCA9IHRoaXMudmlkZW9lbGVtZW50LmNsb25lTm9kZSh0cnVlKTtcblx0XHRcblx0XHR0aGlzLmxpZ2h0Ym94LnBhc3NWaWRlb0VsZW1lbnQodmlkZW9lbGVtZW50KTtcblxuXHRcdHRoaXMuZW1pdCgndHJpZ2dlcicpO1xuXG5cdFx0dGhpcy5saWdodGJveC5sYXVuY2goKTtcblxuXHRcdC8vIFBhc3MgZXZlbnQgdG8gYWZ0ZXJnbG93IGNvcmVcblx0XHR0aGlzLmxpZ2h0Ym94Lm9uKCdjbG9zZScsIGZuID0+IHtcblx0XHRcdHRoaXMuZW1pdCgnY2xvc2UnKTtcblx0XHR9KTtcblx0fVxuXG5cdGNsb3NlTGlnaHRib3goKXtcblx0XHRpZih0aGlzLmxpZ2h0Ym94ICE9IHVuZGVmaW5lZCl7XG5cdFx0XHR0aGlzLmxpZ2h0Ym94LmNsb3NlKCk7XG5cdFx0XHRkZWxldGUgdGhpcy5saWdodGJveDtcblx0XHR9XG5cdH1cblxuXHRnZXRQbGF5ZXIoKXtcblx0XHRyZXR1cm4gdGhpcy5saWdodGJveC5wbGF5ZXI7XG5cdH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBMaWdodGJveFRyaWdnZXI7IiwiLyoqXG4gKiBhZnRlcmdsb3cgLSBBbiBlYXN5IHRvIGludGVncmF0ZSBIVE1MNSB2aWRlbyBwbGF5ZXIgd2l0aCBsaWdodGJveCBzdXBwb3J0LlxuICogQGxpbmsgaHR0cDovL2FmdGVyZ2xvd3BsYXllci5jb21cbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IENvbmZpZyBmcm9tICcuL0NvbmZpZyc7XG5pbXBvcnQgVXRpbCBmcm9tICcuLi9saWIvVXRpbCc7XG5cbmNsYXNzIFBsYXllciB7XG5cblx0Y29uc3RydWN0b3IodmlkZW9lbGVtZW50KXtcblx0XHQvLyBQYXNzaW5nIHRvIHNldHVwIGZvciB0ZXN0YWJpbGl0eVxuXHRcdHRoaXMuc2V0dXAodmlkZW9lbGVtZW50KTtcblx0fVxuXG5cdHNldHVwKHZpZGVvZWxlbWVudCl7XG5cdFx0dGhpcy52aWRlb2VsZW1lbnQgPSB2aWRlb2VsZW1lbnQ7XG5cdFx0dGhpcy5pZCA9IHZpZGVvZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cdFx0dGhpcy5jb25maWcgPSBuZXcgQ29uZmlnKHZpZGVvZWxlbWVudCk7XG5cdFx0dGhpcy5wcmVwYXJlVmlkZW9FbGVtZW50KCk7XG5cdFx0Ly8gU2V0IGFuIGFjdGl2aXR5IHZhcmlhYmxlIHRvIGJlIGFibGUgdG8gZGV0ZWN0IGlmIHRoZSBwbGF5ZXIgY2FuIGJlIGRlbGV0ZWRcblx0XHR0aGlzLmFsaXZlID0gdHJ1ZTtcblx0fVxuXG5cdGluaXQoX2NhbGxiYWNrKXtcblx0XHRsZXQgdmlkZW9lbGVtZW50ID0gdGhpcy52aWRlb2VsZW1lbnQ7XG5cdFx0bGV0IG9wdGlvbnMgPSB0aGlzLmNvbmZpZy5vcHRpb25zO1xuXG5cdFx0Ly8gaW5pdGlhdGUgdmlkZW9qcyBhbmQgZG8gc29tZSBwb3N0IGluaXRpYXRpb24gc3R1ZmZcblx0XHR2YXIgcGxheWVyID0gdmlkZW9qcyh2aWRlb2VsZW1lbnQsIG9wdGlvbnMpLnJlYWR5KGZ1bmN0aW9uKCl7XG5cblx0XHRcdC8vIEVuYWJsZSBob3RrZXlzXG5cdFx0XHR0aGlzLmhvdGtleXMoe1xuXHRcdFx0XHRlbmFibGVGdWxsc2NyZWVuOiBmYWxzZSxcblx0XHRcdFx0ZW5hYmxlTnVtYmVyczogZmFsc2Vcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBTZXQgaW5pdGlhbCB2b2x1bWUgaWYgbmVlZGVkXG5cdFx0XHRpZih2aWRlb2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXZvbHVtZScpICE9PSBudWxsKXtcblx0XHRcdFx0dmFyIHZvbHVtZSA9IHBhcnNlRmxvYXQodmlkZW9lbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS12b2x1bWUnKSk7XG5cdFx0XHRcdHRoaXMudm9sdW1lKHZvbHVtZSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZpeCB5b3V0dWJlIHBvc3RlclxuXHRcdFx0bGV0IHV0aWwgPSBuZXcgVXRpbCgpO1xuXHRcdFx0aWYodXRpbC5pc1lvdXR1YmVQbGF5ZXIodmlkZW9lbGVtZW50KSAmJiAhb3B0aW9ucy5wb3N0ZXIgJiYgdGhpcy50ZWNoXy5wb3N0ZXIgIT0gXCJcIil7XG5cdFx0XHRcdHRoaXMuYWRkQ2xhc3MoJ3Zqcy15b3V0dWJlLXJlYWR5Jyk7XG5cdFx0XHRcdHRoaXMucG9zdGVyKHRoaXMudGVjaF8ucG9zdGVyKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWRkIHJlc29sdXRpb24gc3dpdGNoaW5nXG5cdFx0XHQvLyB0aGlzLmNvbnRyb2xCYXIuYWRkQ2hpbGQoXCJSZXNvbHV0aW9uU3dpdGNoaW5nQnV0dG9uXCIpO1xuXG5cdFx0XHQvLyBMYXVuY2ggdGhlIGNhbGxiYWNrIGlmIHRoZXJlIGlzIG9uZVxuXHRcdFx0aWYodHlwZW9mIF9jYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpe1xuXHRcdFx0XHRfY2FsbGJhY2sodGhpcyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dGhpcy52aWRlb2pzID0gcGxheWVyO1xuXHR9XG5cblx0cHJlcGFyZVZpZGVvRWxlbWVudCgpe1xuXHRcdC8vIEFkZCBzb21lIGNsYXNzZXNcblx0XHR0aGlzLnZpZGVvZWxlbWVudC5hZGRDbGFzcyhcInZpZGVvLWpzXCIpO1xuXHRcdHRoaXMudmlkZW9lbGVtZW50LmFkZENsYXNzKFwiYWZ0ZXJnbG93XCIpO1xuXG5cdFx0dGhpcy52aWRlb2VsZW1lbnQuYWRkQ2xhc3ModGhpcy5jb25maWcuZ2V0U2tpbkNsYXNzKCkpO1xuXG5cdFx0Ly8gUmVtb3ZlIHN1YmxpbWUgc3R1ZmZcblx0XHR0aGlzLnZpZGVvZWxlbWVudC5yZW1vdmVDbGFzcyhcInN1YmxpbWVcIik7XG5cblx0XHQvLyBNYWtlIGxpZ2h0Ym94cGxheWVyIG5vdCBvdmVyc2NhbGVcblx0XHRpZih0aGlzLnZpZGVvZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW92ZXJzY2FsZVwiKSA9PSBcImZhbHNlXCIpe1xuXHRcdFx0dGhpcy52aWRlb2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1tYXh3aWR0aFwiLHRoaXMudmlkZW9lbGVtZW50LmdldEF0dHJpYnV0ZShcIndpZHRoXCIpKTtcblx0XHR9XG5cblx0XHQvLyBBcHBseSBzb21lIHN0eWxpbmdzXG5cdFx0aWYodGhpcy52aWRlb2VsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1hdXRvcmVzaXplXCIpID09PSAnZml0JyB8fCB0aGlzLnZpZGVvZWxlbWVudC5oYXNDbGFzcyhcInJlc3BvbnNpdmVcIikpe1xuXHRcdFx0dGhpcy52aWRlb2VsZW1lbnQuYWRkQ2xhc3MoXCJ2anMtcmVzcG9uc2l2ZVwiKTtcblx0XHRcdGlmKHRoaXMudmlkZW9lbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtcmF0aW9cIikpe1xuXHRcdFx0XHR2YXIgcmF0aW8gPSB0aGlzLnZpZGVvZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXJhdGlvXCIpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZighdGhpcy52aWRlb2VsZW1lbnQuZ2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIpIHx8ICF0aGlzLnZpZGVvZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiKSlcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcIlBsZWFzZSBwcm92aWRlIHdpdGRoIGFuZCBoZWlnaHQgZm9yIHlvdXIgdmlkZW8gZWxlbWVudC5cIilcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHZhciByYXRpbyA9IHRoaXMudmlkZW9lbGVtZW50LmdldEF0dHJpYnV0ZShcImhlaWdodFwiKSAvIHRoaXMudmlkZW9lbGVtZW50LmdldEF0dHJpYnV0ZShcIndpZHRoXCIpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy52aWRlb2VsZW1lbnQuc3R5bGUucGFkZGluZ1RvcCA9IChyYXRpbyAqIDEwMCkrXCIlXCI7XG5cdFx0XHR0aGlzLnZpZGVvZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJoZWlnaHRcIik7XG5cdFx0XHR0aGlzLnZpZGVvZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJ3aWR0aFwiKTtcblx0XHRcdHRoaXMudmlkZW9lbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtcmF0aW9cIixyYXRpbyk7XG5cdFx0fVxuXG5cdFx0Ly8gQXBwbHkgeW91dHViZSBjbGFzc1xuXHRcdGxldCB1dGlsID0gbmV3IFV0aWwoKTtcblx0XHRpZih1dGlsLmlzWW91dHViZVBsYXllcih0aGlzLnZpZGVvZWxlbWVudCkpe1xuXHRcdFx0dGhpcy52aWRlb2VsZW1lbnQuYWRkQ2xhc3MoXCJ2anMteW91dHViZVwiKTtcblx0XHRcdFxuXHRcdFx0Ly8gQ2hlY2sgZm9yIG5hdGl2ZSBwbGF5YmFja1xuXHRcdFx0aWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndmlkZW8nKS5jb250cm9scyl7XG5cdFx0XHRcdHRoaXMudmlkZW9lbGVtZW50LmFkZENsYXNzKFwidmpzLXVzaW5nLW5hdGl2ZS1jb250cm9sc1wiKTtcblx0XHRcdH1cblx0XHRcdC8vIEFkZCBpT1MgY2xhc3MsIGp1c3QgaWYgaXMgaVBhZFxuXHRcdFx0aWYoL2lQYWR8aVBob25lfGlQb2QvLnRlc3QobmF2aWdhdG9yLnBsYXRmb3JtKSl7XG5cdFx0XHRcdHRoaXMudmlkZW9lbGVtZW50LmFkZENsYXNzKFwidmpzLWlPU1wiKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ2hlY2sgZm9yIElFOSAtIElFMTFcblx0XHRcdGlmKGllID49IDggJiYgaWUgPD0gMTEpeyAvLyBAc2VlIGFmdGVyZ2xvdy1saWIuanNcblx0XHRcdFx0dGhpcy52aWRlb2VsZW1lbnQuYWRkQ2xhc3MoXCJ2anMtdXNpbmctbmF0aXZlLWNvbnRyb2xzXCIpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENoZWNrIGZvciBJRTkgLSBJRTExXG5cdFx0aWYoaWUgPj0gOCAmJiBpZSA8PSAxMSl7IC8vIEBzZWUgYWZ0ZXJnbG93LWxpYi5qc1xuXHRcdFx0dGhpcy52aWRlb2VsZW1lbnQuYWRkQ2xhc3MoJ3Zqcy1JRScpO1xuXHRcdH1cblx0fVxuXG5cdGRlc3Ryb3koKXtcblx0XHRpZighdGhpcy52aWRlb2pzLnBhdXNlZCgpKXtcblx0XHRcdHRoaXMudmlkZW9qcy5wYXVzZSgpO1xuXHRcdH1cblx0XHRpZih0aGlzLnZpZGVvanMuaXNGdWxsc2NyZWVuKCkpe1xuXHRcdFx0dGhpcy52aWRlb2pzLmV4aXRGdWxsc2NyZWVuKCk7XG5cdFx0fVxuXHRcdHRoaXMudmlkZW9qcy5kaXNwb3NlKCk7XG5cdFx0dGhpcy5hbGl2ZSA9IGZhbHNlO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjsiLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIERPTUVsZW1lbnR7XG5cblx0Y29uc3RydWN0b3Iobm9kZSl7XG5cdFx0dGhpcy5ub2RlID0gbm9kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIGEgZ2l2ZW4gY2xhc3MgdG8gdGhlIERPTSBub2RlIGlmIHRoZSBub2RlIGRvZXNuJ3QgaGF2ZSBpdC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuXHQgKiBAcmV0dXJuIHtvYmplY3R9IHRoaXMgLSBmb3IgbWV0aG9kIGNoYWluaW5nXG5cdCAqL1xuXHRhZGRDbGFzcyhjbGFzc05hbWUpe1xuXHRcdGlmKHRoaXMubm9kZS5jbGFzc0xpc3QpIHtcblx0ICAgICAgICB0aGlzLm5vZGUuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuXHQgICAgfSBlbHNlIGlmICghdGhpcy5ub2RlLmhhc0NsYXNzKGNsYXNzTmFtZSkpIHtcblx0ICAgICAgICB2YXIgY2xhc3NlcyA9IHRoaXMubm9kZS5jbGFzc05hbWUuc3BsaXQoXCIgXCIpO1xuXHQgICAgICAgIGNsYXNzZXMucHVzaChjbGFzc05hbWUpO1xuXHQgICAgICAgIHRoaXMubm9kZS5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oXCIgXCIpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBhIGdpdmVuIGNsYXNzIGZyb20gdGhlIERPTSBub2RlIGlmIHRoZSBub2RlIGRvZXNuJ3QgaGF2ZSBpdC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuXHQgKiBAcmV0dXJuIHtvYmplY3R9IHRoaXMgLSBmb3IgbWV0aG9kIGNoYWluaW5nXG5cdCAqL1xuXHRyZW1vdmVDbGFzcyhjbGFzc05hbWUpe1xuXHQgICAgaWYgKHRoaXMubm9kZS5jbGFzc0xpc3QpIHtcblx0ICAgICAgICB0aGlzLm5vZGUuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YXIgY2xhc3NlcyA9IHRoaXMubm9kZS5jbGFzc05hbWUuc3BsaXQoXCIgXCIpO1xuXHQgICAgICAgIGNsYXNzZXMuc3BsaWNlKGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpLCAxKTtcblx0ICAgICAgICB0aGlzLm5vZGUuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKFwiIFwiKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgZGV0ZWN0IGlmIHRoZSBub2RlIGRvZXMgaGF2ZSB0aGUgZ2l2ZW4gY2xhc3NOYW1lXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gIGNsYXNzTmFtZVxuXHQgKiBAcmV0dXJuIHtCb29sZWFufSAgXG5cdCAqL1xuXHRoYXNDbGFzcyhjbGFzc05hbWUpe1xuXHRcdGlmICh0aGlzLm5vZGUuY2xhc3NMaXN0KSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcmV0dXJuICgtMSA8IHRoaXMubm9kZS5jbGFzc05hbWUuaW5kZXhPZihjbGFzc05hbWUpKTtcblx0ICAgIH1cblx0fVxuXG5cdC8qKlxuXHQgKiBJRTggY29tcGxpYW50IHdheSBvZiBoYW5kbGluZyBldmVudCBiaW5kaW5ncyB3aXRoIHRoZSBwb3NzaWJpbGl0eSB0byByZW1vdmUgdGhlbSBsYXRlcm9uLCB3aXRoIHN1cHBvcnQgZm9yIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgVGhlIGV2ZW50cyB0byByZWFjdCB0b1xuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIFRoZSBmdW5jdGlvbiB0byBleGVjdXRlXG5cdCAqIEByZXR1cm4ge29iamVjdH0gdGhpcyAtIGZvciBtZXRob2QgY2hhaW5pbmdcblx0ICovXG5cdGJpbmQoZXZlbnRUeXBlLGhhbmRsZXIpIHtcblx0ICAgIHZhciBldnRzID0gZXZlbnRUeXBlLnNwbGl0KCcgJyk7XG5cdCAgICBmb3IgKHZhciBpPTAsIGlMZW49ZXZ0cy5sZW5ndGg7IGk8aUxlbjsgaSsrKSB7XG5cdCAgICBcdGlmICh0aGlzLm5vZGUuYWRkRXZlbnRMaXN0ZW5lcilcblx0ICAgIFx0XHR0aGlzLm5vZGUuYWRkRXZlbnRMaXN0ZW5lciAoZXZ0c1tpXSxoYW5kbGVyLGZhbHNlKTtcblx0ICAgIFx0ZWxzZSBpZiAodGhpcy5ub2RlLmF0dGFjaEV2ZW50KVxuXHQgICAgXHRcdHRoaXMubm9kZS5hdHRhY2hFdmVudCAoJ29uJytldnRzW2ldLGhhbmRsZXIpO1xuXHQgICAgfSBcblx0ICAgIHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIElFOCBjb21wbGlhbnQgd2F5IG9mIGhhbmRsaW5nIHJlbW92aW5nIGV2ZW50IGJpbmRpbmdzIHdoaWNoIHdlcmUgYWRkZWQgYmVmb3JlXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgVGhlIGV2ZW50cyB0byByZWFjdCB0b1xuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIFRoZSBmdW5jdGlvbiB0byBkZXRhY2hcblx0ICogQHJldHVybiB7b2JqZWN0fSB0aGlzIC0gZm9yIG1ldGhvZCBjaGFpbmluZ1xuXHQgKi9cblx0dW5iaW5kKGV2ZW50VHlwZSxoYW5kbGVyKSB7XG5cdCAgICB2YXIgZXZ0cyA9IGV2ZW50VHlwZS5zcGxpdCgnICcpO1xuXHQgICAgZm9yICh2YXIgaT0wLCBpTGVuPWV2dHMubGVuZ3RoOyBpPGlMZW47IGkrKykge1xuXHQgICAgXHRpZiAodGhpcy5ub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIpIFxuXHQgICAgXHRcdHRoaXMubm9kZS5yZW1vdmVFdmVudExpc3RlbmVyIChldnRzW2ldLGhhbmRsZXIsZmFsc2UpO1xuXHQgICAgXHRpZiAodGhpcy5ub2RlLmRldGFjaEV2ZW50KVxuXHQgICAgXHRcdHRoaXMubm9kZS5kZXRhY2hFdmVudCAoJ29uJytldnRzW2ldLGhhbmRsZXIpOyBcblx0ICAgIH1cblx0ICAgIHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqIFBST1hZIE1FVEhPRFMgKi9cblxuXHRnZXRBdHRyaWJ1dGUoaW5wdXQpe1xuXHRcdHJldHVybiB0aGlzLm5vZGUuZ2V0QXR0cmlidXRlKGlucHV0KTtcblx0fVxuXHRzZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSl7XG5cdFx0cmV0dXJuIHRoaXMubm9kZS5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG5cdH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBET01FbGVtZW50OyIsIi8qKlxuICogYWZ0ZXJnbG93IC0gQW4gZWFzeSB0byBpbnRlZ3JhdGUgSFRNTDUgdmlkZW8gcGxheWVyIHdpdGggbGlnaHRib3ggc3VwcG9ydC5cbiAqIEBsaW5rIGh0dHA6Ly9hZnRlcmdsb3dwbGF5ZXIuY29tXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBVdGlsIHtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3ZXRoZXIgb3Igbm90IHRoZSBnaXZlbiB2aWRlbyBlbGVtZW50IHNob3VsZCBiZSBjb252ZXJ0ZWQgaW50byBhIHZpZGVvIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gIHtub2RlfSAgdmlkZW9lbGVtZW50XG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cblx0aXNZb3V0dWJlUGxheWVyKHZpZGVvZWxlbWVudCl7XG5cdFx0cmV0dXJuIHZpZGVvZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXlvdXR1YmUtaWRcIik7XG5cdH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSB5b3V0dWJlIHZpZGVvIHRodW1ibmFpbFxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gaWQgIFRoZSB2aWRlb3MgeW91dHViZSBpZFxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIHVybCB0byB0aGUgdGh1bWJuYWlsXG4gICAgICovXG4gICAgbG9hZFlvdXR1YmVUaHVtYm5haWxVcmwoaWQpe1xuICAgICAgICB2YXIgdXJpID0gJ2h0dHBzOi8vaW1nLnlvdXR1YmUuY29tL3ZpLycgKyBpZCArICcvbWF4cmVzZGVmYXVsdC5qcGcnO1xuICAgICAgICByZXR1cm4gdXJpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHNvbWUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGN1cnJlbnRseSB1c2VkIElFXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxuICAgICAqL1xuXHRpZSgpe1xuXHRcdHZhciByZXQsIFxuXHRcdFx0aXNUaGVCcm93c2VyLFxuXHQgICAgICAgIGFjdHVhbFZlcnNpb24sXG5cdCAgICAgICAganNjcmlwdE1hcCwgXG5cdCAgICAgICAganNjcmlwdFZlcnNpb247XG5cblx0ICAgIGlzVGhlQnJvd3NlciA9IGZhbHNlO1xuXG5cdCAgICBqc2NyaXB0TWFwID0ge1xuXHQgICAgICAgIFwiNS41XCI6IFwiNS41XCIsXG5cdCAgICAgICAgXCI1LjZcIjogXCI2XCIsXG5cdCAgICAgICAgXCI1LjdcIjogXCI3XCIsXG5cdCAgICAgICAgXCI1LjhcIjogXCI4XCIsXG5cdCAgICAgICAgXCI5XCI6IFwiOVwiLFxuXHQgICAgICAgIFwiMTBcIjogXCIxMFwiXG5cdCAgICB9O1xuXHQgICAganNjcmlwdFZlcnNpb24gPSBuZXcgRnVuY3Rpb24oXCIvKkBjY19vbiByZXR1cm4gQF9qc2NyaXB0X3ZlcnNpb247IEAqL1wiKSgpO1xuXG5cdCAgICBpZiAoanNjcmlwdFZlcnNpb24gIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgIGlzVGhlQnJvd3NlciA9IHRydWU7XG5cdCAgICAgICAgYWN0dWFsVmVyc2lvbiA9IGpzY3JpcHRNYXBbanNjcmlwdFZlcnNpb25dO1xuXHQgICAgfVxuXG5cdCAgICByZXQgPSB7XG5cdCAgICAgICAgaXNUaGVCcm93c2VyOiBpc1RoZUJyb3dzZXIsXG5cdCAgICAgICAgYWN0dWFsVmVyc2lvbjogYWN0dWFsVmVyc2lvblxuXHQgICAgfTtcblxuXHQgICAgaWYoIWlzVGhlQnJvd3Nlcil7XG5cdCAgICAgICAgaWYod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIlRyaWRlbnQvNy4wXCIpID4gMCAmJiAhL3g2NHx4MzIvaWcudGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCkpeyAgICAgICBcblx0ICAgICAgICAgICAgcmV0ID0ge1xuXHQgICAgICAgICAgICAgICAgaXNUaGVCcm93c2VyOiB0cnVlLFxuXHQgICAgICAgICAgICAgICAgYWN0dWFsVmVyc2lvbjogXCIxMVwiXG5cdCAgICAgICAgICAgIH07XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXHQgICAgcmV0dXJuIHJldDtcblx0fVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdldGhlciBvciBub3QgdGhlIGN1cnJlbnRseSB1c2VkIGRldmljZSBpcyBhIG1vYmlsZSBvbmVcbiAgICAgKi9cbiAgICBpc01vYmlsZSgpe1xuICAgICAgICB2YXIgQW5kcm9pZCA9ICgpID0+IHsgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQvaSk7IH07XG4gICAgICAgIHZhciBCbGFja0JlcnJ5ID0gKCkgPT4geyByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQmxhY2tCZXJyeS9pKTsgfTtcbiAgICAgICAgdmFyIGlPUyA9ICgpID0+IHsgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZXxpUGFkfGlQb2QvaSk7IH07XG4gICAgICAgIHZhciBPcGVyYSA9ICgpID0+IHsgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL09wZXJhIE1pbmkvaSk7IH07XG4gICAgICAgIHZhciBXaW5kb3dzID0gKCkgPT4geyByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvSUVNb2JpbGUvaSk7IH07XG5cbiAgICAgICAgcmV0dXJuIChBbmRyb2lkKCkgfHwgQmxhY2tCZXJyeSgpIHx8IGlPUygpIHx8IE9wZXJhKCkgfHwgV2luZG93cygpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPdmVyd3JpdGVzIG9iajEncyB2YWx1ZXMgd2l0aCBvYmoyJ3MgYW5kIGFkZHMgb2JqMidzIGlmIG5vbiBleGlzdGVudCBpbiBvYmoxXG4gICAgICogQHBhcmFtIG9iajFcbiAgICAgKiBAcGFyYW0gb2JqMlxuICAgICAqIEByZXR1cm5zIG9iajMgYSBuZXcgb2JqZWN0IGJhc2VkIG9uIG9iajEgYW5kIG9iajJcbiAgICAgKi9cbiAgICBtZXJnZV9vYmplY3RzKG9iajEsb2JqMil7XG4gICAgICAgIHZhciBvYmozID0ge307XG4gICAgICAgIGZvciAodmFyIGF0dHJuYW1lIGluIG9iajEpIHsgb2JqM1thdHRybmFtZV0gPSBvYmoxW2F0dHJuYW1lXTsgfVxuICAgICAgICBmb3IgKHZhciBhdHRybmFtZSBpbiBvYmoyKSB7IG9iajNbYXR0cm5hbWVdID0gb2JqMlthdHRybmFtZV07IH1cbiAgICAgICAgcmV0dXJuIG9iajM7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFV0aWw7IiwiLyoqXG4gKiBhZnRlcmdsb3cgLSBBbiBlYXN5IHRvIGludGVncmF0ZSBIVE1MNSB2aWRlbyBwbGF5ZXIgd2l0aCBsaWdodGJveCBzdXBwb3J0LlxuICogQGxpbmsgaHR0cDovL2FmdGVyZ2xvd3BsYXllci5jb21cbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbmltcG9ydCBBZnRlcmdsb3cgZnJvbSAnLi9hZnRlcmdsb3cvQWZ0ZXJnbG93JztcblxuLy8gSW5pdGlhdGUgYWZ0ZXJnbG93IHdoZW4gdGhlIERPTSBpcyByZWFkeS4gVGhpcyBpcyBub3QgSUU4IGNvbXBhdGlibGUhXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbigpIHsgXG5cdHdpbmRvdy5hZnRlcmdsb3cgPSBuZXcgQWZ0ZXJnbG93KCk7XG5cdGFmdGVyZ2xvdy5pbml0KCk7XG59KTsiLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICBmdW5jdGlvbiBvbigpIHtcbiAgICB0aGlzLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iXX0=
