import Eventbus from '../src/js/afterglow/components/Eventbus';

var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");

chai.use(sinonChai);
chai.should();

var assert = chai.assert;
var expect = chai.expect;

describe("Eventbus", () => {	
	var eventbus, testCallback;

	beforeEach(() => {
		eventbus = new Eventbus();
		testCallback = sinon.spy();
	});

	describe('subscribe()', () => {
		it('should bind events',() => {
			eventbus.subscribe('playerid','event', testCallback);
			eventbus.players['playerid'].listeners.should.have.property('event');
		});
	});

	describe('unsubscribe()', () => {
		it('should remove callbacks',() => {
			eventbus.players = {
				playerid : {
					listeners : {
						'event1': [testCallback, testCallback]
					}
				}
			};
			eventbus.unsubscribe('playerid','event1', testCallback);
			eventbus.players['playerid'].listeners.should.have.property('event1').with.lengthOf(1);
		});
	});


	describe('dispatch()', () => {
		it('should dispatch events',() => {
			eventbus.players = {
				playerid : {
					listeners : {
						'event1': [testCallback]
					}
				}
			};
			eventbus.dispatch('playerid','event1');
			sinon.assert.calledOnce(testCallback);

			eventbus.players = {
				playerid : {
					listeners : {
						'event1': [testCallback, testCallback]
					}
				}
			};
			eventbus.dispatch('playerid','event1');
			sinon.assert.calledThrice(testCallback);
		});
	});

});