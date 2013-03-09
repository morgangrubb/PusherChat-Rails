class Message < ActiveRecord::Base
  belongs_to :chat_user, foreign_key: "user_id"
  belongs_to :chat
end
