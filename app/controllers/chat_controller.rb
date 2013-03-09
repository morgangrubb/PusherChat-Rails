class ChatController < ApplicationController

  before_filter :ensure_permissions!

  layout "iframe"

  def messages
    scope = Message.scoped(conditions: ["chat_id = ?", chat.id.to_s], order: "created_at DESC", limit: 25, include: :chat_user)

    if params[:earliest_message_id].present?
      scope = scope.scoped(conditions: ["messages.id < ?", params[:earliest_message_id]])
    end

    messages = scope.find(:all).to_a.reverse

    messages.collect! do |message|
      payload = message.attributes
      payload[:user] = message.chat_user.attributes
      payload[:user][:image] = message.chat_user.image_url
      payload[:created_at_formatted] = message.created_at.in_time_zone("Pacific Time (US & Canada)").to_s(:short)
      payload
    end

    render json: messages
  end

  def view
    unless params[:id].present?
      # redirect_to :controller => 'index', :action => 'index'
      Chat.find 0
    end
  end

  private

    def chat
      @chat ||= begin
        if params[:id] =~ /^[\d]+$/
          Chat.find params[:id]
        else
          raise "Got a string"
          # chat = Chat.find_or_create_by_name params[:id]
          # chat.channel = "message_channel_#{chat.id}"
          # chat.save
          # chat
        end
      end
    end
    helper_method :chat

    def ensure_permissions!
      # TODO: Check that the user hasn't been banned from a chat room, etc.
      redirect_to "/login" unless current_user?
    end

end
