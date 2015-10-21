'use strict';

const VjsComponent = videojs.getComponent('Component');

/**
 * Container of some controls at the top of the player
 *
 * @extends Component
 * @class TopControlBar
 */
class TopControlBar extends VjsComponent {

	constructor(player, options){
		super(player, options);
	}

	/**
	 * Create the component's DOM element
	 *
	 * @return {Element}
	 * @method createEl
	 */
	createEl() {
		return super.createEl('div', {
			className: 'vjs-top-control-bar'
		});
    }
}

TopControlBar.prototype.options_ = {
	loadEvent: 'play',
	children: [
		'fullscreenToggle'
	]
};


(function(){
	videojs.registerComponent('TopControlBar', TopControlBar);
})();