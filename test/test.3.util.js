import DOMElement from '../src/js/afterglow/lib/Util';

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

	var util,
		$;

	beforeEach(() => {
		$ = require('jquery');
	});

});