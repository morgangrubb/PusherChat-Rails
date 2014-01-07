class Message < ActiveRecord::Base
  belongs_to :chat_user, foreign_key: "user_id"

  before_validation :truncate_message

  after_create :touch_last_active

  def timestamp
    created_at.in_time_zone("Pacific Time (US & Canada)").to_s(:time)
  end

  def touch_last_active
    chat_user.touch(:last_active_at)
  end

  def truncate_message
    if message.length > 1000
      self.message = message[0..999] + " (message truncated by system because Ryan MacDonald is a dick)"
    end
  end
end
