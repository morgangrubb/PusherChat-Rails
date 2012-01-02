class AddLinkToChatUsers < ActiveRecord::Migration
  def change
    add_column :chat_users, :link, :string
  end
end
