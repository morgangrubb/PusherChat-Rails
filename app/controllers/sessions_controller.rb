class SessionsController < ApplicationController

  # Here to serve channel.html with a very long expiry time
  def channel
    response.headers["Pragma"]        = "public"
    response.headers["Cache-Control"] = "max-age=#{1.year}"
    response.headers["Expires"]       = CGI.rfc1123_date(Time.now + 1.year)
    render layout: false
  end

  def destroy
    session[:chat_user_id] = nil
    redirect_to root_path, :notice => "Signed out!"
  end

  def create
    auth = request.env["omniauth.auth"]

    chat_user = ChatUser.from_omniauth(auth)

    session[:chat_user_id] = chat_user.id

    redirect_to root_path, notice: "Signed in!"
  end

end
