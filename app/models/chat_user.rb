require 'digest/md5'

class ChatUser < ActiveRecord::Base

  has_many :messages, foreign_key: "user_id"

  serialize :auth

  scope :recent, -> { where(["last_active_at > ?", 1.day.ago]).order("last_active_at DESC") }

  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth.provider
      user.uid      = auth.uid
      user.nickname = auth.info.name
    end
  end

  def self.from_omniauth(auth)
    user = find_by_provider_and_uid(auth.provider, auth.uid) ||
      create_with_omniauth(auth)

    # Update the user with any useful information from the request
    user.nickname   = auth.info.name
    user.image_url  = auth.info.image
    user.link       = auth.extra.raw_info.link rescue nil
    user.auth       = auth.to_hash
    user.save

    user
  end

  def to_s
    nickname
  end

  def generate_token
    Digest::MD5.hexdigest [id, Time.now.to_s(:db), "notreallyasalt"].join("-")
  end

  def is_chat_admin?
    nickname == "Morgan Grubb" || nickname == "Mel Carter" || nickname == "Nicole Kosloski"
    false
  end

  def to_pusher
    hash = attributes.with_indifferent_access.slice(:nickname, :link, :flavour, :id, :image_url)
    hash[:admin] = is_chat_admin?
    hash
  end

end
