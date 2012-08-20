class SessionsController < ApplicationController

  # Here to serve channel.html with a very long expiry time
  def channel
    response.headers["Pragma"]        = "public"
    response.headers["Cache-Control"] = "max-age=#{1.year}"
    response.headers["Expires"]       = CGI.rfc1123_date(Time.now + 1.year)
    render layout: false
  end

  def create
    _user   = ChatUser.where(facebook_user_id: params[:user][:id]).first
    _user ||= ChatUser.create facebook_user_id: params[:user][:id]
    _user.update_from_facebook params[:user]

    session[:user_id] = _user.id

    render json: {
      user_id: _user.id
    }
  end

end
