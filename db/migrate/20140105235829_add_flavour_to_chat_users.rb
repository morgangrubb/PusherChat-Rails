class AddFlavourToChatUsers < ActiveRecord::Migration
  def change
    add_column :chat_users, :flavour, :string
  end
end
