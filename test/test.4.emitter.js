const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.should();

const Emitter = require('../vendor/Emitter/Emitter');

function Custom() {
  Emitter.call(this);
}

Custom.prototype.__proto__ = Emitter.prototype;

describe('Custom', () => {
  describe('with Emitter.call(this)', () => {
    it('should work', (done) => {
      const emitter = new Custom();
      emitter.on('foo', done);
      emitter.emit('foo');
    });
  });
});

describe('Emitter', () => {
  describe('.on(event, fn)', () => {
    it('should add listeners', () => {
      const emitter = new Emitter();
      const calls = [];

      emitter.on('foo', (val) => {
        calls.push('one', val);
      });

      emitter.on('foo', (val) => {
        calls.push('two', val);
      });

      emitter.emit('foo', 1);
      emitter.emit('bar', 1);
      emitter.emit('foo', 2);

      calls.should.eql(['one', 1, 'two', 1, 'one', 2, 'two', 2]);
    });

    it('should add listeners for events which are same names with methods of Object.prototype', () => {
      const emitter = new Emitter();
      const calls = [];

      emitter.on('constructor', (val) => {
        calls.push('one', val);
      });

      emitter.on('__proto__', (val) => {
        calls.push('two', val);
      });

      emitter.emit('constructor', 1);
      emitter.emit('__proto__', 2);

      calls.should.eql(['one', 1, 'two', 2]);
    });
  });

  describe('.once(event, fn)', () => {
    it('should add a single-shot listener', () => {
      const emitter = new Emitter();
      const calls = [];

      emitter.once('foo', (val) => {
        calls.push('one', val);
      });

      emitter.emit('foo', 1);
      emitter.emit('foo', 2);
      emitter.emit('foo', 3);
      emitter.emit('bar', 1);

      calls.should.eql(['one', 1]);
    });
  });

  describe('.off(event, fn)', () => {
    it('should remove a listener', () => {
      const emitter = new Emitter();
      const calls = [];

      function one() { calls.push('one'); }
      function two() { calls.push('two'); }

      emitter.on('foo', one);
      emitter.on('foo', two);
      emitter.off('foo', two);

      emitter.emit('foo');

      calls.should.eql(['one']);
    });

    it('should work with .once()', () => {
      const emitter = new Emitter();
      const calls = [];

      function one() { calls.push('one'); }

      emitter.once('foo', one);
      emitter.once('fee', one);
      emitter.off('foo', one);

      emitter.emit('foo');

      calls.should.eql([]);
    });

    it('should work when called from an event', () => {
      const emitter = new Emitter();


      let called;
      function b() {
        called = true;
      }
      emitter.on('tobi', () => {
        emitter.off('tobi', b);
      });
      emitter.on('tobi', b);
      emitter.emit('tobi');
      called.should.be.true;
      called = false;
      emitter.emit('tobi');
      called.should.be.false;
    });
  });

  describe('.off(event)', () => {
    it('should remove all listeners for an event', () => {
      const emitter = new Emitter();
      const calls = [];

      function one() { calls.push('one'); }
      function two() { calls.push('two'); }

      emitter.on('foo', one);
      emitter.on('foo', two);
      emitter.off('foo');

      emitter.emit('foo');
      emitter.emit('foo');

      calls.should.eql([]);
    });
  });

  describe('.off()', () => {
    it('should remove all listeners', () => {
      const emitter = new Emitter();
      const calls = [];

      function one() { calls.push('one'); }
      function two() { calls.push('two'); }

      emitter.on('foo', one);
      emitter.on('bar', two);

      emitter.emit('foo');
      emitter.emit('bar');

      emitter.off();

      emitter.emit('foo');
      emitter.emit('bar');

      calls.should.eql(['one', 'two']);
    });
  });

  describe('.listeners(event)', () => {
    describe('when handlers are present', () => {
      it('should return an array of callbacks', () => {
        const emitter = new Emitter();
        function foo() {}
        emitter.on('foo', foo);
        emitter.listeners('foo').should.eql([foo]);
      });
    });

    describe('when no handlers are present', () => {
      it('should return an empty array', () => {
        const emitter = new Emitter();
        emitter.listeners('foo').should.eql([]);
      });
    });
  });

  describe('.hasListeners(event)', () => {
    describe('when handlers are present', () => {
      it('should return true', () => {
        const emitter = new Emitter();
        emitter.on('foo', () => {});
        emitter.hasListeners('foo').should.be.true;
      });
    });

    describe('when no handlers are present', () => {
      it('should return false', () => {
        const emitter = new Emitter();
        emitter.hasListeners('foo').should.be.false;
      });
    });
  });
});

describe('Emitter(obj)', () => {
  it('should mixin', (done) => {
    const proto = {};
    Emitter(proto);
    proto.on('something', done);
    proto.emit('something');
  });
});
