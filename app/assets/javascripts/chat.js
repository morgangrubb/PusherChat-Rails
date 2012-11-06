// Define Vars;
// var is_typing_currently = false;
var browser_audio_type = "";

function startChat(user_id) {

	// var audio = document.createElement("audio");
	// var audio_types = ["ogg", "mpeg", "wav"];
	// // Loop through the types I have and break out when the browser says it might be able to play one
	// if (typeof audio.canPlayType == 'function') {
 //  	for(type in audio_types) {
 //  		var type_name = audio_types[type];
 //  		if(audio.canPlayType("audio/" + type_name) == "yes" || audio.canPlayType("audio/" + type_name) == "maybe") {
 //  			browser_audio_type = type_name;
 //  			break;
 //  		}
 //  	}
	// }

	$('#messages').html('<ul style="list-style: none; padding: 0; margin: 0"></ul>');

	if ($("#message").length > 0) {
		// Logging - Disable in production
		// Pusher.log = function() { if (window.console) window.console.log.apply(window.console, arguments); };

		// Start fetching the existing chat messages
		$.ajax({
			url: "/messages/" + chat_id,
			success: function(data) {
				$.each(data, function(message) {
					addMessage(user_id, this);
				});
			}
		})

		Pusher.channel_auth_endpoint = '/api/authenticate?user_id=' + user_id;
		var socket = new Pusher(PUSHER_KEY);

		// Global variable "channel" is set in the view
		var presenceChannel = socket.subscribe('presence-' + channel);

		// Increment the number of people in the room when you successfully subscribe to the room
		presenceChannel.bind('pusher:subscription_succeeded', function(member_list){
			updateCount(member_list.count);
		})

		// When somebody joins, pop a note to tell the user
		presenceChannel.bind('pusher:member_added', function(member) {
			// $('#messages').append('<li class="note"><strong>' + member.chat_user.nickname + '</strong> joined the chat.</li>');
			// scrollToTheTop();
			updateCount(1);
		});

		// When somebody leaves, pop a note to tell the user
		presenceChannel.bind('pusher:member_removed', function(member) {
			// $('#messages').append('<li class="note"><strong>' + member.chat_user.nickname + '</strong> left the chat.</li>');
			// scrollToTheTop();
			updateCount(-1);
		});

		// // When somebody updates their nickname, tell all the people including yourself
		// presenceChannel.bind('updated_nickname', function(member) {
		// 	if(member.user_id == user_id)
		// 	{
		// 		$('#messages').append('<li class="note">You have updated your nickname to <strong>' + member.nickname + '</strong>.</li>');
		// 	}
		// 	else
		// 	{
		// 		$('#messages').append('<li class="note"><strong>' + member.old_nickname + '</strong> updated their nickname to <strong>' + member.nickname + '</strong>.</li>');
		// 	}
		// 	scrollToTheTop();
		// });

		// Deal with incoming messages!
		presenceChannel.bind('send_message', function(message) {
			addMessage(user_id, message);
		});

		// // Typing Messages
		// presenceChannel.bind('typing_status', function(notification) {
		// 	if(notification.user.id == user_id) return false;
		// 	if(notification.status == "true") {
		// 		$('#messages').append('<li class="note" id="is_typing_'+ notification.user.id +'"><strong>' + notification.user.nickname + '</strong> is typing...</li>');
		// 	} else {
		// 		$('#messages #is_typing_' + notification.user.id).remove();
		// 	}
		// 	scrollToTheTop();
		// });

		// Now pusher is all setup lets let the user go wild!
		$('#loading').fadeOut();
		$('#message').removeAttr("disabled");
		scrollToTheTop();

		// Enter key to send message
		$('#message').keydown(function(e) {
			if (e.keyCode == 13 && !e.shiftKey) {
				send_message();
				return false;
			}
		});

		// // Typing Notifications
		// // "is_currently_typing" is defined at the top of this file
		// var timout_function = function() {
		// 	is_typing_currently = false;
		// 	typing_status(false);
		// }
		// var typing_end_timeout;
		// $('#message').keyup(function()
		// {
		// 	// Clear the timeout to stop annoying notifications coming every time you clear the field
		// 	clearTimeout(typing_end_timeout);
		// 	if($(this).val() == '' && is_typing_currently) {
		// 		// Has stopped typing by clearing the field
		// 		typing_end_timeout = setTimeout(timout_function, 1500);
		// 	} else {
		// 		// If your not currently typing then send the notification
		// 		if(!is_typing_currently) { is_typing_currently = true; typing_status(true); }
		// 	}
		// });

		// Cross browser placeholder shiz
		var text = 'Type your message here and hit enter...';
		$('#message').focus(function() {
			if($(this).val() == text) { $(this).val(""); }
		}).blur(function() {
			if($(this).val() == "") { $(this).val(text); }
		});
	}

}
