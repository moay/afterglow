# afterglow

afterglow is a tool to create fully responsive and totally awesome video players from an HTML5 video element with as little effort as possible.

The project is currently under heavy development and should not be considered usable yet.

You can see a first demo of afterglow here: [afterglowplayer.com/sandbox](http://afterglowplayer.com/sandbox).

## Documentation

There is a full documentation available here: [docs.afterglowplayer.com](http://docs.afterglowplayer.com).

## Known issues

As this is not even the first beta release, there will be some limitations. We currently are aware of these issues:

- IE support is not ready yet. It will work on Edge, IE11 and IE10 but the skin needs to be adopted to work well in IE9. IE8 ~~seems not to be working at all yet~~ will not be supported. Read more [here](http://community.afterglowplayer.com/discussion/5/support-for-ie8). *Partially fixed with v0.0.34 - lightboxes won't work on IE9/Windows 7*
- The lightbox closing button may not work on mobile devices. Please test this and tell us about it.
- ~~Youtube videos don't work in lightbox players.~~ *Fixed with v0.0.28*
- ~~The lightbox seems to not work perfectly on some devices.~~ *Fixed with v0.0.32*

## Credits

afterglow relies on scripts provided by many great people.

- [video.js](http://www.videojs.com/) published under the [Apache License 2.0](https://github.com/videojs/video.js/blob/master/LICENSE)
- [$dom](http://julienw.github.io/dollardom/) published under a [BSD-like license](https://github.com/julienw/dollardom/blob/master/LICENSE),
- The font [Open Sans](https://www.google.com/fonts/specimen/Open+Sans) published under the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)

Also, some video.js plugins are included:

- [videojs-hotkeys](https://github.com/ctd1500/videojs-hotkeys) published under the [Apache License 2.0](https://github.com/ctd1500/videojs-hotkeys/blob/master/LICENSE.md)
- [videojs-youtube](https://github.com/eXon/videojs-youtube) published under the [MIT License](https://github.com/eXon/videojs-youtube/blob/master/LICENSE)

Thanks for your great work, guys!

## Copyright and License

Copyright moay under the [MIT license](LICENSE.md).
