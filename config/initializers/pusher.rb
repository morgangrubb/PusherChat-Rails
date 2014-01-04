require 'pusher'

# Set your pusher API credentials here
Pusher.app_id = ENV['PUSHER_APP_ID']
Pusher.key    = ENV['PUSHER_KEY']
Pusher.secret = ENV['PUSHER_SECRET']
