class ChatController < ApplicationController

  layout "iframe"

  # def iframe
  #   render layout: false
  # end

  def messages
    @messages = Message.find(:all, :conditions => ["chat_id = ?", chat.id.to_s], order: "created_at DESC", limit: 25, include: :chat_user).to_a.reverse
    render layout: false
  end

  # def new
  #   chat = Chat.new
  #   chat.owner = ChatUser.user(session)
  #   if chat.save
  #     chat.channel = "message_channel_" + chat.id.to_s
  #     chat.save
  #     redirect_to :action => "view", :id => chat
  #   end
  # end

  def view
    unless params[:id].present?
      # redirect_to :controller => 'index', :action => 'index'
      Chat.find 0
    end
  end

  private

    def chat
      @chat ||= begin
        if params[:id] == "rvan"
          chat = Chat.find_or_create_by_name "rvan"
          chat.channel = "message_channel_#{chat.id}"
          chat.save
          params[:id] = chat.id
        end

        Chat.find params[:id]
      end
    end
    helper_method :chat

end
