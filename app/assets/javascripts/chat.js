// Define Vars;
var is_typing_currently = false;
var browser_audio_type = "";
var currently_typing = [];
var currently_typing_index = {};
var names = [];

function startChat(user_id) {
	var isAdmin = false;

	if ($("#message").length > 0) {
		// Logging - Disable in production
		// Pusher.log = function() { if (window.console) window.console.log.apply(window.console, arguments); };

		// Pusher.log = function(message) {
		//   if (window.console && window.console.log) window.console.log(message);
		// };

		Pusher.channel_auth_endpoint = '/api/authenticate?user_id=' + user_id;
		var socket = new Pusher(PUSHER_KEY);

		// Global variable "channel" is set in the view
		var presenceChannel = socket.subscribe('presence-' + channel);
		var controlChannel = socket.subscribe('control-' + channel);

		// Increment the number of people in the room when you successfully subscribe to the room
		presenceChannel.bind('pusher:subscription_succeeded', function(member_list){
      startScrollback();

      if (member_list.me.info.admin) {
      	isAdmin = true;
      }

			// console.log('pusher:subscription_succeeded');
			// console.log(member_list);
			// updateCount(member_list.count);
			resetMembers();
			member_list.each(function(member) {
				addMember(member);
				// console.log(presenceChannel.members.get(member.id))
			});
			getRecentMembers();
		})

		// When somebody joins, pop a note to tell the user
		presenceChannel.bind('pusher:member_added', function(member) {
			// $('#messages').append('<li class="note"><strong>' + member.chat_user.nickname + '</strong> joined the chat.</li>');
  		// console.log('pusher:member_added');
			// console.log(member);
			// console.log(presenceChannel.members.get(member.id));
			// updateCount(1);
			addMember(member);
		});

		// When somebody leaves, pop a note to tell the user
		presenceChannel.bind('pusher:member_removed', function(member) {
			// $('#messages').append('<li class="note"><strong>' + member.chat_user.nickname + '</strong> left the chat.</li>');
			// console.log('pusher:member_removed');
			// console.log(member);
			// console.log(presenceChannel.members.get(member.id));
			// updateCount(-1);
			removeMember(member);
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
		// });

		// Deal with incoming messages!
		presenceChannel.bind('send_message', function(message) {
			addMessage(user_id, message, $('#messages'));
      handleNewMessage(message, message.user.id == user_id);
		});

		// Typing Messages
		// TODO: Come up with a currently typing user list that doesn't break.
		presenceChannel.bind('typing_status', function(notification) {
			// console.log('typing', notification.status, notification.user.id == user_id, notification);
			if (notification.user.id == user_id) {
				return;
			}

			if (notification.status == 'true') {
				// Add this user to the list
				if (currently_typing_index[notification.user.id] || currently_typing_index[notification.user.id] == -1) {
					currently_typing.push(notification.user);
					currently_typing_index[notification.user.id] = currently_typing.length - 1;
					setTimeout(function() {
						// console.log('pruning', notification, currently_typing);
						if (currently_typing_index[notification.user.id] != -1) {
							currently_typing.splice(currently_typing_index[notification.user.id], 1);
							currently_typing_index[notification.user.id] = -1;

							names = [];
							$(currently_typing).each(function(i) {
								names.push(this.nickname || this.id);
							});
							setPlaceholder(names);
						}
					}, 10000);
				}
			}
			else {
				// Remove this user from the list
				currently_typing.splice(currently_typing_index[notification.user.id], 1);
				currently_typing_index[notification.user.id] = -1;
			}

			// Update the placeholder
			names = [];
			$(currently_typing).each(function(i) {
				names.push(this.nickname || this.id);
			});
			setPlaceholder(names);

			// if(notification.user.id == user_id) return false;
			// if(notification.status == "true") {
			// 	$('#messages').append('<li class="note" id="is_typing_'+ notification.user.id +'"><strong>' + notification.user.nickname + '</strong> is typing...</li>');
			// } else {
			// 	$('#messages #is_typing_' + notification.user.id).remove();
			// }
		});

		presenceChannel.bind('update_flavour', function(update) {
			$node = $('#members li.m_' + update.user.id);
			$node.data('member', update.user);
			$node.data('update_flavour')();
		});

		// Now pusher is all setup lets let the user go wild!
		$('#loading').fadeOut();
		$('#message').removeAttr("disabled");

		// Enter key to send message
		$('#message').keydown(function(e) {
			if (e.keyCode == 13 && !e.shiftKey) {
				send_message();
				return false;
			}
		});

    // Hit the button to send a message
    $('#message-send').click(function(e) {
      e.preventDefault();
      if (!$(this).attr('disabled')) {
        send_message();
      }
    });

		// Typing Notifications
		// "is_currently_typing" is defined at the top of this file
		var timout_function = function() {
			is_typing_currently = false;
			typing_status(false);
		}
		var typing_end_timeout;
		$('#message').keyup(function() {
			// Clear the timeout to stop annoying notifications coming every time you clear the field
			clearTimeout(typing_end_timeout);
			if($(this).val() == '' && is_typing_currently) {
				// Has stopped typing by clearing the field
				typing_end_timeout = setTimeout(timout_function, 1500);
				setPlaceholder([]);
			} else {
				// If your not currently typing then send the notification
				if(!is_typing_currently) { is_typing_currently = true; typing_status(true); }
			}
		});

		$('ul#online').on('click', '.flavour', function(event) {
			var $node = $(event.target).parents('li');
			var isCurrentUser = $node.data('member').id == user_id;
			var promptText = '';

			if (isCurrentUser) {
				promptText = 'Please enter your new flair';
			}
			else if (isAdmin) {
				promptText = 'Please enter the new flair for ' + $node.data('member').nickname;
			}
			else {
				// Do nothing
			}

			if (promptText != '') {
				var newFlavour = prompt(promptText, $node.data('member').flavour);

				if (newFlavour !== null) {
					$.ajax({
						url: '/api/update_flavour',
						type: 'POST',
						data: {
							chat_id: chat_id,
							target_user_id: $node.data('member').id,
							flavour: newFlavour,
							token: token
						}
					})
				}
			}
		});

		// // Cross browser placeholder shiz
		// var text = 'Type your message here and hit enter...';
		// $('#message').focus(function() {
		// 	if($(this).val() == text) { $(this).val(""); }
		// }).blur(function() {
		// 	if($(this).val() == "") { $(this).val(text); }
		// });
	}

}
