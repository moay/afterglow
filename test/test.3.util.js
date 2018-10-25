import Util from '../src/js/afterglow/lib/Util';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
require('jsdom-global')();

chai.use(sinonChai);
chai.should();

const assert = chai.assert;
const expect = chai.expect;

describe('Util', () => {

  let util;

  beforeEach(() => {
    util = new Util();
  });

  describe('constructor', () => {
    it('should not do anything', () => {
      expect(util).to.be.an('object');
      expect(util).to.eql({});
    });
  });

  describe('isYoutubePlayer()', () => {
    it('should properly check if the videoelement is a Youtube player or not', () => {
      const videoelement = {
        hasAttribute: () => 'somevalue',
      };
      sinon.spy(videoelement, 'hasAttribute');
      const res = util.isYoutubePlayer(videoelement);
      expect(videoelement.hasAttribute).to.have.been.calledOnce;
      expect(videoelement.hasAttribute).to.have.been.calledWith('data-youtube-id');
      expect(res).to.equal('somevalue');
    });
  });

  describe('loadYoutubeThumbnailUrl()', () => {
    it('should return a youtube file properly', () => {
      const res = util.loadYoutubeThumbnailUrl('sometestid');
      expect(res).to.eql('https://img.youtube.com/vi/sometestid/maxresdefault.jpg');
    });
  });

  describe('isVimeoPlayer()', () => {
    it('should properly check if the videoelement is a Vimeo player or not', () => {
      const videoelement = {
        hasAttribute: () => 'somevalue',
      };
      sinon.spy(videoelement, 'hasAttribute');
      const res = util.isVimeoPlayer(videoelement);
      expect(videoelement.hasAttribute).to.have.been.calledOnce;
      expect(videoelement.hasAttribute).to.have.been.calledWith('data-vimeo-id');
      expect(res).to.equal('somevalue');
    });
  });

  describe('isMobile()', () => {
    afterEach(() => {
      // Prevention for the other tests
      navigator.__defineGetter__('userAgent', () => null, // customized user agent
      );
    });

    it('should return false for nothing', () => {
      const res = util.isMobile();
      expect(res).to.be.false;
    });

    it('should return false for random string', () => {
      navigator.__defineGetter__('userAgent', () => 'ThisisARandomString98a2z092h ac09ausc', // customized user agent
      );
      const res = util.isMobile();
      expect(res).to.be.false;
    });

    it('should return true for Android', () => {
      navigator.__defineGetter__('userAgent', () => 'SomethingAndroidSomeotherThing', // customized user agent
      );
      const res = util.isMobile();
      expect(res).to.be.true;
    });

    it('should return true for BlackBerry', () => {
      navigator.__defineGetter__('userAgent', () => 'SomethingBlackBerrySomeotherThing', // customized user agent
      );
      const res = util.isMobile();
      expect(res).to.be.true;
    });

    it('should return true for iPhone', () => {
      navigator.__defineGetter__('userAgent', () => 'SomethingiPhoneSomeotherThing', // customized user agent
      );
      const res = util.isMobile();
      expect(res).to.be.true;
    });

    it('should return true for iPad', () => {
      navigator.__defineGetter__('userAgent', () => 'SomethingAndroidSomeotherThing', // customized user agent
      );
      const res = util.isMobile();
      expect(res).to.be.true;
    });

    it('should return true for iPod', () => {
      navigator.__defineGetter__('userAgent', () => 'SomethingAndroidSomeotherThing', // customized user agent
      );
      const res = util.isMobile();
      expect(res).to.be.true;
    });

    it('should return true for OperaMini', () => {
      navigator.__defineGetter__('userAgent', () => 'SomethingAndroidSomeotherThing', // customized user agent
      );
      const res = util.isMobile();
      expect(res).to.be.true;
    });

    it('should return true for IEMobile', () => {
      navigator.__defineGetter__('userAgent', () => 'SomethingAndroidSomeotherThing', // customized user agent
      );
      const res = util.isMobile();
      expect(res).to.be.true;
    });
  });

  describe('merge_objects()', () => {
    it('should merge two objects properly', () => {
      const object1 = { test1: true };
      const object2 = { test2: true };
      const merged = util.merge_objects(object1, object2);
      expect(merged).to.eql({ test1: true, test2: true });
    });
    it('should work with one empty object', () => {
      const object1 = { };
      const object2 = { test2: true };
      var merged = util.merge_objects(object1, object2);
      expect(merged).to.eql({ test2: true });
      var merged = util.merge_objects(object2, object1);
      expect(merged).to.eql({ test2: true });
    });
  });
});
