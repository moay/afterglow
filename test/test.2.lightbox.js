import Player from '../src/js/afterglow/components/Player';
import Lightbox from '../src/js/afterglow/components/Lightbox';
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

describe("Afterglow Lightbox", () => {	
	// Initiate the DOM
	jsdom();

	var lightbox,
		$;

	beforeEach(() => {
		$ = require('jquery');

	});

	describe('constructor', () => {
		beforeEach(() => {
			sinon.stub(Lightbox.prototype, 'build');
			sinon.stub(DOMElement.prototype, 'addClass');
			sinon.stub(Lightbox.prototype, 'bindEmitter');
		});

		afterEach(() => {
			Lightbox.prototype.build.restore();
			Lightbox.prototype.bindEmitter.restore();
			DOMElement.prototype.addClass.restore();
		});

		it('should call build() on construction', () => {
			lightbox = new Lightbox();
			assert(Lightbox.prototype.build.calledOnce);
		});
		it('should use Emitter on construction', () => {
			expect(Lightbox.prototype.on).to.be.undefined;
			lightbox = new Lightbox();
			assert(Lightbox.prototype.bindEmitter.calledOnce);
		});
		it('should create an empty node and pass the lightbox class to it', () => {
			expect(Lightbox.prototype.node).to.be.undefined;
			lightbox = new Lightbox();
			expect(lightbox.node).to.exist;
			expect(DOMElement.prototype.addClass).to.have.been.calledWith('afterglow-lightbox-wrapper');
		});
	});

	describe('build()', () => {
		beforeEach(() => {
			sinon.stub(Lightbox.prototype, 'build');
			sinon.stub(DOMElement.prototype, 'addClass');
			sinon.stub(Lightbox.prototype, 'bindEmitter');
			sinon.stub(DOMElement.prototype, 'appendDomElement', (input) => { return input });
			sinon.stub(Lightbox.prototype, 'buildLightbox', () => { return 'lightboxtest' });
			sinon.stub(Lightbox.prototype, 'buildCover', () => { return 'covertest' });
			lightbox = new Lightbox();
			lightbox.build.restore();
		});

		afterEach(() => {
			lightbox.buildLightbox.restore();
			lightbox.buildCover.restore();
			DOMElement.prototype.appendDomElement.restore();
			Lightbox.prototype.bindEmitter.restore();
			DOMElement.prototype.addClass.restore();
		});

		it('should append 2 elements to itself', () => {
			lightbox.build();
			expect(lightbox.appendDomElement).to.have.been.calledTwice;
			expect(lightbox.appendDomElement).to.have.been.calledWith('lightboxtest', 'lightbox');
			expect(lightbox.appendDomElement).to.have.been.calledWith('covertest', 'cover');
		});
		it('should build the Lightbox element', () => {
			lightbox.build();
			expect(lightbox.buildLightbox).to.have.been.calledOnce
		});
		it('should build the Cover element', () => {
			lightbox.build();
			expect(lightbox.buildCover).to.have.been.calledOnce
		});
	});

	describe('buildCover()', () => {
		beforeEach(() => {
			sinon.stub(Lightbox.prototype, 'build');
			sinon.stub(Lightbox.prototype, 'bindEmitter');
			sinon.stub(DOMElement.prototype, 'addClass');
			lightbox = new Lightbox();
		});

		afterEach(() => {
			Lightbox.prototype.bindEmitter.restore();
			DOMElement.prototype.addClass.restore();
			Lightbox.prototype.build.restore();
		});

		it('should return a DOMElement with a DOM node', () => {
			let res = lightbox.buildCover();
			res.should.be.an('object');
			res.node.should.exist;
		});

		it('should add class "cover" properly', () => {
			expect(lightbox.addClass).to.have.been.calledOnce;
			let res = lightbox.buildCover();
			// First one was in the constructor, second one is here!
			expect(res.addClass).to.have.been.calledTwice;
			expect(res.addClass).to.have.been.calledWith('cover');
		});
	});

	describe('buildLightbox()', () => {
		beforeEach(() => {
			sinon.stub(Lightbox.prototype, 'build');
			sinon.stub(Lightbox.prototype, 'bindEmitter');
			sinon.stub(DOMElement.prototype, 'addClass');
			lightbox = new Lightbox();
		});

		afterEach(() => {
			Lightbox.prototype.bindEmitter.restore();
			DOMElement.prototype.addClass.restore();
			Lightbox.prototype.build.restore();
		});

		it('should return a DOMElement with a DOM node', () => {
			let res = lightbox.buildLightbox();
			res.should.be.an('object');
			res.node.should.exist;
		});

		it('should add class "lightbox" properly', () => {
			expect(lightbox.addClass).to.have.been.calledOnce;
			let res = lightbox.buildLightbox();
			// First one was in the constructor, second one is here!
			expect(res.addClass).to.have.been.calledTwice;
			expect(res.addClass).to.have.been.calledWith('afterglow-lightbox');
		});
	});

	describe('bindEmitter()', () => {
		it('should bind Emitter proberly', () => {
			sinon.stub(Lightbox.prototype, 'build');
			expect(Lightbox.prototype.on).to.be.undefined;
			lightbox = new Lightbox();
			lightbox.on.should.be.a('function');
			Lightbox.prototype.build.restore();
		})
	});

	describe('calculateLightboxSizes()', () => {

		var window_width,
			window_height,
			sizetests,
			ratiotests;

		beforeEach(() => {
			window_width = window.clientWidth || document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
			window_height = window.clientHeight || document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;

			sizetests = [
				window_width*0.3,
				window_width*0.8,
				window_width*0.5,
				window_width*1.5,
				window_width*5
			];
			ratiotests = [
				0.5, 0.8,
				1,
				1.4, 1.9, 3, 100
			];

			sinon.stub(Lightbox.prototype, 'build');
			sinon.stub(Lightbox.prototype, 'bindEmitter');
			sinon.stub(DOMElement.prototype, 'addClass');
			lightbox = new Lightbox();
		});

		afterEach(() => {
			Lightbox.prototype.bindEmitter.restore();
			DOMElement.prototype.addClass.restore();
			Lightbox.prototype.build.restore();
		});

		it('should scale according to the ratio correctly in landscape format up to the window width', () => {
			ratiotests.forEach((ratio) => {
				let sizes = lightbox.calculateLightboxSizes(ratio);

				expect(sizes.playerwidth).to.be.below(window_width);
				expect(sizes.playerheight).to.be.below(window_height);
				expect(sizes.playerheight/sizes.playerwidth).to.be.within(ratio-0.000001, ratio+0.000001);
				expect(sizes.playeroffsettop + sizes.playerheight).to.be.most(window_height);
				expect(sizes.playeroffsetleft + sizes.playerwidth).to.be.most(window_width);

				if(ratio <= window_height / window_width){
					expect(sizes.playerwidth).to.be.at.least(window_width * .7);
				}
				else{
					expect(sizes.playerheight).to.be.at.least(window_height * .7);
				}
			});
		});	

		it('should scale to the maxwidth at max', () => {
			sizetests.forEach((max_width) => {
				ratiotests.forEach((ratio) => {
					let sizes = lightbox.calculateLightboxSizes(ratio, max_width);

					expect(sizes.playerwidth).to.be.below(window_width);
					expect(sizes.playerheight).to.be.below(window_height);
					expect(sizes.playerheight/sizes.playerwidth).to.be.within(ratio-0.000001, ratio+0.000001);
					expect(sizes.playeroffsettop + sizes.playerheight).to.be.most(window_height);
					expect(sizes.playeroffsetleft + sizes.playerwidth).to.be.most(window_width);

					if(ratio <= window_height / window_width && max_width > window_width){
						expect(sizes.playerwidth).to.be.at.least(window_width * .7);
					}
					else if(ratio <= window_height / window_width){
						expect(sizes.playerwidth).to.be.at.most(max_width);
					}
					else if(ratio > window_height / window_width && max_width > window_width){
						expect(sizes.playerheight).to.be.at.least(window_height * .7);
					}
					else if(ratio > window_height / window_width){
						expect(sizes.playerheight).to.be.at.most(max_width * ratio);
					}
				});
			});
		});		
	});

	describe('close()', () => {
		beforeEach(() => {
			sinon.stub(Lightbox.prototype, 'build');
			sinon.stub(Lightbox.prototype, 'bindEmitter');
			sinon.stub(DOMElement.prototype, 'addClass');
			lightbox = new Lightbox();
			lightbox.player = {
				destroy : () => {}
			};
			lightbox.node = {
				parentNode : {
					removeChild : () => {}
				}
			};
			lightbox.emit = (input) => {};

			sinon.spy(lightbox.player, 'destroy');
			sinon.spy(lightbox, 'emit');
			sinon.spy(lightbox.node.parentNode, 'removeChild');
		});

		afterEach(() => {
			Lightbox.prototype.bindEmitter.restore();
			DOMElement.prototype.addClass.restore();
			Lightbox.prototype.build.restore();
		});

		it('should properly trigger the destroy method on the player', () => {
			lightbox.close();
			expect(lightbox.player.destroy).to.have.been.calledOnce;
		});

		it('should properly remove the nodes from the DOM', () => {
			lightbox.close();
			expect(lightbox.node.parentNode.removeChild).to.have.been.calledOnce;
		});

		it('should emit the closing event', () => {
			lightbox.close();
			expect(lightbox.emit).to.have.been.calledOnce;
			expect(lightbox.emit).to.have.been.calledWith('close');
		});
	});

	describe('getPlayer()', () => {
		beforeEach(() => {
			sinon.stub(Lightbox.prototype, 'build');
			sinon.stub(Lightbox.prototype, 'bindEmitter');
			sinon.stub(DOMElement.prototype, 'addClass');
			lightbox = new Lightbox();
		});

		afterEach(() => {
			Lightbox.prototype.bindEmitter.restore();
			DOMElement.prototype.addClass.restore();
			Lightbox.prototype.build.restore();
		});

		it('should properly return the player', () => {
			lightbox.player = 'test';
			let res = lightbox.getPlayer();
			res.should.equal('test');
		});
	});
});