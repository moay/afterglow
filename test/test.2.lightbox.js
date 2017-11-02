import Player from '../src/js/afterglow/components/Player';
import Lightbox from '../src/js/afterglow/components/Lightbox';
import Emitter from '../vendor/Emitter/Emitter';
import Eventbus from '../src/js/afterglow/components/Eventbus';
import DOMElement from '../src/js/afterglow/lib/DOMElement';
import Util from '../src/js/afterglow/lib/Util';

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

			sinon.stub(Eventbus.prototype, 'dispatch');
			sinon.stub(Lightbox.prototype, 'build');
			sinon.stub(Lightbox.prototype, 'bindEmitter');
			sinon.stub(DOMElement.prototype, 'addClass');

			window.afterglow = {};
			window.afterglow.eventbus = new Eventbus();

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
			Eventbus.prototype.dispatch.restore();
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
			assert(Eventbus.prototype.dispatch.calledOnce);
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

		it('should properly return the players videojs instance', () => {
			lightbox.player = {
				getPlayer: function(){ return this.videojs}
			};
			lightbox.player.videojs = 'test';
			let res = lightbox.getPlayer();
			res.should.equal('test');
		});

		it('should return undefined if the player does not exist', () => {
			let res = lightbox.getPlayer();
			expect(res).to.be.undefined;
		})
	});

	describe('resize() with regular players', () => {
		beforeEach(() => {
			sinon.stub(Lightbox.prototype, 'build');
			sinon.stub(Lightbox.prototype, 'bindEmitter');
			sinon.stub(DOMElement.prototype, 'addClass');
			lightbox = new Lightbox();
			lightbox.lightbox = {
				node : {
					style: {}
				}
			};
			lightbox.lightbox.videoelement = {
				getAttribute : () => { return 0.6 }
			};
			sinon.stub(lightbox, 'calculateLightboxSizes', () => {
				return {
					playerwidth : 1,
					playerheight : 2,
					playeroffsettop: 3,
					playeroffsetleft: 4,
					width: 5,
					height: 6
				}
			});
			lightbox.node = {
				style : {}
			};
			lightbox.emit = (input) => {};
		});

		afterEach(() => {
			Lightbox.prototype.bindEmitter.restore();
			DOMElement.prototype.addClass.restore();
			Lightbox.prototype.build.restore();
		});

		it('should pass the ratio to the calculation function correctly', () => {
			lightbox.resize();
			expect(lightbox.calculateLightboxSizes).to.have.been.calledWith(0.6);
		});

		it('should pass correctly style the underlying elements', () => {
			lightbox.resize();
			lightbox.node.style.width.should.equal(5);
			lightbox.node.style.height.should.equal(6);
			lightbox.lightbox.node.style.height.should.equal("2px");
			lightbox.lightbox.node.style.width.should.equal("1px");
			lightbox.lightbox.node.style.top.should.equal("3px");
			lightbox.lightbox.node.style.left.should.equal("4px");
		});

		it('should pass maxwidth to the scaling method if needed', () => {
			lightbox.lightbox.videoelement = {
				getAttribute : (input) => { 
					if(input == 'data-maxwidth'){
						return '123'
					}
					return 'false'
				}
			};
			lightbox.resize();

			expect(lightbox.calculateLightboxSizes).to.have.been.calledWith('false', 123);
		});
	});

	describe('resize() with yt', () => {
		beforeEach(() => {
			sinon.stub(Lightbox.prototype, 'build');
			sinon.stub(Lightbox.prototype, 'bindEmitter');
			sinon.stub(DOMElement.prototype, 'addClass');
			lightbox = new Lightbox();
			lightbox.lightbox = {
				node : {
					style: {}
				}
			};
			lightbox.lightbox.videoelement = undefined;
			sinon.stub(lightbox, 'calculateLightboxSizes', () => {
				return {
					playerwidth : 1,
					playerheight : 2,
					playeroffsettop: 3,
					playeroffsetleft: 4,
					width: 5,
					height: 6
				}
			});
			lightbox.node = {
				style : {}
			};
			lightbox.emit = (input) => {};

			// Fake lightbox behaviour
			document.body.innerHTML = '<div class="afterglow-lightbox-wrapper"><div class="vjs-youtube" data-ratio=".7"></div></div>';
		});

		afterEach(() => {
			Lightbox.prototype.bindEmitter.restore();
			DOMElement.prototype.addClass.restore();
			Lightbox.prototype.build.restore();
		});

		it('should pass the ratio to the calculation function correctly', () => {
			lightbox.resize();
			expect(lightbox.calculateLightboxSizes).to.have.been.calledWith('.7');
		});

		it('should pass correctly style the underlying elements', () => {
			lightbox.resize();
			lightbox.node.style.width.should.equal(5);
			lightbox.node.style.height.should.equal(6);
			lightbox.lightbox.node.style.height.should.equal("2px");
			lightbox.lightbox.node.style.width.should.equal("1px");
			lightbox.lightbox.node.style.top.should.equal("3px");
			lightbox.lightbox.node.style.left.should.equal("4px");
		});
	});

	describe('passVideoElement()', () => {
		
		var lightbox,
			mockelement;

		beforeEach(() => {
			sinon.stub(Lightbox.prototype, 'build');
			sinon.stub(Lightbox.prototype, 'bindEmitter');
			sinon.stub(DOMElement.prototype, 'addClass');
			sinon.stub(Player.prototype, 'setup');

			lightbox = new Lightbox();

			document.body.innerHTML = '<video class="videoelement" id="sometestid"></video>';
			mockelement = document.querySelector('.videoelement');

			lightbox.lightbox = {
				appendDomElement: (i1, i2) => {
					return true;
				}
			};
			sinon.spy(lightbox.lightbox, 'appendDomElement');
		});

		afterEach(() => {
			Lightbox.prototype.bindEmitter.restore();
			DOMElement.prototype.addClass.restore();
			Lightbox.prototype.build.restore();
			Player.prototype.setup.restore();
		});

		it('should pass the id to the element properly', () => {
			lightbox.passVideoElement(mockelement);
			lightbox.playerid.should.equal('sometestid');
		});

		it('should create a new DOMElement from the element and pass it to the lightbox', () => {
			lightbox.passVideoElement(mockelement);
			expect(lightbox.lightbox.videoelement.node).to.equal(mockelement);
		});

		it('should make the player autoplay', () => {
			lightbox.passVideoElement(mockelement);
			expect(lightbox.lightbox.videoelement.node.getAttribute('autoplay')).to.equal('autoplay');
		});

		it('should create a new player', () => {
			lightbox.passVideoElement(mockelement);
			expect(Player.prototype.setup).to.have.been.calledOnce;
			expect(Player.prototype.setup).to.have.been.calledWith(lightbox.lightbox.videoelement);
		});
	});

	describe('launch (except player init callback)', () => {
		beforeEach(() => {
			sinon.stub(Lightbox.prototype, 'build');
			sinon.stub(Lightbox.prototype, 'bindEmitter');
			sinon.stub(DOMElement.prototype, 'addClass');
			document.body.innerHTML = '';

			window['videojs'] = { players : {
				video1 : {
					id_ : 'video1',
					paused:false,
					pause: () => {
						window.videojs.players['video1'].paused = true;
					}
				},
				video2 : {
					id_ : 'video2',
					paused:false,
					pause: () => {
						window.videojs.players['video2'].paused = true;
					}
				}
			}};
			window.videojs.getPlayers = function(){
				return window.videojs.players;
			}

			//,  
			//			sinon.stub(Util.prototype, 'isMobile');
			// sinon.stub(Util.prototype, 'addEventListener');

			lightbox = new Lightbox();
			lightbox.player = {
				init : () => {}
			}
			lightbox.cover = {
				bind : () => {}
			}
			sinon.stub(lightbox.player, 'init', (_callback) => {

			});
			sinon.stub(lightbox, 'resize');
			sinon.stub(lightbox, 'close');
			sinon.stub(lightbox.cover, 'bind');
		});

		afterEach(() => {
			Lightbox.prototype.bindEmitter.restore();
			DOMElement.prototype.addClass.restore();
			Lightbox.prototype.build.restore();
		});

		it('should pass the element node to the dom correctly', () => {
			expect(document.body.innerHTML).to.equal('');
			lightbox.launch();
			expect(document.body.innerHTML).to.equal('<div></div>');
		});

		it('should init the player', () => {
			lightbox.launch();
			expect(lightbox.player.init).to.have.been.calledOnce;
		});

		it('should resize the event and bind resizing to windows resize event', () => {
			sinon.stub(Util.prototype, 'addEventListener', (i1,i2,i3) => { return i3({keyCode:0}); });
			lightbox.launch();
			expect(lightbox.resize).to.have.been.calledTwice;
			Util.prototype.addEventListener.restore();
		});

		it('should pass close() to cover on click event', () => {
			lightbox.cover.bind.restore();
			sinon.stub(lightbox.cover, 'bind', (i1, i2) => { i2(); });
			lightbox.launch();
			expect(lightbox.close).to.have.been.calledOnce;
		});

		it('should pass the closing event on escape key properly', () => {
			sinon.stub(Util.prototype, 'addEventListener', (i1,i2,i3) => { return i3({keyCode:0}); });
			lightbox.launch();
			expect(lightbox.close).to.not.have.been.called;
			Util.prototype.addEventListener.restore();

			sinon.stub(Util.prototype, 'addEventListener', (i1,i2,i3) => { return i3({keyCode:27}); });
			lightbox.launch();
			expect(lightbox.close).to.have.been.calledOnce;
			Util.prototype.addEventListener.restore();
		});

		it('should call the callback function when done', () => {
			var test = 1;
			lightbox.launch();
			expect(test).to.equal(1);
			lightbox.launch(() => {test++});
			expect(test).to.equal(2);
			lightbox.launch(test);
			expect(test).to.equal(2);
			lightbox.launch(() => {test++});
			expect(test).to.equal(3);
		});

		it('should stop all other videos when launching', () => {
			expect(window.videojs.players['video1'].paused).to.be.false;
			expect(window.videojs.players['video2'].paused).to.be.false;
			lightbox.launch();
			expect(window.videojs.players['video1'].paused).to.be.true;
			expect(window.videojs.players['video2'].paused).to.be.true;
		});
	});

	describe('launch (only player init callback)', () => {

		var mockObject;

		beforeEach(() => {
			sinon.stub(Lightbox.prototype, 'build');
			sinon.stub(Lightbox.prototype, 'bindEmitter');
			sinon.stub(DOMElement.prototype, 'addClass');
			sinon.stub(Util.prototype, 'isMobile');
			document.body.innerHTML = '';

			mockObject = {
				addChild : () => {}
			}

			let videojs = {
				paused : () => { return false; },
				on : (i1, i2) => {},
				posterImage : {
					show : () => {}
				},
				bigPlayButton : {
					show : () => {}
				},
				getChild : () => { 
					return mockObject;
				}
			}

			lightbox = new Lightbox();
			lightbox.player = {
				init : () => {},
				videojs: videojs
			}
			lightbox.cover = {
				bind : () => {}
			}
			lightbox.lightbox = {};
			lightbox.lightbox.videoelement = document.createElement('div');
			sinon.stub(lightbox.player, 'init', (_callback) => {
				_callback();
			});
			sinon.stub(lightbox, 'resize');
			sinon.stub(lightbox, 'close');
		});

		afterEach(() => {
			Lightbox.prototype.bindEmitter.restore();
			DOMElement.prototype.addClass.restore();
			Lightbox.prototype.build.restore();
			Util.prototype.isMobile.restore();
		});

		it('should pass LightboxCloseButton to the TopControlBar', () => {
			sinon.spy(lightbox.player.videojs, "getChild");
			sinon.spy(mockObject, "addChild");
			lightbox.launch();
			expect(mockObject.addChild).to.have.been.calledOnce;
			expect(lightbox.player.videojs.getChild).to.have.been.calledOnce;
			expect(mockObject.addChild).to.have.been.calledWith("LightboxCloseButton");
			mockObject.addChild.restore();
		});

		it('should make the poster show if autoclose has not been requested (by default)', () => {
			sinon.stub(lightbox.player.videojs, "on", (i1, i2) => {
				i2();
			});
			sinon.spy(lightbox.player.videojs.posterImage, "show");
			lightbox.launch();
			expect(lightbox.player.videojs.posterImage.show).to.have.been.calledOnce;
		});

		it('should make the lightbox autoclose if autoclose has been requested', () => {
			sinon.stub(lightbox.player.videojs, "on", (i1, i2) => {
				i2();
			});
			sinon.stub(lightbox.lightbox.videoelement, "getAttribute", () => {
				return "true"
			});
			lightbox.launch();
			expect(lightbox.close).to.have.been.calledOnce;
		});

		it('should trigger the section to show poster and playbutton only if not mobile', () => {
			sinon.spy(lightbox.player.videojs,"paused");
			sinon.spy(lightbox.player.videojs.posterImage, "show");
			sinon.spy(lightbox.player.videojs.bigPlayButton, "show");

			Util.prototype.isMobile.restore();
			sinon.stub(Util.prototype, "isMobile", () => { return true});
			lightbox.launch();

			expect(Util.prototype.isMobile).to.have.been.calledOnce;
			expect(lightbox.player.videojs.paused).to.not.have.been.called;
			expect(lightbox.player.videojs.posterImage.show).to.not.have.been.called;
			expect(lightbox.player.videojs.bigPlayButton.show).to.not.have.been.called;
		});

		it('should not display poster and playbutton if autoplay did not fail but check for it', () => {
			sinon.spy(lightbox.player.videojs,"paused");
			sinon.spy(lightbox.player.videojs.posterImage, "show");
			sinon.spy(lightbox.player.videojs.bigPlayButton, "show");
			Util.prototype.isMobile.restore();
			sinon.stub(Util.prototype, "isMobile", () => { return false});

			lightbox.launch();
			expect(Util.prototype.isMobile).to.have.been.calledOnce;
			expect(lightbox.player.videojs.paused).to.have.been.calledOnce;
			expect(lightbox.player.videojs.posterImage.show).to.not.have.been.called;
			expect(lightbox.player.videojs.bigPlayButton.show).to.not.have.been.called;
		});

		it('should show poster and playbutton if autoplay failed', () => {
			sinon.stub(lightbox.player.videojs,"paused",() => { return true});
			sinon.spy(lightbox.player.videojs.posterImage, "show");
			sinon.spy(lightbox.player.videojs.bigPlayButton, "show");
			Util.prototype.isMobile.restore();
			sinon.stub(Util.prototype, "isMobile", () => { return false});

			lightbox.launch();
			expect(Util.prototype.isMobile).to.have.been.calledOnce;
			expect(lightbox.player.videojs.paused).to.have.been.calledOnce;
			expect(lightbox.player.videojs.posterImage.show).to.have.been.calledOnce;
			expect(lightbox.player.videojs.bigPlayButton.show).to.have.been.calledOnce;
		});
	});
});