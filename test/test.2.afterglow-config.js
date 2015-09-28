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

import AfterglowUtil from '../src/afterglow/AfterglowUtil';

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

		it('should initialize the options container correctly', () => {
			a_config = new AfterglowConfig(videoelement);
			a_config.options.should.be.an('object');
			a_config.options.should.be.empty;
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
			sinon.stub(AfterglowUtil.prototype, 'isYoutubePlayer', () => { return true; });
			a_config = new AfterglowConfig(videoelement);
			sinon.assert.calledOnce(a_config.setYoutubeOptions);
			AfterglowUtil.prototype.isYoutubePlayer.restore();
		});
	});

	describe('Option defaults', () => {
		beforeEach(() => {
			sinon.stub(AfterglowConfig.prototype, 'getPlayerAttributeFromVideoElement', () => { return "test1" });

			a_config = new AfterglowConfig(videoelement);
		});

		afterEach(() => {
			AfterglowConfig.prototype.getPlayerAttributeFromVideoElement.restore();
		});

		it('sets the options variable properly', () => {
			a_config.options.should.be.an('object');
			expect(a_config.options).to.contain.all.keys('autoplay','techOrder','poster','preload','controls');
		});

		it('should call getPreloadValue() once', () => {
			sinon.assert.calledThrice(a_config.getPlayerAttributeFromVideoElement);
			a_config.options.preload.should.equal("test1");
		});
	});
	
	describe('Attribute getter', () => {
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

		it('should return false as default fallback value', () => {
			a_config = new AfterglowConfig(videoelement);
			a_config.getPlayerAttributeFromVideoElement('somenonexistingattribute').should.be.false;
		});

		it('should return the given fallback value if given', () => {
			a_config = new AfterglowConfig(videoelement);
			a_config.getPlayerAttributeFromVideoElement('somenonexistingattribute','fallback').should.equal('fallback');
		});

		it('should return the correct value for data-[attributename]', () => {
			videoelement.setAttribute('data-someattr','sometest');
			a_config = new AfterglowConfig(videoelement);
			a_config.getPlayerAttributeFromVideoElement('someattr').should.equal('sometest');
		});

		it('should return the correct value for [attributename]', () => {
			videoelement.setAttribute('someattr','sometest');
			a_config = new AfterglowConfig(videoelement);
			a_config.getPlayerAttributeFromVideoElement('someattr').should.equal('sometest');
		});

		it('should prefer data-[attributename] over [attributename]', () => {
			videoelement.setAttribute('someattr','sometest');
			videoelement.setAttribute('data-someattr','sometest2');
			a_config = new AfterglowConfig(videoelement);
			a_config.getPlayerAttributeFromVideoElement('someattr').should.equal('sometest2');
		});
	});
	
	describe('Skin controls setter', () => {
		beforeEach(() => {
			sinon.stub(AfterglowConfig.prototype, 'setDefaultOptions', () => {});
			sinon.stub(AfterglowConfig.prototype, 'setYoutubeOptions', () => {});
			sinon.stub(AfterglowConfig.prototype, 'setSkinControls', () => {});
			a_config = new AfterglowConfig(videoelement);
			AfterglowConfig.prototype.setSkinControls.restore();
		});

		afterEach(() => {
			AfterglowConfig.prototype.setDefaultOptions.restore();
			AfterglowConfig.prototype.setYoutubeOptions.restore();
		});

		it('should add the children attribute to the options container', () => {
			a_config.setSkinControls();
			a_config.options.children.should.exist;
		});

		it('should contain TopControlBar and ControlBar', () => {
			a_config.setSkinControls();
			a_config.options.children.TopControlBar.should.exist;
			a_config.options.children.controlBar.should.exist;
		});
	});

	describe('Youtube options setter', () => {
		beforeEach(() => {
			sinon.stub(AfterglowConfig.prototype, 'setDefaultOptions', () => {});
			sinon.stub(AfterglowConfig.prototype, 'setYoutubeOptions', () => {});
			sinon.stub(AfterglowConfig.prototype, 'setSkinControls', () => {});
			sinon.stub(AfterglowUtil.prototype, 'isYoutubePlayer', () => { return true; });
			a_config = new AfterglowConfig(videoelement);
			AfterglowConfig.prototype.setYoutubeOptions.restore();
		});

		afterEach(() => {
			AfterglowConfig.prototype.setDefaultOptions.restore();
			AfterglowConfig.prototype.setSkinControls.restore();
			AfterglowUtil.prototype.isYoutubePlayer.restore();
		});

		it('should set all needed parameters correctly', () => {
			sinon.stub(AfterglowUtil.prototype, 'ie', () => { return { actualVersion:0 } });

			a_config.setYoutubeOptions();
			a_config.options.should.have.all.keys('showinfo','techOrder','sources');

			AfterglowUtil.prototype.ie.restore();
		});

		it('should set `youtube` parameter if IE8 - IE11', () => {
			for(var i = 8; i >12; i++){
				var ieMock = {
					actualVersion : i
				};
				sinon.stub(AfterglowUtil.prototype, 'ie', () => { return ieMock; });
				sinon.stub(AfterglowConfig.prototype, 'setYoutubeOptions', () => {});

				a_config = new AfterglowConfig(videoelement);
				AfterglowConfig.prototype.setYoutubeOptions.restore();

				a_config.setYoutubeOptions();
				a_config.options.youtube.should.exist;
				a_config.options.youtube.should.have.all.keys('ytControls','color');

				AfterglowUtil.prototype.ie.restore();
			}
		});

		it('should not set `youtube` parameter if IE12', () => {
			var ieMock = {
				actualVersion : 7
			};
			sinon.stub(AfterglowUtil.prototype, 'ie', () => { return ieMock; });
			sinon.stub(AfterglowConfig.prototype, 'setYoutubeOptions', () => {});

			a_config = new AfterglowConfig(videoelement);
			AfterglowConfig.prototype.setYoutubeOptions.restore();

			a_config.setYoutubeOptions();
			a_config.options.should.not.have.any.keys('youtube');

			AfterglowUtil.prototype.ie.restore();
		});
	});


});