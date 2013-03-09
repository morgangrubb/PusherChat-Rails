class AddImageToChatUsers < ActiveRecord::Migration
  def change
    add_column :chat_users, :image_url, :string

    execute <<-SQL
      UPDATE chat_users SET
        image_url = CONCAT('http://graph.facebook.com/', facebook_user_id, '/picture?type=square')
      WHERE facebook_user_id IS NOT NULL
    SQL
  end
end
