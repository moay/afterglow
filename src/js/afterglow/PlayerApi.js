export default class PlayerApi {
  play() {
    return this.methodOrProperty('play');
  }

  pause() {
    return this.methodOrProperty('pause');
  }

  paused() {
    return this.methodOrProperty('paused');
  }

  requestFullscreen() {
    return mejs.Features.requestFullScreen(this.mediaelement.media);
  }

  exitFullscreen() {
    return mejs.Features.cancelFullScreen();
  }

  isFullscreen() {
    return mejs.Features.isFullScreen();
  }

  volume() {
    return this.methodOrProperty('volume');
  }

  duration() {
    return this.methodOrProperty('duration');
  }

  currentTime() {
    return this.methodOrProperty('currentTime');
  }

  remainingTime() {
    return this.methodOrProperty('duration') - this.methodOrProperty('currentTime');
  }

  ended() {
    return this.methodOrProperty('ended');
  }

  methodOrProperty(name) {
    if (this.mediaelement && this.mediaelement.media) {
      if (typeof this.mediaelement.media[name] === 'function') {
        return this.mediaelement.media[name]();
      }
      if (typeof this.mediaelement.media[name] === 'undefined') {
        return false;
      }
      return this.mediaelement.media[name];
    }
    return false;
  }
}
