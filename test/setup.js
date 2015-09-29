import Afterglow from '../src/js/afterglow/Afterglow';
import AfterglowPlayer from '../src/js/afterglow/components/Player';
import AfterglowLightbox from '../src/js/afterglow/components/Lightbox';
import AfterglowLightboxTrigger from '../src/js/afterglow/components/LightboxTrigger';
import AfterglowConfig from '../src/js/afterglow/components/Config';
import AfterglowUtil from '../src/js/afterglow/lib/Util';

var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var jsdom = require('mocha-jsdom');

chai.use(sinonChai);
chai.should();

var assert = chai.assert;
var expect = chai.expect;
