## Changes for v2

- Complete rewrite and change of video engine (from videojs to mediaelement)
- Rewritten to make afterglow work with module loaders. Todo: Documentation
- Rewritten UI for better skinnability more solid rendering
- New Features: Support for Facebook ('data-facebook-url') and HLS (to be improved)
- API improvements: 
    - New method afterglow.addPlayer, supports player id or DOM node of <video> element.
    - Possibility to adress players directly. `var myPlayer = afterglow.getPlayer('myId'); myPlayer.on('play', function() {alert('play')});`
    - Newly created `setAspectRatio()`, to be used like `setAspectRatio(16/9)`
- Added a contextmenu with a link to afterglow. The contextmenu can be disabled via `data-contextmenu="false"`.
- Basic HLS support is there. Its not very stable yet, but feel free to play around with it.
- Light theme has been removed from the core. Maybe added later again.
