## Changes for v2

- Complete rewrite and change of video engine (from videojs to mediaelement)
- Rewritten to make afterglow work with module loaders. Todo: Documentation
- Rewritten UI for better skinnability more solid rendering
- New Features: Support for Facebook (tbd) and HLS (tbd)
- API improvements: 
    - New method afterglow.addPlayer, supports player id or DOM node of <video> element.
    - Possibility to adress players directly. `var myPlayer = afterglow.getPlayer('myId'); myPlayer.on('play', function() {alert('play')});`
- Added a contextmenu with a link to afterglow. The contextmenu can be disabled without any problem.
- Basic HLS support is there. Its not very stable yet, but feel free to play around with it.
