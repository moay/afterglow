import DOMElement from '../lib/DOMElement';

const packageInfo = require('../../../package');

export default class ContextMenu extends DOMElement {
  constructor() {
    super(document.createElement('div'));
    this.init();
  }

  init() {
    this.addClass('afterglow__contextmenu-wrapper');
    this.node.innerHTML = `<div class="afterglow__contextmenu-content"><a href="${packageInfo.homepage}" target="_blank" title="afterglow - HTML5 video player">powered by <span class="afterglow__contextmenu-logo"></span></a></div>`;
    this.node.addEventListener('click', () => {
      this.close();
    });
  }

  open() {
    this.addClass('afterglow__contextmenu-wrapper--visible');
  }

  close() {
    this.removeClass('afterglow__contextmenu-wrapper--visible');
  }
}
