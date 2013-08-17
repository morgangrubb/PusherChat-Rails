// ==UserScript==
// @name          r/van chat box on Facebook
// @namespace     http://whatever/
// @description   Places a very simplistic r/van chat box on facebook.com
// @version       0.2
// @match         http://lvh.me:3000/greasemonkey_test
// @match         http://www.facebook.com/*
// @match         https://www.facebook.com/*
// @exclude       http://*.channel.facebook.com/*
// @exclude       https://*.channel.facebook.com/*
// @exclude       http://*.facebook.com/ajax/*
// @exclude       https://*.facebook.com/ajax/*
// @exclude       http://*.facebook.com/dialog/*
// @exclude       https://*.facebook.com/dialog/*
// ==/UserScript==

(function(window, document, undefined) {
  var chatUrl = "//blooming-spire-6161.herokuapp.com/rvan.chat.js";
  var script = document.createElement('script');
  iframe.setAttribute('type', 'text/javascript');
  iframe.setAttribute('src', chatUrl);
  document.getElementsByTagName('body')[0].appendChild(script);
})(window, document);
