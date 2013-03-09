class AddAuthRecordToChatUsers < ActiveRecord::Migration
  def change
    add_column :chat_users, :auth, :text
  end
end
