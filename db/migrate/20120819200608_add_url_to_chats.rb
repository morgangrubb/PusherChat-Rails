class AddUrlToChats < ActiveRecord::Migration
  def change
    add_column :chats, :url, :string
  end
end
