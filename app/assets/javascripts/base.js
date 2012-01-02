// Resize the document to window height
function resizeChat() {
  var windowHeight = $(window).height();
  $("#messages").height(windowHeight - 50);
}

// Run the resize whenever the viewport chants
$(window).resize(resizeChat)
$(resizeChat);
