import Afterglow from '../src/js/afterglow/Afterglow';
import Player from '../src/js/afterglow/components/Player';
import Lightbox from '../src/js/afterglow/components/Lightbox';
import LightboxTrigger from '../src/js/afterglow/components/LightboxTrigger';
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

describe("Afterglow Core", () => {	
	// Initiate the DOM
	jsdom();

	var afterglow,
		$;

	before(() => {
		// Mocking the player methods that are called
		sinon.stub(Player.prototype, 'init', () => {} );
		sinon.stub(Player.prototype, 'setup', () => {} );

		sinon.stub(LightboxTrigger.prototype, 'init', () => {} );
	});

	beforeEach(() => {
		$ = require('jquery');

		afterglow = new Afterglow();
	});

	after(() => {
		// Restore stubbed methods
		Player.prototype.init.restore();
		Player.prototype.setup.restore();
		LightboxTrigger.prototype.init.restore();
	});

	describe("Bootup", () => {

		/**
		 * GENERAL INITIATION TESTS
		 */

		it('initiates the player container properly', () => {
			afterglow.players.should.be.an('array');
			afterglow.players.should.be.empty;
		});

		it('initiates the lightbox trigger container properly', () => {
			afterglow.lightboxtriggers.should.be.an('array');
			afterglow.lightboxtriggers.should.be.empty;
		});

		it('calls video.js configuration on init', () =>{
			sinon.spy(afterglow, "configureVideoJS");
			afterglow.init();
			assert(afterglow.configureVideoJS.calledOnce);
		});

		it('calls video initiation on init', () =>{
			sinon.spy(afterglow, "initVideoElements");
			afterglow.init();
			assert(afterglow.initVideoElements.calledOnce);
		});

		it('calls lightbox preparation on init', () =>{
			sinon.spy(afterglow, "prepareLightboxVideos");
			afterglow.init();
			assert(afterglow.prepareLightboxVideos.calledOnce);
		});

		it('configures video.js properly', () =>{
			afterglow.configureVideoJS();
			window.HELP_IMPROVE_VIDEOJS.should.be.false;
		});
	});

	describe("Video element initiation", () => {

		/** 
		 * VIDEO ELEMENT SETUP TESTS
		 */

		it('detects video elements properly, including SublimeVideo markup and creates players of them.', () =>{
			// Mock the DOM
			document.body.innerHTML = '<video class="afterglow"></video><video class="sublime"></video><a class="sublime"></a><a class="afterglow"></a>';

			// Run the tests
			let res = afterglow.initVideoElements();

			sinon.assert.calledTwice(Player.prototype.init);
		});

		it('adds launched video players to the players object', () => {
			// Mock the DOM
			document.body.innerHTML = '<video class="afterglow"></video><video class="sublime"></video>';
			// 0 before initialization
			afterglow.players.should.be.length(0);

			let res = afterglow.initVideoElements();

			// Holding two of them afterwards
			afterglow.players.should.be.length(2);
		});
	});

	describe("Lightbox element initiation", () => {

		/** 
		 * VIDEO ELEMENT SETUP TESTS
		 */

		it('detects lightbox elements properly, including SublimeVideo markup and prepares the triggers.', () =>{
			// Mock the DOM
			document.body.innerHTML = '<video id="test1"></video><video id="test2"></video><a class="sublime" href="#test1"></a><a class="afterglow" href="#test2"></a>';

			sinon.stub(afterglow, 'bindLightboxTriggerEvents', () => {} );

			// Run the tests
			let res = afterglow.prepareLightboxVideos();

			sinon.assert.calledTwice(LightboxTrigger.prototype.init);
			sinon.assert.calledTwice(afterglow.bindLightboxTriggerEvents);
		});

		it('passes initialized lightbox triggers to the trigger container',() => {// Mock the DOM
			document.body.innerHTML = '<video id="test1"></video><video id="test2"></video><a class="sublime" href="#test1"></a><a class="afterglow" href="#test2"></a>';

			sinon.stub(afterglow, 'bindLightboxTriggerEvents', () => {} );
			
			afterglow.lightboxtriggers.should.be.length(0);

			// Run the tests
			let res = afterglow.prepareLightboxVideos();

			afterglow.lightboxtriggers.should.be.length(2);
		});

		it('binds lightbox trigger events properly', () => {
			let Trigger = {
				on : () => {}
			};

			sinon.spy(Trigger,'on');

			afterglow.bindLightboxTriggerEvents(Trigger);
			assert(Trigger.on.calledTwice);
		});
	});

	describe("API methods", () => {
		it('should return the players videojs instance when getting by id',() => {
			afterglow.players = [
				{
					id : 'testid',
					getPlayer: ()=>{ return 'test1' }
				}
			];

			afterglow.lightboxtriggers = [
				{
					playerid : 'testid2',
					getPlayer: () => {
						return 'test2';
					}
				}
			];

			let regularPlayer = afterglow.getPlayer('testid');
			let lightboxPlayer = afterglow.getPlayer('testid2');

			regularPlayer.should.equal('test1');
			lightboxPlayer.should.equal('test2');
		});

		it('should return false when the id was not found', () => {
			afterglow.players = [
				{
					id : 'testid'
				}
			];
			let regularPlayer = afterglow.getPlayer('nonexistingtestid');
			let lightboxPlayer = afterglow.getPlayer('nonexistingtestid2');
			regularPlayer.should.be.false;
			lightboxPlayer.should.be.false;
		});

		it('should delete players from the player container when deleting by id',() => {
			let destroyTest = {
				alert : () => {}
			}

			afterglow.players = [
				{
					id : 'testid',
					destroy : () => {
						destroyTest.alert();
					}
				}
			];
			sinon.spy(destroyTest, 'alert');
			afterglow.players.should.be.length(1);

			afterglow.destroyPlayer('testid');

			assert(destroyTest.alert.calledOnce);
			afterglow.players.should.be.length(0);
		});

		it('should return false if there was not lightbox to destroy', () => {
			afterglow.players = [
				{
					id : 'testid'
				}
			];

			afterglow.players.should.be.length(1);

			let res = afterglow.destroyPlayer('nonexistingid');
			res.should.be.false;
		});

		it('should close lightbox for lightbox players when deleting by id',() => {
			afterglow.lightboxtriggers = [
				{
					playerid : 'testid',
				}
			];
			sinon.stub(afterglow, 'closeLightbox', () => {} );

			afterglow.destroyPlayer('testid');

			sinon.assert.calledOnce(afterglow.closeLightbox);
		});

		it('should pass play method for regular players',() => {
			var testobject = {
				play: () => {
					return 'success';
				}
			};

			afterglow.players = [
				{
					id : 'testid',
					getPlayer: () => {
						return testobject;
					}
				}
			];

			afterglow.lightboxtriggers = [];

			sinon.spy(testobject, 'play');

			afterglow.play('testid');

			sinon.assert.calledOnce(testobject.play);
		});

		it('should trigger lightboxes',() => {
			var testTrigger = {
				playerid : 'testid',
				trigger: () => {
					return 'triggersuccess';
				}
			}

			sinon.spy(testTrigger, 'trigger');

			afterglow.lightboxtriggers = [ testTrigger ];
			afterglow.players = [];
			
			afterglow.play('testid');
			
			sinon.assert.calledOnce(testTrigger.trigger);
		});

		it('should properly close all lightboxes when closing is triggered', () => {
			let closeTest = {
				alert : () => {}
			}

			afterglow.lightboxtriggers = [
				{
					closeLightbox : () => {
						closeTest.alert();
					}
				},
				{
					closeLightbox : () => {
						closeTest.alert();
					}
				}
			];
			sinon.spy(closeTest, 'alert');
			sinon.stub(afterglow, 'consolidatePlayers', () => {} );

			afterglow.closeLightbox();

			assert(closeTest.alert.calledTwice);
			sinon.assert.calledOnce(afterglow.consolidatePlayers);
		});
	});
	
	describe('Consolidation',() => {
		it('should remove players that have been destroyed', () => {
			afterglow.players = [
				{
					alive: false
				},{
					alive: true
				},{
					alive: true
				},{
				},
			];
			afterglow.players.should.be.length(4);
			afterglow.consolidatePlayers();
			afterglow.players.should.be.length(2);
		});
		it('should reindex the player container after removing destroyed players', () => {
			afterglow.players = [
				{
					alive: false
				},{
					alive: true
				},{
					alive: true
				},{
				},
			];
			afterglow.players.should.have.all.keys(["0","1","2","3"]);
			afterglow.consolidatePlayers();
			afterglow.players.should.have.all.keys(["0","1"]);

		});
	});	
});