mejs.i18n.en['mejs.afterglow-resolution-toggle'] = 'HD';

Object.assign(mejs.MepDefaults, {
  sources: [],
  currentQuality: 'sd',
});

Object.assign(MediaElementPlayer.prototype, {

  /**
   * Feature constructor.
   *
   * Always has to be prefixed with `build` and the name that will be used
   * in MepDefaults.features list
   *
   * @param {MediaElementPlayer} player
   * @param {HTMLElement} controls
   * @param {HTMLElement} layers
   * @param {HTMLElement} media
   */
  buildhdtoggle(player, controls, layers, media) {
    const domNodeChildren = this.mediaFiles ? this.mediaFiles : this.node.children;

    this.options.sources = [];
    for (let i = 0; i < domNodeChildren.length; i += 1) {
      const mediaNode = domNodeChildren[i];
      if (mediaNode.localName === 'source' && mediaNode.type.indexOf('video/') === 0) {
        let quality = mediaNode instanceof HTMLElement ? mediaNode.getAttribute('data-quality') : mediaNode['data-quality'];
        quality = quality === 'hd' ? 'hd' : 'sd';
        this.options.sources.push({
          src: mediaNode.src,
          type: mediaNode.type,
          quality,
        });
        if (this.options.sources.length === 1) {
          this.options.currentQuality = quality;
        }
      }
    }

    if (this.options.sources.length <= 1) {
      return;
    }

    this.cleanhdtoggle(player);

    this.hdtoggleButton = document.createElement('div');
    this.hdtoggleButton.className = `${this.options.classPrefix}button ${this.options.classPrefix}hdtoggle-button ${this.options.classPrefix}hdtoggle-button--${this.options.currentQuality}`;
    this.hdtoggleButton.innerHTML = `<button type="button" aria-controls="${this.id}" title="HD" aria-label="HD" tabindex="0"></button></div>`;

    this.addControlElement(player.hdtoggleButton, 'qualities');

    player.hdtoggleButton.addEventListener('click', () => {
      const { paused } = player;
      const currentTime = player.getCurrentTime();
      const currentSource = player.getSrc();

      let nextSrc = null;
      let nextQuality = this.options.currentQuality;
      let videoType;
      this.options.sources.forEach((source) => {
        if (source.src === currentSource) {
          videoType = source.type;
        }
      });
      this.options.sources.forEach((source) => {
        if (source.src !== currentSource && source.type === videoType) {
          nextSrc = source.src;
          nextQuality = source.quality;
        }
      });
      if (!nextSrc === null || nextSrc === currentSource) {
        return;
      }

      player.setSrc(nextSrc);
      player.setCurrentTime(currentTime);
      this.hdtoggleButton.classList.remove(`afterglow__hdtoggle-button--${this.options.currentQuality}`);
      this.hdtoggleButton.classList.add(`afterglow__hdtoggle-button--${nextQuality}`);
      this.options.currentQuality = nextQuality;
      if (!paused) player.play();
    });
  },

  /**
   * Feature destructor.
   *
   * Always has to be prefixed with `clean` and the name that was used in MepDefaults.features list
   * @param {MediaElementPlayer} player
   */
  cleanhdtoggle(player) {
    if (player) {
      if (player.hdtoggleButton) {
        player.hdtoggleButton.remove();
      }
    }
  },
});
