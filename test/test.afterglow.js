// Import chai.
let chai = require('chai'),
  path = require('path');

// Tell chai that we'll be using the "should" style assertions.
chai.should();
// Enable assert style, too
var assert = chai.assert;

let Afterglow = require(path.join(__dirname, '..', 'src', 'afterglow', 'Afterglow.js'));

describe("Afterglow", () => {
	describe("Core", () => {
		let afterglow;

		beforeEach(() => {
			afterglow = new Afterglow();
		});

		it('initiates the player container properly', () => {
			afterglow.players.should.be.a('array');
			afterglow.players.should.have.length(0);
		});
	});
});