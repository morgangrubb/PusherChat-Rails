# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20140105235829) do

  create_table "chat_users", :force => true do |t|
    t.string   "nickname"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "facebook_user_id"
    t.string   "link"
    t.boolean  "blocked",          :default => false
    t.string   "provider"
    t.string   "uid"
    t.string   "image_url"
    t.text     "auth"
    t.datetime "last_active_at"
    t.string   "flavour"
  end

  add_index "chat_users", ["facebook_user_id"], :name => "index_chat_users_on_facebook_user_id"
  add_index "chat_users", ["last_active_at"], :name => "index_chat_users_on_last_active_at"
  add_index "chat_users", ["provider", "uid"], :name => "index_chat_users_on_provider_and_uid", :unique => true

  create_table "chats", :force => true do |t|
    t.string   "owner"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "channel"
    t.string   "name"
    t.string   "url"
  end

  create_table "messages", :force => true do |t|
    t.text     "message"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "chat_id"
    t.integer  "user_id"
  end

  add_index "messages", ["chat_id"], :name => "index_messages_on_chat_id"
  add_index "messages", ["user_id"], :name => "index_messages_on_user_id"

end
