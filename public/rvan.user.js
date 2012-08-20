// ==UserScript==
// @name          r/van chat box on Facebook
// @namespace     http://whatever/
// @description   Places a very simplistic r/van chat box on facebook.com
// @version       0.1
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js
// @require       http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js
// @match         http://*facebook.com/*
// @match         https://*facebook.com/*
// @match         http://lvh.me:3000/greasemonkey_test
// ==/UserScript==

jQuery(document).ready(function() {
  var $ = jQuery;
  var chatUrl = "http://blooming-spire-6161.herokuapp.com/chat/rvan";
  // var chatUrl = "http://lvh.me:3000/chat/rvan";

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

  // Create the floating chat
  $('body').append("<div id='floatingChat' style='display: none; position: fixed; z-index: 999999999; width: 250px; height: 300px; border: 1px #ccc solid'><div class='title' style='background-color: #eee; padding: 3px; font-weight: bold; border-bottom: 1px #ccc solid'>Group Chat</div><iframe border='0' height='275px' scrolling='no' src='" + chatUrl + "' style='border: none; overflow: hidden' width='100%'></iframe></div>");

  var $floatingChat = $('#floatingChat');

  $floatingChat.draggable({
    axis: "x", containment: "parent", handle: "div",
    stop: function() {
      createCookie("chatLeft", $('#floatingChat').position()['left'], 365);
    }
  });

  $floatingChat.find('.title').click(function() {
    console.log('do folding');
  });

  // Set the position for the chat.
  $floatingChat.css({
    left: parseInt(readCookie("chatLeft")),
    bottom: 0
  });

  // Now show it
  $floatingChat.show();
});
