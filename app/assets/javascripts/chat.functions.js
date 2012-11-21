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

function addMessage(user_id, message) {
	var you = '';

	if(user_id == message.user.id) {
		you = 'you ';
		$('#message-overlay').fadeOut(150);
	} else {
		// If they have a typing message, hide it!
		// $('#messages #is_typing_' + message.user.id).hide();

		// // Do some alerting of the user
		// if(!hasFocus) {

		// 	// TODO: Update the page title
		// 	document.title = "New r/van Message!";

		// 	// // Programatically create an audio element and pop the user
		// 	// if(browser_audio_type != "") {
		// 	// 	var pop = document.createElement("audio");
		// 	// 	if(browser_audio_type == "mpeg") { pop.src = "/images/pop.mp4"; }
		// 	// 	else { pop.src = "/images/pop." + browser_audio_type }

		// 	// 	// Only if the browser is happy to play some audio, actually load and play it.
		// 	// 	if(pop.src != "") {
		// 	// 		pop.load();
		// 	// 		pop.play();
		// 	// 	}
		// 	// }
		// }

	}

	var escaped = message.message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

	escaped = replaceSmilies(escaped);
	escaped = replaceURLWithHTMLLinks(escaped);
	escaped = replaceNewLinesWithLineBreaks(escaped);

	var time = $('<span class="time">' + message.created_at_formatted + '</span>');

	var row = $('<tr><td class="image"></td><td><div class="content"></div></td></tr>');

	row.find('div.content').append(time);
	row.find('div.content').append(escaped);

	// If the last message was also by this person, just add this message
	var last_node = $('#messages li:last-child')

	if (last_node && last_node.data('user-id') == message.user.id.toString()) {
		last_node.find('table').append(row);
	}

	else {
		var node = $('<li data-user-id="' + message.user.id + '" class="' + you + 'just_added_id_' + message.id + '" style="display:none;"></li>');

		var table = $('<table />').append(row);

		node.append(table)

		node.find('div.content').prepend('<strong><a href="https://www.facebook.com/' + message.user.facebook_user_id + '" target="_blank">' + message.user.nickname + '</a></strong><br />');

		if (message.user.image) {
			var image = $('<img />').attr({ src: message.user.image, title: message.user.nickname });
			node.find('td.image').append(image);
		}

		$('#messages ul').append(node);

		node.show();
	}

	// $('#messages li.just_added_id_' + message.id).fadeIn();
	scrollToTheTop();

	// Now the window title
	setTitleMessageFrom(message.user);
}

function setTitleMessageFrom(user) {
	if (windowHasFocus()) {
		resetTitle();
		return;
	}

	document.title = 'New message from ' + user.nickname + ' - r/van chat';
}

function resetTitle() {
	document.title = 'r/van chat';
}

function replaceSmilies(html) {
	if (emotes === false) {
		emotes = populateEmotes();
	}

	$.each(emotes, function() {
		var set = this;

		var regex = set['r'],
	    pos = 0,
	    matches = [],
	    match;

		while (match = regex.exec(html, pos)) {
	    matches.push(match);
	    pos = match.index + (match[0].length || 1);
		}

		var replace, index, preceeding, following, leading, lagging;

		for (var i = matches.length - 1; i >= 0; i--) {
			replace = true, index = matches[i].index;

			if (index > 0) {
				preceeding = html[index - 1];
				following = html[index + matches[i][0].length];

				// If the preceeding character is a p and the following character is
				// a forward slash then we don't replace.
				if ((preceeding == 'p' || preceeding == 's') && following == '/') {
					replace = false;
				}

				// If the preceeding character is alphanumeric and the icon starts with
				// an equals sign then we don't replace.
				else if (preceeding.match(/[a-zA-Z0-9_-]/) && matches[i][0][0].match(/[:=]/)) {
					replace = false;
				}

				// If a wink is preceeded by a comma it might be a Zoidberg.
				else if (preceeding == ',' && matches[i][0][0] == ';') {
					replace = false;
				}

				// If the preceeding character is a numeral and the icon starts with
				// any number related glyph then we don't replace.
				else if (preceeding.match(/[0-9]/) && matches[i][0][0].match(/[:-=+*\/]/)) {
					replace = false;
				}
			}

			if (replace) {
				html = html.slice(0, index) + set['i'] + html.slice(index + matches[i][0].length, html.length);
			}
		}
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
			smiley = smiley.replace(/\&/g, '&amp;');
			smiley = smiley.replace(/\</g, '&lt;');
			smiley = smiley.replace(/\>/g, '&gt;');
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
	$.post('/api/typing_status', { "chat_id":chat_id, "status":status });
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

function replaceNewLinesWithLineBreaks(text) {
	return text.replace(/[\r\n]+/, "<br />");
}

function setPlaceholder(names) {
	var placeholder = "";

	if (names && names.length > 0) {
		placeholder = toSentence(names);
		if (names.length == 1) {
			placeholder += ' is typing...'
		}
		else {
			placeholder += ' are typing...'
		}
	}
	else {
		placeholder = 'Type your message here and hit enter...'
	}

	$('#message').attr('placeholder', placeholder);
}

function toSentence(array) {
	if (array.length == 1) {
		return array[0];
	}
	else {
		last = array.pop();
		return array.join(', ') + ' and ' + last;
	}
}

function resetMembers() {
	$('#members ul li').remove();
}

function addMember(member) {
	if (!member.info) return;
  var link = $('<a></a>').attr({ href: member.info.link, target: '_blank' }).html(member.info.nickname);
  var li = $('<li></li>').addClass('m_' + member.info.id).append(link);
  li.css('backgroundImage', 'url(https://graph.facebook.com/' + member.info.facebook_user_id + '/picture)');
  $('#members ul').append(li);

  // TODO: sort
  var mylist = $('#members ul');
  var listitems = mylist.children('li').get();
  listitems.sort(function(a, b) {
  	return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
  })
  $.each(listitems, function(idx, itm) { mylist.append(itm); });
}

function removeMember(member) {
	if (!member.info) return;
	$('#members .m_' + member.info.id).remove();
}
