import Eventbus from '../src/js/afterglow/components/Eventbus';

var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var jsdom = require('mocha-jsdom');

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
		// Initiate the DOM
		jsdom();

		it('should dispatch events',() => {
			window.afterglow = {
				getPlayer: sinon.spy()
			}

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

		it('should pass the player instance', () => {
			window.afterglow = {
				getPlayer: sinon.stub().returns({id:42})
			}

			eventbus.players = {
				playerid : {
					listeners : {
						'event1': [testCallback]
					}
				}
			};
			eventbus.dispatch('playerid','event1');
			assert(window.afterglow.getPlayer.called);
			assert(testCallback.calledWith({type:'event1', player: {id:42}, playerid: 'playerid'}));
		});
	});

});