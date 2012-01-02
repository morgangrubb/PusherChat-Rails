class SessionsController < ApplicationController

  # Here to serve channel.html with a very long expiry time
  def channel
    response.headers["Pragma"]        = "public"
    response.headers["Cache-Control"] = "max-age=#{1.year}"
    response.headers["Expires"]       = CGI.rfc1123_date(Time.now + 1.year)
    render layout: false
  end

  def create
    user = ChatUser.find_or_create_by_facebook_user_id params[:user][:id]
    user.update_from_facebook params[:user]

    session[:user_id] = user.id

    render json: {
      redirect: "/chat/rvan"
    }
  end

end
