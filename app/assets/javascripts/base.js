// Resize the document to window height
var _chatHeight = 0;

function resizeChat() {
  var windowHeight = $(window).height();

  if (_chatHeight == 0) {
    _chatHeight = $('#message-container').outerHeight() + 2;
  }

  $("#messages").height(windowHeight - _chatHeight);
  $("#members").height(windowHeight - _chatHeight);

  var chatWidth = $('#wrapper').width();
  if (chatWidth >= 600) {
    $("#messages").width(chatWidth - 250);
    $('#members').width(250);
  }
  else {
    $("#members").width(chatWidth);
  }
}

// Run the resize whenever the viewport changes
$(window).resize(resizeChat)
$(resizeChat);

var _windowHasFocus = true;

$(function() {
  $(window).focus(function() {
    _windowHasFocus = true;
    resetTitle();
  }).blur(function() {
    _windowHasFocus = false;
  });
  resetTitle();
});

function windowHasFocus() {
  return _windowHasFocus;
}
