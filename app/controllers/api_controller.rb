class ApiController < ApplicationController

  before_filter :ensure_permissions!
  before_filter :ensure_chat_token!, only: [:typing_status, :post_message]

  def post_message
    chat = Chat.find(params[:chat_id])
    message = Message.new
    message.chat_id = chat.id

    message.user_id = current_user.id
    message.message = params[:message]

    if message.save
      payload         = message.attributes
      payload[:user]  = current_user.attributes
      payload[:created_at_formatted] = message.timestamp

      Pusher["presence-" + chat.channel].trigger('send_message', payload)
      render :text => "sent"
    else
      render :text => "failed"
    end
  end

  def typing_status
    if params[:chat_id] != nil && params[:status] != nil
      chat = Chat.find(params[:chat_id])

      payload = { user: current_user.attributes, status: params[:status] }
      Pusher["presence-" + chat.channel].trigger('typing_status', payload)
    end
    render :text => ""
  end

  def authenticate
    if params[:user_id] == current_user.id.to_s
      auth = Pusher[params[:channel_name]].authenticate(params[:socket_id],
        user_id:   current_user.id,
        user_info: current_user.attributes
      )
      render :json => auth
    else
      render text: "Something something that's what she said."
    end
  end

  private

    def ensure_permissions!
      # TODO: Check that the user hasn't been banned from a chat room, etc.
      redirect_to "/login" unless current_user?
    end

    def ensure_chat_token!
      render nothing: true unless params[:token] == chat_user_token
    end

end
