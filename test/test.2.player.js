import Player from '../src/js/afterglow/components/Player';
import Config from '../src/js/afterglow/components/Config';
import Util from '../src/js/afterglow/lib/Util';

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

			videoelement = {
				getAttribute : () => {return 'someid'},
				hasAttribute : () => {return false}
			};

			player = new Player(videoelement);
		});

		afterEach(() => {
			Player.prototype.prepareVideoElement.restore();
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

	describe('prepareVideoElement no youtube', () => {
		var videoelement;

		beforeEach(() => {
			sinon.stub(Player.prototype, 'setup');
			sinon.stub(Player.prototype, 'applyDefaultClasses');
			sinon.stub(Player.prototype, 'applyParameters');
			sinon.stub(Player.prototype, 'applyYoutubeClasses');
			sinon.stub(Util.prototype, 'isYoutubePlayer', () => { return false });
			player = new Player();
			player.util = new Util;
		});

		afterEach(() => {
			Player.prototype.setup.restore();
			Player.prototype.applyDefaultClasses.restore();
			Player.prototype.applyParameters.restore();
			Player.prototype.applyYoutubeClasses.restore();
			Util.prototype.isYoutubePlayer.restore();
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
			player = new Player();
			player.util = new Util;
		});

		afterEach(() => {
			Player.prototype.setup.restore();
			Player.prototype.applyDefaultClasses.restore();
			Player.prototype.applyParameters.restore();
			Player.prototype.applyYoutubeClasses.restore();
			Util.prototype.isYoutubePlayer.restore();
		});

		it('should call applyYoutubeClasses() once', () => {
			player.prepareVideoElement();
			expect(Player.prototype.applyYoutubeClasses).to.have.been.calledOnce;
		});
	});

	describe('applayDefaultClasses noIE', () => {
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

	describe('applayDefaultClasses IE', () => {
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