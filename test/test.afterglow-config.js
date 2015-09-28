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
		$;

	beforeEach(() => {
		$ = require('jquery');

		a_config = new AfterglowConfig();
	});

	
});