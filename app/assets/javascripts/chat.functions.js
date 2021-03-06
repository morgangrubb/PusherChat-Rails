/* == PusherChat Functions == */

// Define some variables
var hasFocus = true;
var people = [];
var earliestMessageId = null;

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

function addMessage(user_id, message, target) {
	var escaped = message.message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

	escaped = replaceSmilies(escaped);
	escaped = replaceURLWithHTMLLinks(escaped);
	escaped = replaceNewLinesWithLineBreaks(escaped);

	var row = $('<li></li>').append(escaped);
  row.append($('<div class="timestamp"></div>').html(message.created_at_formatted))

  // row.find('div.content').tooltip({ title: message.created_at_formatted, placement: 'top', delay: { show: 300, hide: 0 }});

	// If the last message was also by this person, just add this message
	var last_node = $(target).find('ul:last-child')
	if (last_node && last_node.data('user-id') == message.user.id.toString()) {
		last_node.append(row);
	}
	else {
		var node = $('<ul data-user-id="' + message.user.id + '"></ul>');
    var user = $('<li class="user"></li>').append('<a href="' + message.user.link + '" target="_blank">' + message.user.nickname + '</a>');
    node.append(user);
		node.append(row);

    if (message.user.image_url != null && message.user.image_url != "") {
      node.css('backgroundImage', 'url(' + message.user.image_url + ')');
    }

		$(target).append(node);
	}
}

var _unreadCount = 0;
function handleNewMessage(message, currentUser) {
  if (!windowHasFocus()) {
    _unreadCount++;
    setTitle();
  }

  // Is it visible?
  var windowHeight = $('#messages').height();
  var scrollPosition = $('#messages').scrollTop();
  var maxScroll = $('#messages')[0].scrollHeight;

  var position = maxScroll - (scrollPosition + windowHeight);

  if (position < windowHeight/2 || currentUser) {
    scrollToTheTop(true);
  }
  else {
    showNewMessageNotification();
  }
}

function resetTitle() {
  _unreadCount = 0;
  setTitle();
}

function setTitle() {
  if (_unreadCount > 0) {
    document.title = '(' + _unreadCount + ') r/van chat';
  }
  else {
    document.title = 'r/van chat';
  }
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
	$.post('/api/typing_status', { "chat_id":chat_id, "status":status, "token": token });
}

// Update the count of people in the chat
function updateCount(i) {
	// Get the current number
	count = parseInt($('#room_count').text());

	// Add on the agument
	$('#room_count').text(count + i);
}

function alertBox(title, message, level) {
  title = title || "";
  message = message || "";
  level = level || "info";
  var $box = $('<div class="alert alert-' + level + '"></div>');
  if (title != "") {
    $box.append($('<strong></strong>').html(title));
  }
  if (message != "") {
    $box.append(message);
  }
  return $box;
}

function messageAlertBox(title, message, level) {
  $box = alertBox(title, message, level);
  $box.css({ position: 'absolute', left: '10px', right: '10px', bottom: '50px', cursor: 'pointer' });
  $box.on('click', function(event) {
    $box.remove();
  });
  $('#message-container').append($box);
  return $box;
}

// Post a message to the server to be sent through Pusher
function send_message() {

	// Validate Field
	if($('#message').val() == '') {
		$('#message').focus();
		return false;
	}

	// Set some vars
	var message = $('#message').val();
	var username = $('#username').val();

	// Start the "loading" UI
  enable = function() {
    $('#message, #message-send').attr("disabled", false);
    $('#message').focus();
  }
  disable = function() {
    $('#message, #message-send').attr("disabled", "disabled").blur();
  }

  disable();

	// Post off to the server with the message and some vars!
	$.ajax({
		url: '/api/post_message',
		data: {
			"chat_id": chat_id,
			"message": message,
      "token"  : token
		},
		type: 'POST',
    complete: function() {
      enable();
    },
		success: function(response) {
			$('#message').val("");
			is_typing_currently = false;
			typing_status(false);
		},
		error: function(response) {
      $box = messageAlertBox("Chat server burp", "Try again in, like, a second or something.", "warning");
      setTimeout(function() { $box.fadeOut(150, function () { $box.remove(); }); }, 5000);
		}
	})
}

function scrollToTheTop(force) {
  $messages = $("#messages");
  $messages.scrollTop($messages[0].scrollHeight);
}

