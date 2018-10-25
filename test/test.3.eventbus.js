import EventBus from '../src/js/afterglow/components/EventBus';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
require('jsdom-global')();

chai.use(sinonChai);
chai.should();

const assert = chai.assert;

describe('Eventbus', () => {
  let testCallback;

  beforeEach(() => {
    testCallback = sinon.spy();
  });

  describe('subscribe()', () => {
    it('should bind events', () => {
      EventBus.subscribe('playerid', 'event', testCallback);
      EventBus.players.playerid.listeners.should.have.property('event');
    });
  });

  describe('unsubscribe()', () => {
    it('should remove callbacks', () => {
      EventBus.players = {
        playerid: {
          listeners: {
            event1: [testCallback, testCallback],
          },
        },
      };
      EventBus.unsubscribe('playerid', 'event1', testCallback);
      EventBus.players.playerid.listeners.should.have.property('event1').with.lengthOf(1);
    });
  });


  describe('dispatch()', () => {
    it('should dispatch events', () => {
      window.afterglow = {
        getPlayer: sinon.spy(),
      };

      EventBus.players = {
        playerid: {
          listeners: {
            event1: [testCallback],
          },
        },
      };
      EventBus.dispatch('playerid', 'event1');
      sinon.assert.calledOnce(testCallback);

      EventBus.players = {
        playerid: {
          listeners: {
            event1: [testCallback, testCallback],
          },
        },
      };
      EventBus.dispatch('playerid', 'event1');
      sinon.assert.calledThrice(testCallback);
    });

    it('should pass the player instance', () => {
      window.afterglow = {
        getPlayer: sinon.stub().returns({ id: 42 }),
      };

      EventBus.players = {
        playerid: {
          listeners: {
            event1: [testCallback],
          },
        },
      };
      EventBus.dispatch('playerid', 'event1');
      assert(window.afterglow.getPlayer.called);
      assert(testCallback.calledWith({ type: 'event1', player: { id: 42 }, playerid: 'playerid' }));
    });
  });
});
