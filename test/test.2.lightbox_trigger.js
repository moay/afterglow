import LightboxTrigger from '../src/js/afterglow/components/LightboxTrigger';
import Lightbox from '../src/js/afterglow/components/Lightbox';
import Eventbus from '../src/js/afterglow/components/Eventbus';
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

	var afterglow,
		lightboxtrigger,
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

	describe('prepare()', () => {
		beforeEach(() => {
			sinon.stub(LightboxTrigger.prototype, 'prepare');
			lightboxtrigger = new LightboxTrigger(triggerelement);
			LightboxTrigger.prototype.prepare.restore();

			lightboxtrigger.videoelement = {
				addClass : (input) => {},
				setAttribute : (input1, input2) => {}
			}
		});

		it('should make the video element have autoresize fit by default', () => {
			sinon.stub(lightboxtrigger, 'bind');
			sinon.spy(lightboxtrigger.videoelement, 'setAttribute');

			lightboxtrigger.prepare();

			expect(lightboxtrigger.videoelement.setAttribute).to.have.been.calledOnce;
			expect(lightboxtrigger.videoelement.setAttribute).to.have.been.calledWith('data-autoresize', 'fit');

		});

		it('should add the CSS class properly', () => {
			sinon.stub(lightboxtrigger, 'bind');
			sinon.spy(lightboxtrigger.videoelement, 'addClass');

			lightboxtrigger.prepare();

			expect(lightboxtrigger.videoelement.addClass).to.have.been.calledOnce;
			expect(lightboxtrigger.videoelement.addClass).to.have.been.calledWith('afterglow-lightboxplayer');

		});
	});

	describe('trigger()', () => {
		beforeEach(() => {

			sinon.stub(Eventbus.prototype, 'dispatch');
			sinon.stub(LightboxTrigger.prototype, 'init');
			sinon.stub(Emitter.prototype, 'on');
			sinon.stub(Emitter.prototype, 'emit');
			lightboxtrigger = new LightboxTrigger(triggerelement);
			sinon.stub(Lightbox.prototype, 'build', function(){ this.on = () => { return 'test' } });
			sinon.stub(Lightbox.prototype, 'passVideoElement', (input) => { return input });
			sinon.stub(Lightbox.prototype, 'launch');

			window.afterglow = {};
			window.afterglow.eventbus = new Eventbus();
			
			lightboxtrigger.videoelement = {
				cloneNode : () => { return 'test' }
			}
			lightboxtrigger.emit = () => {
				return
			};
		});

		afterEach(() => {
			LightboxTrigger.prototype.init.restore();
			Lightbox.prototype.build.restore();
			Lightbox.prototype.passVideoElement.restore();
			Lightbox.prototype.launch.restore();
			Emitter.prototype.on.restore();
			Emitter.prototype.emit.restore();
			Eventbus.prototype.dispatch.restore();
		});

		it('should create a new Lightbox Element', () => {
			lightboxtrigger.trigger();
			lightboxtrigger.lightbox.should.be.an('object');
		});

		it('should pass a clone of the video element node to the lightbox', () => {
			sinon.spy(lightboxtrigger.videoelement, 'cloneNode');
			var passedinput;
			lightboxtrigger.trigger();
			assert(Lightbox.prototype.passVideoElement.calledOnce);
			assert(lightboxtrigger.videoelement.cloneNode.calledOnce);
			expect(Lightbox.prototype.passVideoElement).to.have.been.calledWith('test');
		});

		it('should launch the lightbox properly', () => {
			lightboxtrigger.trigger();
			assert(Lightbox.prototype.launch.calledOnce);
			assert(Eventbus.prototype.dispatch.calledOnce);
		});

		it('should trigger and bind the events', () => {
			sinon.stub(lightboxtrigger, 'emit');
			lightboxtrigger.trigger();
			assert(lightboxtrigger.emit.calledOnce);
		});
	});

	describe('closeLightbox()', () => {
		
		beforeEach(() => {
			sinon.stub(LightboxTrigger.prototype, 'prepare');
			lightboxtrigger = new LightboxTrigger(triggerelement);

			window.test = 1;

			lightboxtrigger.lightbox = {
				close : function(){
					window.test = 2;
				}
			}

			sinon.stub(lightboxtrigger.lightbox, 'close');
			sinon.stub(lightboxtrigger, 'deleteLightbox');
		});

		afterEach(() => {
			LightboxTrigger.prototype.prepare.restore();
		});

		it('should pass the closing to the related lightbox', () => {
			lightboxtrigger.closeLightbox();
			assert(lightboxtrigger.lightbox.close.calledOnce);
		});

		it('should delete the lightbox when closing it', () => {
			lightboxtrigger.closeLightbox();
			assert(lightboxtrigger.deleteLightbox.calledOnce);
		});
	});

	describe('deleteLightbox()', () => {
		
		beforeEach(() => {
			sinon.stub(LightboxTrigger.prototype, 'prepare');
			lightboxtrigger = new LightboxTrigger(triggerelement);

			lightboxtrigger.lightbox = {
				close : () => {}
			}
		});

		afterEach(() => {
			LightboxTrigger.prototype.prepare.restore();
		});

		it('should delete the element from the current trigger', () => {
			lightboxtrigger.lightbox.should.be.an('object');
			lightboxtrigger.deleteLightbox();
			assert.isUndefined(lightboxtrigger.lightbox);
		});
	});

	describe('getPlayer()', () => {
		
		beforeEach(() => {
			sinon.stub(LightboxTrigger.prototype, 'prepare');
			lightboxtrigger = new LightboxTrigger(triggerelement);

			lightboxtrigger.lightbox = {
				getPlayer : () => { return 'test' }
			}
		});

		afterEach(() => {
			LightboxTrigger.prototype.prepare.restore();
		});

		it('should pass the get Player event to the underlying lightbox', () => {
			var res = lightboxtrigger.getPlayer();
			res.should.equal('test');
		});
	});

});