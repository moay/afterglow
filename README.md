# afterglow

afterglow is a tool to create fully responsive and totally awesome video players from an HTML5 video element with as little effort as possible.

The project is currently under heavy development and should not be considered usable yet.

You can see a first demo of afterglow here: [afterglowplayer.com/sandbox](http://afterglowplayer.com/sandbox).

## Known issues

As this is not even the first beta release, there will be some limitations. We currently are aware of these issues:

- IE support is not ready yet. It will work on Edge, IE11 and IE10 but the skin needs to be adopted to work well in IE9. IE8 ~~seems not to be working at all yet~~ will not be supported. Read more [here](http://community.afterglowplayer.com/discussion/5/support-for-ie8).
- The lightbox closing button may not work on mobile devices. Please test this and tell us about it.
- ~~Youtube videos don't work in lightbox players.~~ *Fixed with v0.0.28*
- The lightbox seems to not work perfectly on some devices.

## Setup

Setup of afterglow is easy. Download the latest release. You will find the file `afterglow.min.js` located in the folder `dist`. Upload it somewhere and make it available so that it can be integrated into your website.

## Basic usage

This is a working basic example.

```html
    <!DOCTYPE html>
    <html>
        <head>
            <title>afterglow example</title>
            <script type="text/javascript" src="//www.mylocation.com/path/to/afterglow.min.js"></script>
        </head>
        <body>
            <video id="myvideo" class="afterglow" width="1920" height="1080">
                <source type="video/mp4" src="myvideo.mp4"/>
            </video>
        </body>
    </html>
```

## Basic usage opening in a lightbox

This is a working basic example which will be opened in a lightbox.

```html
    <!DOCTYPE html>
    <html>
        <head>
            <title>afterglow example</title>
            <script type="text/javascript" src="//www.mylocation.com/path/to/afterglow.min.js"></script>
        </head>
        <body>
            <a class="afterglow" href="#myvideo">Open the lightbox</a>
            <video id="myvideo" width="1920" height="1080">
                <source type="video/mp4" src="myvideo.mp4" />
            </video>
        </body>
    </html>
```

## Player parameters

There are some parameters that you **must** pass to your video element in order to make it work.

| Parameter  |  Explanation  |
|---|---|
| id   | The id is used to identify your player. It must be unique within the page. |
| class | If you want to make this video element be initiated by afterglow, you must set it to **afterglow**. This doesn't apply if you want it to launch in a lightbox (see above). In this case, you must pass the class **afterglow** to the link you want to open the lightbox. |
| width | In order to make the player responsive, you must pass witdh and height to calculate a ratio for the video. They don't need to be exact, so you can as well pass 1920 / 1080 as 16 / 9. If you don't want the player to be reponsive, pass both values anyways, they will set the player width and height. |
| height | See *width*. |

## Optional player parameters

| Parameter  | Possible values (**default** bold)     | Explanation  |
|---|---|---|
|data-poster *(or poster)*| any url, **no poster** | Pass a valid url or path to a poster image.      |
|data-autoplay *(or autoplay)*       |**false**, true       | If you pass this argument, the player will automatically start to play    |
| data-autoresize  | **none** or fit      | If set to *fit*, the player will be responsive and scale according to it's aspect ratio. |
| data-preload *(or preload)* | **none**, auto | Use this attribute to make the player preload a video file even if it's not playing yet. | 
| data-youtube-id | | Pass a Youtube video ID to make the player load the video from Youtube. You don't have to pass any sources in this case. |

There are some more parameters which aren't documented yet. The documentation is not written yet and will be completely overhauled.

## Api

After initialisation, you can access your player by using it's id like this:

```javascript
    // Pass in the ID that you put into the 'id' attribute
    myplayer = afterglow.getPlayer('myplayer');
```

This gives you full control over your player. You could then f.i. make your player play like this:

```javascript
    myplayer.play();
```

Or you could jump to second 15 and then make it play:

```javascript
    myplayer.currentTime(15).play();
```

`myplayer` will hold a player instance which is created by video.js. This api documentation is incomplete and will be overhauled. For now, you can find all available api functions here: [Video.js-Api](https://github.com/videojs/video.js/blob/master/docs/api/vjs.Player.md#methods)

## Credits

afterglow relies on scripts provided by many great people.

- [video.js](http://www.videojs.com/) published under the [Apache License 2.0](https://github.com/videojs/video.js/blob/master/LICENSE)
- [$dom](http://julienw.github.io/dollardom/) published under a [BSD-like license](https://github.com/julienw/dollardom/blob/master/LICENSE),
- The font [Open Sans](https://www.google.com/fonts/specimen/Open+Sans) published under the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)

Also, some video.js plugins are included:

- [videojs-hotkeys](https://github.com/ctd1500/videojs-hotkeys) published under the [Apache License 2.0](https://github.com/ctd1500/videojs-hotkeys/blob/master/LICENSE.md)

Thanks for your great work, guys!

## Copyright and License

Copyright moay under the [MIT license](LICENSE.md).
