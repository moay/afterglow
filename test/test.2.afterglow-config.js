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

let AfterglowConfig = require(path.join(__dirname, '..', 'src', 'afterglow', 'AfterglowConfig.js'));

describe("Afterglow Config", () => {
		
	require(path.join(__dirname, '..', 'src', 'afterglow', 'AfterglowConfig.js'));
	
	// Initiate the DOM
	jsdom();

	var a_config,
		$,
		videoelement,
		sandbox;

	beforeEach(() => {
		$ = require('jquery');

	    // stub some console methods
	    sinon.stub(window.console, "error");

		document.body.innerHTML = '<video class="afterglow" id="test" width="1280" height="720"></video>';
		videoelement = document.querySelector('video');
	});

	afterEach(() => {
	    // restore the environment as it was before
	    window.console.error.restore();
	});

	describe('Constructor', () => {
		beforeEach(() => {
			sinon.stub(AfterglowConfig.prototype, 'setDefaultOptions', () => {});
			sinon.stub(AfterglowConfig.prototype, 'setYoutubeOptions', () => {});
			sinon.stub(AfterglowConfig.prototype, 'setSkinControls', () => {});
		});

		afterEach(() => {
			AfterglowConfig.prototype.setDefaultOptions.restore();
			AfterglowConfig.prototype.setYoutubeOptions.restore();
			AfterglowConfig.prototype.setSkinControls.restore();
		});

		it('logs an error if no videoelement is passed', () => {
			a_config = new AfterglowConfig();
			sinon.assert.calledOnce(console.error);
		});

		it('should set the videoelement correctly', () => {
			a_config = new AfterglowConfig(videoelement);
			a_config.videoelement.should.equal(videoelement);
		});

		it('should set the skin name correctly', () => {
			a_config = new AfterglowConfig(videoelement);
			a_config.skin.should.equal('afterglow');
			a_config = new AfterglowConfig(videoelement,'someskin');
			a_config.skin.should.equal('someskin');
		});

		it('should set the default options', () => {
			a_config = new AfterglowConfig(videoelement);
			sinon.assert.calledOnce(a_config.setDefaultOptions);
		});

		it('should set the skin controls', () => {
			a_config = new AfterglowConfig(videoelement);
			sinon.assert.calledOnce(a_config.setSkinControls);
		});

		it('should set the youtube options if needed', () => {
			videoelement.setAttribute('data-youtube-id','someid')
			a_config = new AfterglowConfig(videoelement);
			sinon.assert.calledOnce(a_config.setYoutubeOptions);
		});
	});

	describe('Option defaults', () => {
		beforeEach(() => {
			sinon.stub(AfterglowConfig.prototype, 'getPreloadValue', () => { return "test1" });
			sinon.stub(AfterglowConfig.prototype, 'getAutoplayValue', () => { return "test2" });
			sinon.stub(AfterglowConfig.prototype, 'getPosterframeValue', () => { return "test3" });
		});

		afterEach(() => {
			AfterglowConfig.prototype.getPreloadValue.restore();
			AfterglowConfig.prototype.getAutoplayValue.restore();
			AfterglowConfig.prototype.getPosterframeValue.restore();
		});

		it('sets the options variable properly', () => {
			a_config = new AfterglowConfig(videoelement);
			a_config.options.should.be.an('object');
			expect(a_config.options).to.contain.all.keys('autoplay','techOrder','poster','preload','controls');
		});
	});

});