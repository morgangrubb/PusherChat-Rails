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

// If the user starts typing anywhere we need to focus the input
$(function() {
  var $_message = $('#message');

  $(document).keydown(function(event) {
    var keyCode = event.keyCode;
    if (keyCode >= 48 && keyCode <= 90 && !event.altKey && !event.ctrlKey) {
      if (!$_message.is(':focus')) {
        $_message.focus();
        scrollToTheTop(true);
      }
    }
  })
});

// Make the new message notification work
$(function() {
  $('#new-messages a').click(function(event) {
    event.preventDefault();
    scrollToTheTop(true);
  })
});
