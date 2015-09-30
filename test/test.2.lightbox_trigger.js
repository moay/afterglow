import LightboxTrigger from '../src/js/afterglow/components/LightboxTrigger';
import Emitter from '../vendor/Emitter/Emitter';
import DOMElement from '../src/js/afterglow/lib/DOMElement';

var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var jsdom = require('mocha-jsdom');

chai.use(sinonChai);
chai.should();

var assert = chai.assert;
var expect = chai.expect;

describe("Afterglow Lightbox Trigger", () => {	
	// Initiate the DOM
	jsdom();

	var lightboxtrigger,
		triggerelement,
		$;

	beforeEach(() => {
		$ = require('jquery');

		document.body.innerHTML = '<a class="afterglow" href="#testid"></a><video id="testid"></video>';
		triggerelement = document.querySelector('a.afterglow');
	});

	describe('constructor', () => {
		it('should call init()', () => {
			sinon.stub(LightboxTrigger.prototype, 'init');
			lightboxtrigger = new LightboxTrigger(triggerelement);
			assert(LightboxTrigger.prototype.init.calledOnce);
			LightboxTrigger.prototype.init.restore();
		});
	});

	describe('init()', () => {
		beforeEach(() => {
			sinon.stub(LightboxTrigger.prototype, 'prepare');
			lightboxtrigger = new LightboxTrigger(triggerelement);
		});

		afterEach(() => {
			LightboxTrigger.prototype.prepare.restore();
		});

		it('should get the correct playerid', () => {
			lightboxtrigger.playerid.should.equal('testid');
		});

		it('should get the video element properly', () => {
			let videoelement = document.querySelector('#testid');
			// This isn't a proper solution because it still relies on DOMElement to work. But as this class is also tested, this should do for testings.
			lightboxtrigger.videoelement.node.should.equal(videoelement);
		});

		it('should call prepare()', () => {
			assert(LightboxTrigger.prototype.prepare.calledOnce);
		});

		it('should use Emitter for itself', () => {
			// This isn't a proper solution because it relies on Emitter to work. But as this class is also tested, this should do for testings.
			lightboxtrigger.on.should.be.a('function');
		});
	});

});