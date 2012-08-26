/* == PusherChat Functions == */

// Define some variables
var hasFocus = true;
var people = [];

RegExp.escape = function(text) {
  if (!arguments.callee.sRE) {
    var specials = [
      '/', '.', '*', '+', '?', '|', '^',
      '(', ')', '[', ']', '{', '}', '\\'
    ];
    arguments.callee.sRE = new RegExp(
      '(\\' + specials.join('|\\') + ')', 'g'
    );
  }
  return text.replace(arguments.callee.sRE, '\\$1');
}

var emotes = false;

// Attach some functions to track when the window gains and looses focus
window.onblur = function () {hasFocus = false; }
window.onfocus = function () {hasFocus = true; }

function replaceSmilies(html) {
	if (emotes === false) {
		emotes = populateEmotes();
	}

	$.each(emotes, function() {
		html = html.replace(this['r'], this['i']);
	});

	return html;
}

function populateEmotes() {
	var emotes = $.map([
		[":42:", 							"42.gif"],
		[":3", 								"fb_curlylips.png"],
		[":|]", 							"fb_robot.png"],
		[":v", 								"fb_pacman.png"],
		[":-) :) :] =)", 			"fb_smile.png"],
		[":-( :( :[ =(", 			"fb_frown.png"],
		[":-P :P :-p :p =P", 	"fb_tongue.png"],
		[":-D :D =D", 				"fb_grin.png"],
		[":-O :O :-o :o", 		"fb_gasp.png"],
		[";-) ;)", 						"fb_wink.png"],
		["8-) 8) B-) B)", 		"fb_glasses.png"],
		["8-| 8| B-| B|", 		"fb_sunglasses.png"],
		[">:( >:-(", 					"fb_grumpy.png"],
		[":\\ :-\\ :/ :-/", 	"fb_unsure.png"],
		[":'(", 							"fb_cry.png"],
		["3:) 3:-)", 					"fb_devil.png"],
		["O:) O:-)", 					"fb_angel.png"],
		[":-* :*", 						"fb_kiss.png"],
		["<3", 								"fb_heart.png"],
		["^_^", 							"fb_kiki.png"],
		["-_-", 							"fb_squint.png"],
		["o.O O.o", 					"fb_confused.png"],
		[">:O >:-O >:o >:-o", "fb_upset.png"],
		["(^^^)", 						"shark.gif"],
		["<(\")", 						"penguin.gif"],
		["(Y) (y)", 					"fb_thumb.png"]
	], function(set) {

		// Split the smilies on spaces
		var smilies = $.map(set[0].split(' '), function(smiley) {
			smiley = smiley.replace(/\&/g, '&amp;')
			smiley = smiley.replace(/\</g, '&lt;')
			smiley = smiley.replace(/\>/g, '&gt;')
			return RegExp.escape(smiley);
		});

		// Make the regexp
		return { r: new RegExp('(' + smilies.join('|') + ')', 'gm'), i: '<img src="/assets/emoticons/' + set[1] + '" />' };
	});

	return emotes;
}

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
