// Import chai.
let chai = require('chai'),
  path = require('path');

// Import Sinon
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

// Setup the DOM
var jsdom = require('mocha-jsdom');

// Tell chai that we'll be using the "should" style assertions.
chai.should();
// Enable assert & expect style, too
var assert = chai.assert;
var expect = chai.expect;

let Afterglow = require(path.join(__dirname, '..', 'src', 'afterglow', 'Afterglow.js'));

import AfterglowPlayer from '../src/afterglow/AfterglowPlayer';
import AfterglowLightbox from '../src/afterglow/AfterglowLightbox';
import AfterglowLightboxTrigger from '../src/afterglow/AfterglowLightboxTrigger';

describe("Afterglow Core", () => {
		
	require(path.join(__dirname, '..', 'src', 'afterglow', 'Afterglow.js'));
	
	// Initiate the DOM
	jsdom();

	var afterglow,
		$;

	before(() => {
		// Mocking the player methods that are called
		sinon.stub(AfterglowPlayer.prototype, 'init', () => {} );
		sinon.stub(AfterglowPlayer.prototype, 'setup', () => {} );


		sinon.stub(AfterglowLightboxTrigger.prototype, 'init', () => {} );
	});

	beforeEach(() => {
		$ = require('jquery');

		afterglow = new Afterglow();
	});

	after(() => {
		// Restore stubbed methods
		AfterglowPlayer.prototype.init.restore();
		AfterglowPlayer.prototype.setup.restore();
		AfterglowLightboxTrigger.prototype.init.restore();
	});

	describe("Bootup", () => {

		/**
		 * GENERAL INITIATION TESTS
		 */

		it('initiates the player container properly', () => {
			afterglow.players.should.be.an('array');
			afterglow.players.should.have.length(0);
		});

		it('initiates the lightbox trigger container properly', () => {
			afterglow.lightboxtriggers.should.be.an('array');
			afterglow.lightboxtriggers.should.have.length(0);
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

			sinon.assert.calledTwice(AfterglowPlayer.prototype.init);
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

			sinon.assert.calledTwice(AfterglowLightboxTrigger.prototype.init);
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
		it('should return the player when getting by id',() => {
			afterglow.players = [
				{
					id : 'testid'
				}
			];

			afterglow.lightboxtriggers = [
				{
					playerid : 'testid2',
					getPlayer: () => {
						return 'test';
					}
				}
			];

			let regularPlayer = afterglow.getPlayer('testid');
			let lightboxPlayer = afterglow.getPlayer('testid2');

			regularPlayer.id.should.equal('testid');
			lightboxPlayer.should.equal('test');
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