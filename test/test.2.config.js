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

describe("Afterglow Config", () => {	
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
			sinon.stub(Config.prototype, 'setDefaultOptions', () => {});
			sinon.stub(Config.prototype, 'setYoutubeOptions', () => {});
			sinon.stub(Config.prototype, 'setSkinControls', () => {});
		});

		afterEach(() => {
			Config.prototype.setDefaultOptions.restore();
			Config.prototype.setYoutubeOptions.restore();
			Config.prototype.setSkinControls.restore();
		});

		it('logs an error if no videoelement is passed', () => {
			a_config = new Config();
			sinon.assert.calledOnce(console.error);
		});

		it('should set the videoelement correctly', () => {
			a_config = new Config(videoelement);
			a_config.videoelement.should.equal(videoelement);
		});

		it('should set the skin name correctly', () => {
			a_config = new Config(videoelement);
			a_config.skin.should.equal('afterglow');
			a_config = new Config(videoelement,'someskin');
			a_config.skin.should.equal('someskin');
		});

		it('should initialize the options container correctly', () => {
			a_config = new Config(videoelement);
			a_config.options.should.be.an('object');
			a_config.options.should.be.empty;
		});

		it('should set the default options', () => {
			a_config = new Config(videoelement);
			sinon.assert.calledOnce(a_config.setDefaultOptions);
		});

		it('should set the skin controls', () => {
			a_config = new Config(videoelement);
			sinon.assert.calledOnce(a_config.setSkinControls);
		});

		it('should set the youtube options if needed', () => {
			sinon.stub(Util.prototype, 'isYoutubePlayer', () => { return true; });
			a_config = new Config(videoelement);
			sinon.assert.calledOnce(a_config.setYoutubeOptions);
			Util.prototype.isYoutubePlayer.restore();
		});
	});

	describe('Option defaults', () => {
		beforeEach(() => {
			sinon.stub(Config.prototype, 'getPlayerAttributeFromVideoElement', () => { return "test1" });

			a_config = new Config(videoelement);
		});

		afterEach(() => {
			Config.prototype.getPlayerAttributeFromVideoElement.restore();
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
			sinon.stub(Config.prototype, 'setDefaultOptions', () => {});
			sinon.stub(Config.prototype, 'setYoutubeOptions', () => {});
			sinon.stub(Config.prototype, 'setSkinControls', () => {});
		});

		afterEach(() => {
			Config.prototype.setDefaultOptions.restore();
			Config.prototype.setYoutubeOptions.restore();
			Config.prototype.setSkinControls.restore();
		});

		it('should return false as default fallback value', () => {
			a_config = new Config(videoelement);
			a_config.getPlayerAttributeFromVideoElement('somenonexistingattribute').should.be.false;
		});

		it('should return the given fallback value if given', () => {
			a_config = new Config(videoelement);
			a_config.getPlayerAttributeFromVideoElement('somenonexistingattribute','fallback').should.equal('fallback');
		});

		it('should return the correct value for data-[attributename]', () => {
			videoelement.setAttribute('data-someattr','sometest');
			a_config = new Config(videoelement);
			a_config.getPlayerAttributeFromVideoElement('someattr').should.equal('sometest');
		});

		it('should return the correct value for [attributename]', () => {
			videoelement.setAttribute('someattr','sometest');
			a_config = new Config(videoelement);
			a_config.getPlayerAttributeFromVideoElement('someattr').should.equal('sometest');
		});

		it('should prefer data-[attributename] over [attributename]', () => {
			videoelement.setAttribute('someattr','sometest');
			videoelement.setAttribute('data-someattr','sometest2');
			a_config = new Config(videoelement);
			a_config.getPlayerAttributeFromVideoElement('someattr').should.equal('sometest2');
		});
	});
	
	describe('Skin controls setter', () => {
		beforeEach(() => {
			sinon.stub(Config.prototype, 'setDefaultOptions', () => {});
			sinon.stub(Config.prototype, 'setYoutubeOptions', () => {});
			sinon.stub(Config.prototype, 'setSkinControls', () => {});
			a_config = new Config(videoelement);
			Config.prototype.setSkinControls.restore();
		});

		afterEach(() => {
			Config.prototype.setDefaultOptions.restore();
			Config.prototype.setYoutubeOptions.restore();
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
			sinon.stub(Config.prototype, 'setDefaultOptions', () => {});
			sinon.stub(Config.prototype, 'setYoutubeOptions', () => {});
			sinon.stub(Config.prototype, 'setSkinControls', () => {});
			sinon.stub(Util.prototype, 'isYoutubePlayer', () => { return true; });
			a_config = new Config(videoelement);
			Config.prototype.setYoutubeOptions.restore();
		});

		afterEach(() => {
			Config.prototype.setDefaultOptions.restore();
			Config.prototype.setSkinControls.restore();
			Util.prototype.isYoutubePlayer.restore();
		});

		it('should set all needed parameters correctly', () => {
			sinon.stub(Util.prototype, 'ie', () => { return { actualVersion:0 } });

			a_config.setYoutubeOptions();
			a_config.options.should.have.all.keys('showinfo','techOrder','sources','youtube');
			a_config.options.youtube['iv_load_policy'].should.exist;

			Util.prototype.ie.restore();
		});

		it('should set `youtube` parameter with two attributes if IE8 - IE11', () => {
			for(var i = 8; i >12; i++){
				var ieMock = {
					actualVersion : i
				};
				sinon.stub(Util.prototype, 'ie', () => { return ieMock; });
				sinon.stub(Config.prototype, 'setYoutubeOptions', () => {});

				a_config = new Config(videoelement);
				Config.prototype.setYoutubeOptions.restore();

				a_config.setYoutubeOptions();
				a_config.options.youtube.should.exist;
				a_config.options.youtube.should.have.all.keys('ytControls','color');
				a_config.options.youtube.should.have.length(2);

				Util.prototype.ie.restore();
			}
		});
	});
	
	describe('CSS class getter', () => {
		
		beforeEach(() => {
			sinon.stub(Config.prototype, 'setDefaultOptions', () => {});
			sinon.stub(Config.prototype, 'setYoutubeOptions', () => {});
			sinon.stub(Config.prototype, 'setSkinControls', () => {});
		});

		afterEach(() => {
			Config.prototype.setDefaultOptions.restore();
			Config.prototype.setYoutubeOptions.restore();
			Config.prototype.setSkinControls.restore();
		});

		it('should return the proper afterglow base class by default', () => {
			a_config = new Config(videoelement);
			let providedClass = a_config.getSkinClass();
			providedClass.should.equal('vjs-afterglow-skin');
		});

		it('should properly include the skin`s name into the class name', () => {
			a_config = new Config(videoelement, 'someclass');
			let providedClass = a_config.getSkinClass();
			providedClass.should.equal('vjs-afterglow-skin afterglow-skin-someclass');
		});
	});

});