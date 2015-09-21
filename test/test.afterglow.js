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
	});

	beforeEach(() => {
		$ = require('jquery');

		afterglow = new Afterglow();
	});

	after(() => {
		AfterglowPlayer.prototype.init.restore();
		AfterglowPlayer.prototype.setup.restore();
	});

	describe("Bootup", () => {

		/**
		 * GENERAL INITIATION TESTS
		 */

		it('initiates the player container properly', () => {
			afterglow.players.should.be.a('array');
			afterglow.players.should.have.length(0);
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
});