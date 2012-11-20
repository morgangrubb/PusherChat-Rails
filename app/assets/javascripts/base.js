// Resize the document to window height
function resizeChat() {
  var windowHeight = $(window).height();
  $("#messages").height(windowHeight - 60);
  $("#members").height(windowHeight - 60);

  var chatWidth = $('#wrapper').width();
  if (chatWidth >= 600) {
    $("#messages").width(chatWidth - 260);
    $('#members').width(250);
  }
  else {
    $("#members").width(chatWidth);
  }
}

// Run the resize whenever the viewport chants
$(window).resize(resizeChat)
$(resizeChat);

var _windowHasFocus = true;

$(function() {
  $(window).focus(function() {
    _windowHasFocus = true;
  }).blur(function() {
    _windowHasFocus = false;
    resetTitle();
  });
  resetTitle();
});

function windowHasFocus() {
  return _windowHasFocus;
}
