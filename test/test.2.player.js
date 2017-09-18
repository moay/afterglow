import Player from '../src/js/afterglow/components/Player';
import Config from '../src/js/afterglow/components/Config';
import Util from '../src/js/afterglow/lib/Util';
import Eventbus from '../src/js/afterglow/components/Eventbus';

var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var jsdom = require('mocha-jsdom');

chai.use(sinonChai);
chai.should();

var assert = chai.assert;
var expect = chai.expect;

describe("Afterglow Player", () => {	
	// Initiate the DOM
	jsdom();

	var player,
		$;

	beforeEach(() => {
		$ = require('jquery');

	});

	describe('constructor', () => {
		beforeEach(() => {
			sinon.stub(Player.prototype, 'setup');
		});

		afterEach(() => {
			Player.prototype.setup.restore();
		});

		it('should init the player setup', () => {
			expect(Player.prototype.setup).to.not.have.been.called;
			player = new Player;
			expect(Player.prototype.setup).to.have.been.calledOnce;
		});

		it('should pass the videoelement properly', () => {
			player = new Player('test');
			expect(Player.prototype.setup).to.have.been.calledWith('test');
		});
	});

	describe('setup', () => {
		var videoelement;

		beforeEach(() => {
			sinon.stub(Player.prototype, 'prepareVideoElement');
			sinon.stub(Config.prototype, 'init');
			sinon.stub(Player.prototype, 'getSkinName');

			videoelement = {
				getAttribute : () => {return 'someid'},
				hasAttribute : () => {return false}
			};

			player = new Player(videoelement);
		});

		afterEach(() => {
			Player.prototype.prepareVideoElement.restore();
			Player.prototype.getSkinName.restore();
			Config.prototype.init.restore();
		});

		it('should store the videoelement and extract the id', () => {
			player.videoelement.should.equal(videoelement);
			player.id.should.equal('someid');
		});

		it('should integrate a configuration and pass the videoelement properly', () => {
			player.config.should.be.an('object');
			expect(Config.prototype.init).to.have.been.calledOnce;
			expect(Config.prototype.init).to.have.been.calledWith(videoelement,'afterglow');
		});

		it('should pass the skin name properly', () => {
			Player.prototype.getSkinName.restore();
			sinon.stub(Player.prototype, 'getSkinName', () => { return 'testskinname' });
			player = new Player(videoelement);
			expect(Config.prototype.init).to.have.been.calledWith(videoelement,'testskinname');
		});

		it('should create a new Util and store it', () => {
			player.util.should.be.an('object');
		});

		it('should call prepareVideoElement() once', () => {
			expect(Player.prototype.prepareVideoElement).to.have.been.calledOnce;
		});

		it('should prepare the players status', () => {
			player.alive.should.equal(true);
		});
	});

	describe('init() only outside of video.js', () => {

		beforeEach(() => {
			window.videojs = () => {
				return {ready : (input) => {}, this: { id: () => {}} };
			};
			sinon.stub(Player.prototype, 'setup');
			sinon.stub(Eventbus.prototype, 'dispatch');
			player = new Player();
			player.videoelement = {
				node : 'testnode'
			}
			player.config = {
				options : 'testoptions'
			}
			window.afterglow = {};
			window.afterglow.eventbus = new Eventbus();
		});

		afterEach(() => {
			Player.prototype.setup.restore();
			Eventbus.prototype.dispatch.restore();
		});

		it('should pass the videoelement and the options to videojs properly', () => {
			sinon.stub(window, 'videojs',() => {
				return {ready : (input) => {}};
			});
			player.init();
			expect(window.videojs).to.have.been.calledOnce;
			expect(window.videojs).to.have.been.calledWith('testnode','testoptions');
			window.videojs.restore();
		});

		it('should properly store videojs in its own videojs attribute', () => {
			sinon.stub(window, 'videojs',() => {
				return {ready : (input) => { return 'test' }};
			});
			player.init();
			expect(player.videojs).to.equal('test');
			window.videojs.restore();
		});
	});

	describe('init() only inside of video.js ready()', () => {
		var videojsBaseObject;
		var callback;

		beforeEach(() => {
			videojsBaseObject = {
				hotkeys : () => {}
			}
			callback = 'test';
			window.videojs = function(videoelement, options) {
				return { 
					ready : (action) => {
						this.hotkeys = (input) => {
							videoelement.hotkeysInput = input;
						};
						this.addChild = (input) => {
							videoelement.addChildInput = input;
						};
						this.volume = (input) => {
							videoelement.volumeInput = input;
						};
						this.setCallbackReturnValue = (input) => {
							videoelement.callbackReturnValue = input;
						}
						this.on = (triggeredOnEvent, onAction) => {
							videoelement.triggeredOnEvent = triggeredOnEvent;
							onAction();
						}
						this.el_ = {
							classList: {
								contains: () => {}
							}
						}
						this.id = () => {
							return 'testid';
						}
						this.isFullscreen = () => {
							return false;
						}
						this.action = action;
						this.action();
					},

				};
			};
			window.videojs.players = {
				video1 : {
					id_ : 'video1',
					paused:false,
					pause: () => {
						window.videojs.players['video1'].paused = true;
					}
				},
				video2 : {
					id_ : 'video2',
					paused:false,
					pause: () => {
						window.videojs.players['video2'].paused = true;
					}
				}
			};
			window.videojs.getPlayers = function(){
				return window.videojs.players;
			}
			sinon.stub(Player.prototype, 'setup');
			player = new Player();
			player.videoelement = {
				node:{
					getAttribute : () => { return null }
				}			}
			player.config = {}
		});

		afterEach(() => {
			Player.prototype.setup.restore();
		});

		it('should add hotkey options properly', () => {
			player.init();
			expect(player.videoelement.node.hotkeysInput).to.be.an('object');
			expect(player.videoelement.node.hotkeysInput).to.have.keys("enableFullscreen","enableNumbers","enableVolumeScroll");
			expect(player.videoelement.node.hotkeysInput.enableVolumeScroll).to.be.a('boolean');
		});

		it('should add the TopControlBar properly', () => {
			player.init();
			expect(player.videoelement.node.addChildInput).to.be.a('string');
			expect(player.videoelement.node.addChildInput).to.equal('TopControlBar');
		});

		it('should not call the callback if it is not a function', () => {
			player.init(callback);
			expect(player.videoelement.node.callbackReturnValue).to.be.undefined;
		});

		it('should call the callback if it is a function', () => {
			callback = (inputobject) => {
				inputobject.setCallbackReturnValue('test');
			};
			player.init(callback);
			expect(player.videoelement.node.callbackReturnValue).to.equal('test');
		});

		it('should set the volume properly if needed', () => {
			player.videoelement = {
				node:{
					getAttribute : () => { return '0.5' }
				}
			}
			player.init();
			expect(player.videoelement.node.volumeInput).to.be.float;
			expect(player.videoelement.node.volumeInput).to.equal(0.5);
		});

		it('should not set the volume if not needed', () => {
			player.init();
			expect(player.videoelement.node.volumeInput).to.be.undefined;
		});

		it('should stop all other videos when playing', () => {
			expect(window.videojs.players['video1'].paused).to.be.false;
			expect(window.videojs.players['video2'].paused).to.be.false;
			player.init();
			expect(player.videoelement.node.triggeredOnEvent).to.equal('autoplay');
			expect(window.videojs.players['video1'].paused).to.be.true;
			expect(window.videojs.players['video2'].paused).to.be.true;
		});
	});

	describe('prepareVideoElement regular', () => {
		var videoelement;

		beforeEach(() => {
			sinon.stub(Player.prototype, 'setup');
			sinon.stub(Player.prototype, 'applyDefaultClasses');
			sinon.stub(Player.prototype, 'applyParameters');
			sinon.stub(Player.prototype, 'applyYoutubeClasses');
			sinon.stub(Util.prototype, 'isYoutubePlayer', () => { return false });
			sinon.stub(Player.prototype, 'applyVimeoClasses');
			sinon.stub(Util.prototype, 'isVimeoPlayer', () => { return false });
			player = new Player();
			player.util = new Util;
		});

		afterEach(() => {
			Player.prototype.setup.restore();
			Player.prototype.applyDefaultClasses.restore();
			Player.prototype.applyParameters.restore();
			Player.prototype.applyYoutubeClasses.restore();
			Util.prototype.isYoutubePlayer.restore();
			Player.prototype.applyVimeoClasses.restore();
			Util.prototype.isVimeoPlayer.restore();
		});

		it('should call applyDefaultClasses() once', () => {
			player.prepareVideoElement();
			expect(Player.prototype.applyDefaultClasses).to.have.been.calledOnce;
		});

		it('should call applyParameters() once', () => {
			player.prepareVideoElement();
			expect(Player.prototype.applyParameters).to.have.been.calledOnce;
		});

		it('should not call applyYoutubeClasses() without a youtube player', () => {
			player.prepareVideoElement();
			expect(Player.prototype.applyYoutubeClasses).to.not.have.been.called;
		});
	});

	describe('prepareVideoElement youtube', () => {
		var videoelement;

		beforeEach(() => {
			sinon.stub(Player.prototype, 'setup');
			sinon.stub(Player.prototype, 'applyDefaultClasses');
			sinon.stub(Player.prototype, 'applyParameters');
			sinon.stub(Player.prototype, 'applyYoutubeClasses');
			sinon.stub(Util.prototype, 'isYoutubePlayer', () => { return true });
			sinon.stub(Player.prototype, 'applyVimeoClasses');
			sinon.stub(Util.prototype, 'isVimeoPlayer', () => { return false });
			player = new Player();
			player.util = new Util;
		});

		afterEach(() => {
			Player.prototype.setup.restore();
			Player.prototype.applyDefaultClasses.restore();
			Player.prototype.applyParameters.restore();
			Player.prototype.applyYoutubeClasses.restore();
			Util.prototype.isYoutubePlayer.restore();
			Player.prototype.applyVimeoClasses.restore();
			Util.prototype.isVimeoPlayer.restore();
		});

		it('should call applyYoutubeClasses() once', () => {
			player.prepareVideoElement();
			expect(Player.prototype.applyYoutubeClasses).to.have.been.calledOnce;
		});

		it('should not call applyVimeoClasses() once', () => {
			player.prepareVideoElement();
			expect(Player.prototype.applyVimeoClasses).to.not.have.been.called;
		});
	});

	describe('prepareVideoElement vimeo', () => {
		var videoelement;

		beforeEach(() => {
			sinon.stub(Player.prototype, 'setup');
			sinon.stub(Player.prototype, 'applyDefaultClasses');
			sinon.stub(Player.prototype, 'applyParameters');
			sinon.stub(Player.prototype, 'applyYoutubeClasses');
			sinon.stub(Util.prototype, 'isYoutubePlayer', () => { return false });
			sinon.stub(Player.prototype, 'applyVimeoClasses');
			sinon.stub(Util.prototype, 'isVimeoPlayer', () => { return true });
			player = new Player();
			player.util = new Util;
		});

		afterEach(() => {
			Player.prototype.setup.restore();
			Player.prototype.applyDefaultClasses.restore();
			Player.prototype.applyParameters.restore();
			Player.prototype.applyYoutubeClasses.restore();
			Util.prototype.isYoutubePlayer.restore();
			Player.prototype.applyVimeoClasses.restore();
			Util.prototype.isVimeoPlayer.restore();
		});

		it('should call applyVimeoClasses() once', () => {
			player.prepareVideoElement();
			expect(Player.prototype.applyVimeoClasses).to.have.been.calledOnce;
		});
	});

	describe('applyDefaultClasses noIE', () => {
		var videoelement;

		beforeEach(() => {
			sinon.stub(Player.prototype, 'setup');
			sinon.stub(Util.prototype, 'ie', () => { return {isTheBrowser:0,actualVersion:0} });
			sinon.stub(Config.prototype, 'getSkinClass', () => { return 'testclass' });
			sinon.stub(Config.prototype, 'init');
			player = new Player();
			player.util = new Util;
			player.config = new Config;

			player.videoelement = {
				addClass : () => {},
				removeClass : () => {}
			};

			sinon.spy(player.videoelement, 'addClass');
			sinon.spy(player.videoelement, 'removeClass');
		});

		afterEach(() => {
			Player.prototype.setup.restore();
			Util.prototype.ie.restore();
			Config.prototype.getSkinClass.restore();
			Config.prototype.init.restore();

			player.videoelement.addClass;
			player.videoelement.removeClass;
		});

		it('should add the base classes', () => {
			player.applyDefaultClasses();
			expect(player.videoelement.addClass).to.have.been.calledThrice;
			expect(player.videoelement.addClass).to.have.been.calledWith('video-js');
			expect(player.videoelement.addClass).to.have.been.calledWith('afterglow');
			expect(player.videoelement.addClass).to.have.been.calledWith('testclass');
		});

		it('should remove sublime class', () => {
			player.applyDefaultClasses();
			expect(player.videoelement.removeClass).to.have.been.calledOnce;
			expect(player.videoelement.removeClass).to.have.been.calledWith('sublime');
		});

		it('should use util to check for IE version', () => {
			player.applyDefaultClasses();
			expect(Util.prototype.ie).to.have.been.calledOnce;
		});
	});

	describe('applyDefaultClasses IE', () => {
		var videoelement;

		beforeEach(() => {
			sinon.stub(Player.prototype, 'setup');
			sinon.stub(Util.prototype, 'ie', () => { return {isTheBrowser:0,actualVersion:10} });
			sinon.stub(Config.prototype, 'getSkinClass', () => { return 'testclass' });
			sinon.stub(Config.prototype, 'init');
			player = new Player();
			player.util = new Util;
			player.config = new Config;

			player.videoelement = {
				addClass : () => {},
				removeClass : () => {}
			};

			sinon.spy(player.videoelement, 'addClass');
			sinon.spy(player.videoelement, 'removeClass');
		});

		afterEach(() => {
			Player.prototype.setup.restore();
			Util.prototype.ie.restore();
			Config.prototype.getSkinClass.restore();
			Config.prototype.init.restore();

			player.videoelement.addClass;
			player.videoelement.removeClass;
		});

		it('should add the base classes', () => {
			player.applyDefaultClasses();
			expect(player.videoelement.addClass).callCount(4);
			expect(player.videoelement.addClass).to.have.been.calledWith('vjs-IE');
		});
	});

	describe('applyParameters()', () => {
		var videoelement;

		beforeEach(() => {
			sinon.stub(Player.prototype, 'setup');
			sinon.stub(Player.prototype, 'calculateRatio', () => { return 0.5; });
			player = new Player();

			player.videoelement = {
				addClass : () => {},
				removeClass : () => {},
				hasClass : () => { return false },
				getAttribute : () => { return false },
				removeAttribute : () => {},
				setAttribute : () => {},
				node : {
					style: {}
				}
			};

			sinon.spy(player.videoelement, 'addClass');
			sinon.spy(player.videoelement, 'removeClass');
			sinon.spy(player.videoelement, 'hasClass');
			sinon.spy(player.videoelement, 'getAttribute');
			sinon.spy(player.videoelement, 'removeAttribute');
			sinon.spy(player.videoelement, 'setAttribute');
		});

		afterEach(() => {
			Player.prototype.setup.restore();
			Player.prototype.calculateRatio.restore();

			player.videoelement.addClass;
			player.videoelement.removeClass;
			player.videoelement.hasClass;
			player.videoelement.getAttribute;
			player.videoelement.removeAttribute;
			player.videoelement.setAttribute;
		});

		it('should set data-maxwidth if data-overscale is set', () => {
			player.videoelement.getAttribute.restore();
			sinon.stub(player.videoelement, 'getAttribute', () => { return "false" });
			player.applyParameters();
			expect(player.videoelement.setAttribute).to.have.been.calledOnce;
			expect(player.videoelement.setAttribute).to.have.been.calledWith('data-maxwidth', 'false');
		});

		it('should not set data-maxwidth if data-overscale is not set or not false', () => {
			player.videoelement.getAttribute.restore();
			player.applyParameters();
			expect(player.videoelement.setAttribute).to.have.been.calledOnce;
			expect(player.videoelement.setAttribute).to.have.been.calledWith("data-ratio");
		});

		it('should trigger responsivity stuff if hasn\'t data-autoresize none or false', () => {
			player.videoelement.getAttribute.restore();
			player.applyParameters();
			expect(player.videoelement.addClass).to.have.been.calledWith("vjs-responsive");
		});

		it('should not trigger responsivity stuff if has data-autoresize none', () => {
			player.videoelement.hasClass.restore();
			player.videoelement.getAttribute.restore();
			sinon.stub(player.videoelement, 'getAttribute', () => { return "none" });
			player.applyParameters();
			expect(player.videoelement.addClass).to.not.have.been.called;
		});

		it('should get the ratio correctly and pass it to the correct places', () => {
			player.videoelement.getAttribute.restore();
			sinon.stub(player.videoelement, 'getAttribute', () => { return "fit" });
			player.applyParameters();
			expect(player.calculateRatio).to.have.been.calledOnce;
			player.videoelement.node.style.paddingTop.should.equal("50%");
			expect(player.videoelement.setAttribute).to.have.been.calledOnce;
			expect(player.videoelement.setAttribute).to.have.been.calledWith("data-ratio",0.5);
		});

		it('should remove width and height properly when responsive', () => {
			player.videoelement.getAttribute.restore();
			sinon.stub(player.videoelement, 'getAttribute', () => { return "fit" });
			player.applyParameters();
			expect(player.videoelement.removeAttribute).to.have.been.calledTwice;
			expect(player.videoelement.removeAttribute).to.have.been.calledWith('height');
			expect(player.videoelement.removeAttribute).to.have.been.calledWith('width');
		});
	});

	describe('applyYoutubeClasses()', () => {
		var videoelement;

		beforeEach(() => {
			sinon.stub(Player.prototype, 'setup');
			sinon.stub(Util.prototype, 'ie', () => {
				return {
					actualVersion : 0
				}
			});
			sinon.stub(document, 'querySelector', () => {
				return {
					controls: false
				}
			});
			
			player = new Player();
			player.util = new Util;

			player.videoelement = {
				addClass : () => {}
			};

			// Prevent iIOS Tests by default
			navigator.__defineGetter__('platform', function(){
			    return 'none' // customized user agent
			});

			sinon.spy(player.videoelement, 'addClass');
		});

		afterEach(() => {
			Player.prototype.setup.restore();
			Util.prototype.ie.restore();
			document.querySelector.restore();

			player.videoelement.addClass;
		});

		it('should add the youtube class properly', () => {
			player.applyYoutubeClasses();
			expect(player.videoelement.addClass).to.have.been.calledTwice;
			expect(player.videoelement.addClass).to.have.been.calledWith('vjs-youtube');
			expect(player.videoelement.addClass).to.have.been.calledWith('vjs-youtube-headstart');
		});

		it('should add the native controls class if needed', () => {
			document.querySelector.restore();
			sinon.stub(document, 'querySelector', () => {
				return {
					controls: true
				}
			});
			player.applyYoutubeClasses();
			expect(player.videoelement.addClass).to.have.been.calledThrice;
			expect(player.videoelement.addClass).to.have.been.calledWith('vjs-using-native-controls');
		});

		it('should add class vjs-iOS for iPad devices', function(){
			navigator.__defineGetter__('platform', function(){
			    return 'somthing120e7 19827e1982iPada8d7a928z8dhn' // customized user agent
			});
			player.applyYoutubeClasses();
			expect(player.videoelement.addClass).to.have.been.calledThrice;
			expect(player.videoelement.addClass).to.have.been.calledWith('vjs-iOS');
		});

		it('should add class vjs-iOS for iPod devices', function(){
			navigator.__defineGetter__('platform', function(){
			    return 'somthing120e7 19827e1982iPoda8d7a928z8dhn' // customized user agent
			});
			player.applyYoutubeClasses();
			expect(player.videoelement.addClass).to.have.been.calledThrice;
			expect(player.videoelement.addClass).to.have.been.calledWith('vjs-iOS');
		});

		it('should add class vjs-iOS for iPhone devices', function(){
			navigator.__defineGetter__('platform', function(){
			    return 'somthing120e9827e1982iPhonea8d7a928z8dhn' // customized user agent
			});
			player.applyYoutubeClasses();
			expect(player.videoelement.addClass).to.have.been.calledThrice;
			expect(player.videoelement.addClass).to.have.been.calledWith('vjs-iOS');
		});

		it('should not add class vjs-using-native-controls if not ie and not controls', () => {
			player.applyYoutubeClasses();
			expect(player.videoelement.addClass).to.not.have.been.calledWith('vjs-using-native-controls');
		});

		it('should add the native controls class if ie 8', () => {
			Util.prototype.ie.restore();
			sinon.stub(Util.prototype, 'ie', () => {
				return {
					actualVersion : 8
				}
			});
			player.applyYoutubeClasses();
			expect(player.videoelement.addClass).to.have.been.calledThrice;
			expect(player.videoelement.addClass).to.have.been.calledWith('vjs-using-native-controls');
		});

		it('should add the native controls class if ie 9', () => {
			Util.prototype.ie.restore();
			sinon.stub(Util.prototype, 'ie', () => {
				return {
					actualVersion : 9
				}
			});
			player.applyYoutubeClasses();
			expect(player.videoelement.addClass).to.have.been.calledThrice;
			expect(player.videoelement.addClass).to.have.been.calledWith('vjs-using-native-controls');
		});

		it('should add the native controls class if ie 10', () => {
			Util.prototype.ie.restore();
			sinon.stub(Util.prototype, 'ie', () => {
				return {
					actualVersion : 10
				}
			});
			player.applyYoutubeClasses();
			expect(player.videoelement.addClass).to.have.been.calledThrice;
			expect(player.videoelement.addClass).to.have.been.calledWith('vjs-using-native-controls');
		});

		it('should add the native controls class if ie 11', () => {
			Util.prototype.ie.restore();
			sinon.stub(Util.prototype, 'ie', () => {
				return {
					actualVersion : 11
				}
			});
			player.applyYoutubeClasses();
			expect(player.videoelement.addClass).to.have.been.calledThrice;
			expect(player.videoelement.addClass).to.have.been.calledWith('vjs-using-native-controls');
		});

		it('should not add the native controls class if ie 12', () => {
			Util.prototype.ie.restore();
			sinon.stub(Util.prototype, 'ie', () => {
				return {
					actualVersion : 12
				}
			});
			player.applyYoutubeClasses();
			expect(player.videoelement.addClass).to.not.have.been.calledWith('vjs-using-native-controls');
		});
	});

	describe('applyVimeoClasses()', () => {
		var videoelement;

		beforeEach(() => {
			sinon.stub(Player.prototype, 'setup');
			
			player = new Player();
			player.util = new Util;

			player.videoelement = {
				addClass : () => {}
			};

			// Prevent iIOS Tests by default
			navigator.__defineGetter__('platform', function(){
			    return 'none' // customized user agent
			});

			sinon.spy(player.videoelement, 'addClass');
		});

		afterEach(() => {
			Player.prototype.setup.restore();

			player.videoelement.addClass;
		});

		it('should add the vimeo class properly', () => {
			player.applyVimeoClasses();
			expect(player.videoelement.addClass).to.have.been.calledOnce;
			expect(player.videoelement.addClass).to.have.been.calledWith('vjs-vimeo');
		});
	});

	describe('calculateRatio()', () => {
		var videoelement;

		beforeEach(() => {
			sinon.stub(Player.prototype, 'setup');
			player = new Player();

			player.videoelement = {
				getAttribute : (input) => { 
					return false;
				}
			};

			sinon.spy(player.videoelement, 'getAttribute');
		});

		afterEach(() => {
			Player.prototype.setup.restore();
			player.videoelement.getAttribute.restore();
		});

		it('should log an error and return 0 if calculation is not possible', () => {
			sinon.stub(window.console, 'error');

			let ratio = player.calculateRatio();

			expect(ratio).to.be.float;
			ratio.should.equal(0);
			expect(window.console.error).to.have.been.calledOnce;
			window.console.error.restore();
		});

		it('should return the correct ratio if it is already set', () => {
			player.videoelement.getAttribute.restore();
			sinon.stub(player.videoelement, 'getAttribute', () => { return 0.243 });
			let ratio = player.calculateRatio();
			expect(ratio).to.be.float;
			expect(ratio).to.equal(0.243);
			expect(player.videoelement.getAttribute).to.have.been.calledTwice;
			expect(player.videoelement.getAttribute).to.have.been.calledWith("data-ratio");
		});

		it('should return the correct ratio if widht and height are set', () => {
			player.videoelement.getAttribute.restore();
			sinon.stub(player.videoelement, 'getAttribute', (input) => { 
				switch(input){
					case "height":
						return 1;
					case "width":
						return 2;
					default:
						return null;
				}
			});
			let ratio = player.calculateRatio();
			expect(ratio).to.be.float;
			expect(ratio).to.equal(0.5);
			expect(player.videoelement.getAttribute).to.have.callCount(5);
			expect(player.videoelement.getAttribute).to.have.been.calledWith("data-ratio");
			expect(player.videoelement.getAttribute).to.have.been.calledWith("height");
			expect(player.videoelement.getAttribute).to.have.been.calledWith("width");
		});
	});

	describe('destroy()', () => {
		beforeEach(() => {
			sinon.stub(Player.prototype, 'setup');
			player = new Player;

			player.videojs = {
				paused : () => { return true },
				pause : () => { return false },
				isFullscreen : () => { return false },
				exitFullscreen : () => { return false },
				dispose : () => { return false },
			}
		});

		afterEach(() => {
			Player.prototype.setup.restore();
		});

		it('should set the alive status to false', () => {
			player.destroy();
			expect(player.alive).to.equal(false);
		});

		it('should dispose the player', () => {
			sinon.spy(player.videojs, 'dispose');
			player.destroy();
			expect(player.videojs.dispose).to.have.been.calledOnce;
			player.videojs.dispose.restore();
		});

		it('should not pause the player if it is already paused', () => {
			sinon.spy(player.videojs, 'pause');
			sinon.spy(player.videojs, 'paused');
			player.destroy();
			expect(player.videojs.pause).to.not.have.been.called;
			expect(player.videojs.paused).to.have.been.calledOnce;
			player.videojs.pause.restore();
			player.videojs.paused.restore();
		});

		it('should not exit fullscreen if the player isnt fullscreen', () => {
			sinon.spy(player.videojs, 'isFullscreen');
			sinon.spy(player.videojs, 'exitFullscreen');
			player.destroy();
			expect(player.videojs.exitFullscreen).to.not.have.been.called;
			expect(player.videojs.isFullscreen).to.have.been.calledOnce;
			player.videojs.exitFullscreen.restore();
			player.videojs.isFullscreen.restore();
		});

		it('should pause the player if it isnt already paused', () => {
			sinon.spy(player.videojs, 'pause');
			sinon.stub(player.videojs, 'paused', () => { return false });
			player.destroy();
			expect(player.videojs.pause).to.have.been.calledOnce;
			expect(player.videojs.paused).to.have.been.calledOnce;
			player.videojs.pause.restore();
			player.videojs.paused.restore();
		});

		it('should exit fullscreen if the player is fullscreen', () => {
			sinon.spy(player.videojs, 'exitFullscreen');
			sinon.stub(player.videojs, 'isFullscreen', () => { return true });
			player.destroy();
			expect(player.videojs.exitFullscreen).to.have.been.calledOnce;
			expect(player.videojs.isFullscreen).to.have.been.calledOnce;
			player.videojs.exitFullscreen.restore();
			player.videojs.isFullscreen.restore();
		});
	});

	describe('getSkinName', () => {
		var videoelement;

		beforeEach(() => {
			sinon.stub(Player.prototype, 'setup');
			player = new Player();
		});

		afterEach(() => {
			Player.prototype.setup.restore();
		});

		it('should return the data-skin parameter if it is set', () => {
			player.videoelement = {
				getAttribute : (input) => { 
					return 'somevalue';
				}
			};
			var res = player.getSkinName();
			expect(res).to.eql('somevalue');
		});

		it('should return afterglow if no skin is set', () => {
			player.videoelement = {
				getAttribute : (input) => { 
					return null;
				}
			};
			var res = player.getSkinName();
			expect(res).to.eql('afterglow');
		});
	});

	describe('getPlayer()', () => {
		beforeEach(() => {
			sinon.stub(Player.prototype, 'setup');
			player = new Player;
		});

		afterEach(() => {
			Player.prototype.setup.restore();
		});

		it('should return the player instance properly', () => {
			player.videojs = 'test';
			expect(player.getPlayer()).to.equal('test');
		});
	});
});