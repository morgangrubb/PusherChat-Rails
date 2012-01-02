class ChatController < ApplicationController

  layout "iframe"

  def iframe
    render layout: false
  end

  def new
    chat = Chat.new
    chat.owner = ChatUser.user(session)
    if chat.save
      chat.channel = "message_channel_" + chat.id.to_s
      chat.save
      redirect_to :action => "view", :id => chat
    end
  end

  def view

    if params[:id].present?
      if params[:id] == "rvan"
        chat = Chat.find_or_create_by_name "rvan"
        chat.channel = "message_channel_#{chat.id}"
        chat.save
        params[:id] = chat.id
      end

      @chat = Chat.find params[:id]
      @messages = Message.find(:all, :conditions => ["chat_id = ?", @chat.id.to_s], order: "created_at DESC", limit: 25).to_a.reverse
    else
      redirect_to :controller => 'index', :action => 'index'
    end

  end

end