var urlRegex = /\b(?:(?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\((?:[^\s()<>]+|(\(?:[^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;

function replaceURLWithHTMLLinks(text) {
  return text.replace(urlRegex, "<a href='$&' target='_blank'>$&</a>");
}

function replaceNewLinesWithLineBreaks(text) {
	return text.replace(/[\r\n]+/g, "<br />");
}

function setPlaceholder(names) {
	var placeholder = "";

	if (names && names.length > 0) {
    var unique = $.unique(names);
    var count = unique.length;

		placeholder = toSentence(names);
		if (count == 1) {
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

function createMember(member) {
  var link = $('<a></a>').attr({ href: member.link, target: '_blank' }).html(member.nickname);
  var li = $('<li></li>').addClass('m_' + member.id).append(link).append($('<div class="flavour"></div>').html(member.flavour));
  if (member.image_url != null && member.image_url != "") {
    li.css('backgroundImage', 'url(' + member.image_url + ')');
  }
  li.data('update_flavour', function() {
    li.find('.flavour').text(li.data('member').flavour);
  });
  li.data('update_flavour_expired', function() {
    var time = li.data('last_seen');
    if (time !== null) {
      li.find('.flavour').html('Last seen ' + time.toRelativeTime());
    }
    else {
      li.find('.flavour').html('Last seen a while ago');
    }
  });
  li.data('member', member);
  return li;
}

function getRecentMembers() {
  // If member exists in list do nothing
  // Create member
  // Append to recent and start timer
  $.ajax({
    url: "/recent_members/" + chat_id,
    success: function(data) {
      $.each(data, function(i, user) {

        if ($('#members .m_' + user.info.id)[0]) {
          // Do nothing
        }
        else {
          $member = createMember(user.info);
          setMemberExpired($member, new Date(Date.parse(user.info.last_active_at)));
          $('ul#recent').append($member);
        }
      });
    }
  })
}

function addMember(member) {
	if (!member.info) return;

  var $existing = $('ul#recent .m_' + member.info.id);

  if ($existing[0]) {
    $('ul#online').append($existing);
    if ($existing.data('last_seen_timer')) {
      clearInterval($existing.data('last_seen_timer'));
    }
    $existing.find('.flavour').html($existing.data('member').flavour);
  }
  else {
    $('ul#online').append(createMember(member.info));
  }

  // TODO: sort
  var mylist = $('ul#online');
  var listitems = mylist.children('li').get();
  listitems.sort(function(a, b) {
    return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
  })
  $.each(listitems, function(idx, itm) { mylist.append(itm); });
}

function removeMember(member) {
	if (!member.info) return;
  var $existing = $('ul#online .m_' + member.info.id)
  $('ul#recent').prepend($existing);
  setMemberExpired($existing, new Date());
}

function setMemberExpired($node, time) {
  $node.data('last_seen', time);
  timer = setInterval(function() {
    $node.data('update_flavour_expired')();
  }, 1000 * 60);
  $node.data('last_seen_timer', timer);
  $node.data('update_flavour_expired')();
}

function startScrollback() {
  fillScrollback(true);

  // Whenever the scroll offset on the message box hits 0, fetch some more messages.
  $('#messages').scroll(function(event) {
    if ($(this).scrollTop() == 0) {
      scrollback();
    }
    else if ($(this).scrollTop() > ($(this)[0].scrollHeight - $(this).height())) {
      // If we hit the bottom, remove the new messages notification
      hideNewMessageNotification();
    }
  });
}

var _fillScrollbackCount = 5;
function fillScrollback() {
  if (_fillScrollbackCount > 0 && $('#messages')[0].scrollHeight <= $('#messages').outerHeight()) {
    scrollback(false, fillScrollback);
    _fillScrollbackCount--;
  }
}

function scrollback(scrollToLatest, callback) {
  // Start fetching the existing chat messages

  // Alert that we're fetching older content
  // Create and populate an offscreen div
  // Measure the height of that div
  // Slap the contents of that div into #messages
  // Adjust the scroll by the height of the new content
  var $offscreen = $('<div></div>');

  $.ajax({
    url: "/messages/" + chat_id,
    data: {
      earliest_message_id: earliestMessageId || ''
    },
    success: function(data) {
      $.each(data, function(message) {
        if (earliestMessageId == null || this.id < earliestMessageId) {
          earliestMessageId = this.id;
        }

        addMessage(null, this, $offscreen);
      });

      // To get the height difference we need to get the current height
      // Add our elements
      // Get the new height
      // Differentiate
      var startHeight = $('#messages')[0].scrollHeight;
      $('#messages').prepend($offscreen.find('ul'));
      var endHeight = $('#messages')[0].scrollHeight;

      $('#messages').scrollTop(endHeight - startHeight);

      if (scrollToLatest) {
        scrollToTheTop(true);
      }

      if (callback) {
        callback();
      }
    }
  });
}

var newMessageNotification = null;

function showNewMessageNotification() {
  $box = messageAlertBox("New messages are available", "", "info");
  $box.on('click', function(event) {
    $(event.target).remove();
    scrollToTheTop();
  });
  newMessageNotification = $box;
}

function hideNewMessageNotification() {
  newMessageNotification.fadeOut(function() { newMessageNotification.remove(); })
}

function addEvent(user, event) {
  $updateNode = $('<ul class="event"><li></li></ul>');
  $updateNode.find('li').html('<strong>' + user.nickname + '</strong> &mdash; ').append(event);
  $('#messages').append($updateNode);
  handleNewMessage();
}

function updateFlavour(user) {
  $node = $('#members li.m_' + user.id);
  $node.data('member', user);
  $node.data('update_flavour')();
  addEvent(user, $('<span></span>').text(user.flavour));
}

function updateActiveFlavour() {
  var user_ids = [];
  $('ul#online li').each(function(i, node) {
    user_ids.push($(node).data('member').id);
  })

  $.ajax({
    url: '/api/update_active_flavours',
    type: 'POST',
    data: {
      chat_id: chat_id,
      token: token,
      user_ids: user_ids
    },
    success: function(response) {
      $.each(response, function(id, flavour) {
        $node = $('ul#online li.m_' + id);
        member = $node.data('member');
        member.flavour = flavour
        $node.data('member', member);
        $node.data('update_flavour')();
      })
    }
  })
}
