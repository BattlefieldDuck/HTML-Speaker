[![npm version](https://tatlead.com/HTML-Speaker/static/thumbnail.png)](https://tatlead.com/HTML-Speaker/)

# HTML-Speaker
[![npm version](https://badge.fury.io/js/html-speaker.svg)](https://badge.fury.io/js/html-speaker)

A custom html element to use Text-To-Speech function easier. Live demo: https://tatlead.com/HTML-Speaker/


## npm
```
npm install html-speaker
```


## Quick start

### CSS (Optional)
Copy-paste the stylesheet \<link\> into your \<head\>.
```html
<link href="https://cdn.jsdelivr.net/npm/html-speaker@1.0.0/dist/html-speaker.min.css" rel="stylesheet">
```

### JS
Place the following \<script\> near the end of your pages, right before the closing \</body\> tag
```html
<script src="https://cdn.jsdelivr.net/npm/html-speaker@1.0.0/dist/html-speaker.min.js"></script>
```

### Basic \<html-speaker\> template
Place the following template inside \</body\> tag
```html
<html-speaker for="content" class="speaker speaker-rounded" data-start="PLAY" data-pause="PAUSE"></html-speaker>

<p id="content">
  Back in the old days of TF2 Sandbox, MSTR stood as the biggest center of in-game TF2 roleplaying in the community.
</p>
```


## Examples
Live demo: https://tatlead.com/HTML-Speaker/examples/


## Bugs and feature requests
If you find a bug, please report it [here on Github](https://github.com/BattlefieldDuck/HTML-Speaker/issues).
