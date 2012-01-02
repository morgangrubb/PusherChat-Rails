class AddFacebookUserIdToChatUsers < ActiveRecord::Migration
  def change
    add_column :chat_users, :facebook_user_id, :string
    add_index :chat_users, :facebook_user_id
  end
end
