class AddIndexes < ActiveRecord::Migration
  def up
    add_index :messages, :chat_id
    add_index :messages, :user_id
  end

  def down
    remove_index :messages, :chat_id
    remove_index :messages, :user_id
  end
end
