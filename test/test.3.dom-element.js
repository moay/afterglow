import DOMElement from '../src/js/afterglow/lib/DOMElement';

var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var jsdom = require('mocha-jsdom');

chai.use(sinonChai);
chai.should();

var assert = chai.assert;
var expect = chai.expect;

describe("DOMElement", () => {	
	// Initiate the DOM
	jsdom();

	var domelement,
		$;

	beforeEach(() => {
		$ = require('jquery');
	});

	describe('Constructor', () => {
		it('should contain its real DOM element',() => {
			document.body.innerHTML = '<video class="afterglow"></video>';
			let videoelement = document.querySelector('video');
			let domelement = new DOMElement(videoelement);
			domelement.node.should.equal(videoelement);
		});
	});

	describe('Class methods', () => {
		it('should add a CSS class via addClass()',() => {
			document.body.innerHTML = '<video class="afterglow"></video>';
			let videoelement = document.querySelector('video');
			let domelement = new DOMElement(videoelement);
			document.querySelectorAll('video.testclass').should.have.length(0);
			domelement.addClass('testclass');
			document.querySelectorAll('video.testclass').should.have.length(1);
		});
		it('should remove a CSS class via removeClass()',() => {
			document.body.innerHTML = '<video class="afterglow"></video>';
			let videoelement = document.querySelector('video');
			let domelement = new DOMElement(videoelement);
			document.querySelectorAll('video.afterglow').should.have.length(1);
			domelement.removeClass('afterglow');
			document.querySelectorAll('video.afterglow').should.have.length(0);
		});
		it('should properly detect a CSS class via hasClass()',() => {
			document.body.innerHTML = '<video class="afterglow"></video>';
			let videoelement = document.querySelector('video');
			let domelement = new DOMElement(videoelement);
			domelement.hasClass('afterglow').should.be.true;
			domelement.hasClass('someotherclass').should.be.false;
		});
	});

	describe('Event methods', () => {
		it('should properly bind events', () => {
			document.body.innerHTML = '<video class="afterglow"></video>';
			let videoelement = document.querySelector('video');
			let domelement = new DOMElement(videoelement);
			
			var method, handler;
			var getMethod = (m) => { method = m };
			var getHandler = (h) => { handler = h };
			sinon.stub(domelement.node, 'addEventListener', (m,h) => { getMethod(m); getHandler(h) });
			
			let res = domelement.bind('someevent', 'something');

			assert(domelement.node.addEventListener.calledOnce);
			method.should.equal('someevent');
			handler.should.equal( 'something' );
		});
		it('should properly split up multiple events and bind all of them', () => {
			document.body.innerHTML = '<video class="afterglow"></video>';
			let videoelement = document.querySelector('video');
			let domelement = new DOMElement(videoelement);
			sinon.stub(domelement.node, 'addEventListener', () => { });
			
			let res = domelement.bind('someevent someotherevent');

			assert(domelement.node.addEventListener.calledTwice);
		});
		it('should properly unbind events', () => {
			document.body.innerHTML = '<video class="afterglow"></video>';
			let videoelement = document.querySelector('video');
			let domelement = new DOMElement(videoelement);
			
			var method, handler;
			var getMethod = (m) => { method = m };
			var getHandler = (h) => { handler = h };
			sinon.stub(domelement.node, 'removeEventListener', (m,h) => { getMethod(m); getHandler(h) });
			
			let res = domelement.unbind('someevent', 'something');

			assert(domelement.node.removeEventListener.calledOnce);
			method.should.equal('someevent');
			handler.should.equal('something');
		});
		it('should properly split up multiple events and unbind all of them', () => {
			document.body.innerHTML = '<video class="afterglow"></video>';
			let videoelement = document.querySelector('video');
			let domelement = new DOMElement(videoelement);
			sinon.stub(domelement.node, 'removeEventListener', () => { });
			
			let res = domelement.unbind('someevent someotherevent');

			assert(domelement.node.removeEventListener.calledTwice);
		});
	});

	describe('Proxy methods', () => {
		var domelement;

		beforeEach(() => {
			document.body.innerHTML = '<div></div>';
			let rawnode = document.querySelector('div');
			domelement = new DOMElement(rawnode);
		});

		it('should pass getAttribute to node', () => {
			sinon.stub(domelement.node, 'getAttribute', (input) => { return input; });
			
			let res = domelement.getAttribute('something');

			assert(domelement.node.getAttribute.calledOnce);
			res.should.equal('something');
		});
		it('should pass setAttribute to node', () => {
			sinon.stub(domelement.node, 'setAttribute', (input1, input2) => { return input1 + input2; });
			
			let res = domelement.setAttribute('something', 'someotherthing');

			assert(domelement.node.setAttribute.calledOnce);
			res.should.equal('somethingsomeotherthing');
		});
		it('should pass hasAttribute to node', () => {
			sinon.stub(domelement.node, 'hasAttribute', (input1) => { return input1; });
			
			let res = domelement.hasAttribute('something', 'someotherthing');

			assert(domelement.node.hasAttribute.calledOnce);
			res.should.equal('something');
		});
		it('should pass cloneNode to the node element', () => {
			sinon.stub(domelement.node, 'cloneNode', (input = false) => { return input; });
			
			let res = domelement.cloneNode('somevalue');

			assert(domelement.node.cloneNode.calledOnce);
			res.should.equal('somevalue');

			res = domelement.cloneNode();

			assert(domelement.node.cloneNode.calledTwice);
			res.should.be.false;
		});
		it('should pass removeAttribute to the node element', () => {
			sinon.stub(domelement.node, 'removeAttribute', (input = false) => { return input; });
			
			let res = domelement.removeAttribute('somevalue');

			assert(domelement.node.removeAttribute.calledOnce);
			res.should.equal('somevalue');

			res = domelement.removeAttribute();

			assert(domelement.node.removeAttribute.calledTwice);
			res.should.be.false;
		});
		it('should pass appendChild to the node element', () => {
			sinon.stub(domelement.node, 'appendChild', (input = false) => { return input; });
			domelement.appendChild('somevalue');
			assert(domelement.node.appendChild.calledOnce);
			domelement.appendChild();
			assert(domelement.node.appendChild.calledTwice);
		});
		it('should append child node via appendChild when appendDomElement is called', () => {
			document.body.innerHTML = '<p></p>';
			let rawnode2 = document.querySelector('p');
			var domelement2 = new DOMElement(rawnode2);

			sinon.stub(domelement.node, 'appendChild', (input = false) => { return input; });
			sinon.stub(domelement2.node, 'appendChild', (input = false) => { return input; });

			domelement.appendDomElement(domelement2, 'somevalue');
			assert(domelement.node.appendChild.calledOnce);;
		});
		it('should append the element properly to the DOMElement when appendDomElement is called', () => {
			document.body.innerHTML = '<p></p>';
			let rawnode2 = document.querySelector('p');
			var domelement2 = new DOMElement(rawnode2);

			sinon.stub(domelement.node, 'appendChild');
			sinon.stub(domelement2.node, 'appendChild');

			domelement.appendDomElement(domelement2, 'somevalue');
			domelement.somevalue.should.equal(domelement2);
		});
	});


});