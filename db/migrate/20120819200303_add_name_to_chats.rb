class AddNameToChats < ActiveRecord::Migration
  def change
    add_column :chats, :name, :string
  end
end
