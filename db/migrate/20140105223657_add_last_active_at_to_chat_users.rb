class AddLastActiveAtToChatUsers < ActiveRecord::Migration
  def change
    add_column :chat_users, :last_active_at, :timestamp
    add_index :chat_users, :last_active_at
  end
end
