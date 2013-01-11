class AddBlockedToChatUsers < ActiveRecord::Migration
  def change
    add_column :chat_users, :blocked, :boolean, default: false, nil: false
  end
end
