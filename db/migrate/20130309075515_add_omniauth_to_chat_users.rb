class AddOmniauthToChatUsers < ActiveRecord::Migration
  def change
    add_column :chat_users, :provider, :string
    add_column :chat_users, :uid, :string

    add_index :chat_users, [:provider, :uid], unique: true

    # If we have any users with duplicate facebook_user_ids we
    # need to blank them.
    chat_users = {}
    ChatUser.find_each do |chat_user|
      chat_users[chat_user.facebook_user_id] ||= []
      chat_users[chat_user.facebook_user_id] << chat_user
    end

    chat_users.each do |key, set|
      if set.length > 1
        keep = set.pop
        ChatUser.update_all "facebook_user_id = NULL", { id: set.collect(&:id) }

        puts "Keeping: #{keep.id}"
        puts "Resetting: #{set.collect(&:id)}"
      end
    end

    execute <<-SQL
      UPDATE chat_users SET
        provider = 'facebook',
        uid = facebook_user_id
    SQL
  end
end
