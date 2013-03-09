class ApplicationController < ActionController::Base

  # Need to include this in any post requests.
  # protect_from_forgery

  before_filter { response.headers['P3P'] = %q|CP="HONK"| }

  helper_method :current_user
  helper_method :current_user?

  private

    def current_user
      @current_user ||= ChatUser.find(session[:chat_user_id]) if session[:chat_user_id]
    end

    def current_user?
      current_user.present?
    end

end
