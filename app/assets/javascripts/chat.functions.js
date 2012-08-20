/* == PusherChat Functions == */

// Define some variables
var hasFocus = true;
var people = [];

// Attach some functions to track when the window gains and looses focus
window.onblur = function () {hasFocus = false; }
window.onfocus = function () {hasFocus = true; }

// Post to the server about the current status of typing
function typing_status(status) {
	// We don't care about the response or even if the sever gets it.. nothing important!
	// $.post('/api/typing_status', { "chat_id":chat_id, "status":status });
}

// Update the count of people in the chat
function updateCount(i) {
	// Get the current number
	count = parseInt($('#room_count').text());

	// Add on the agument
	$('#room_count').text(count + i);
}

// Post a message to the server to be sent through Pusher
function send_message() {

	// Validate Field
	if($('#message').val() == '') {
		alert('Please enter a message...');
		$('#message').focus();
		return false;
	}

	// Reset the validation stuff
	$('#message').css({ color: '#000000' });

	// Set some vars
	var message = $('#message').val();
	var username = $('#username').val();

	// Start the "loading" UI
	$('#loading').fadeIn();
	$('#message-overlay').fadeIn(200);
	$('#message').blur();

	// Post off to the server with the message and some vars!
	$.ajax({
		url: '/api/post_message',
		data: {
			"chat_id": chat_id,
			"message": message
		},
		method: 'POST',
		success: function(response) {
			$('#message').val("");
			$('#message-overlay').fadeOut(150);
			$('#message').focus();
			$('#loading').fadeOut();
			is_typing_currently = false;
			typing_status(false);
		},
		error: function(response) {
			var failNode = $('<li>Chat server burp. Try again.</li>');
			$('#messages').append(failNode);
			setTimeout(function() { $(failNode).fadeOut(150); }, 5000);
			$('#message-overlay').fadeOut(150);
			$('#message').focus();
			$('#loading').fadeOut();
		}
	})
}

function scrollToTheTop() {
	$("#messages").scrollTop(20000000);
}

function replaceURLWithHTMLLinks(text) {
     var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
     return text.replace(exp,"<a href='$1' target='_blank'>$1</a>");
}
