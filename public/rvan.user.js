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

var chatUrl = "http://rvanchat.com";
var hackChatKey = 'hackChat';

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name,"",-1);
}

if (window.location.href == top.location.href) {
  var container = document.createElement('div');

  function setVisibility() {
    var baseStyle = 'position: fixed; z-index: 999999999; width: 250px; border: 1px #ccc solid; left: 10px; ';

    if (readCookie('chatHide') == '1') {
      baseStyle += 'bottom: -278px;'
    }
    else {
      baseStyle += 'bottom: 0px;'
    }
    container.setAttribute('style', baseStyle);
  }

  setVisibility();

  var iframe = document.createElement('iframe');
  iframe.setAttribute('border', '0');
  iframe.setAttribute('height', '275');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('style', 'border: none; overflow: hidden');
  iframe.setAttribute('src', chatUrl);

  var title = document.createElement('div');
  title.setAttribute('style', 'cursor: pointer; background-color: #eee; padding: 3px; font-weight: bold; border-bottom: 1px #ccc solid');
  title.appendChild(document.createTextNode('Group Chat'));
  title.onclick = function() {
    if (readCookie('chatHide') == '1') {
      createCookie('chatHide', '0');
    }
    else {
      createCookie('chatHide', '1');
    }
    setVisibility();
  }

  container.appendChild(title);
  container.appendChild(iframe);

  document.getElementsByTagName('body')[0].appendChild(container);
}
