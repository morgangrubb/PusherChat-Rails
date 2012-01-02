class ApplicationController < ActionController::Base

  before_filter { response.headers['P3P'] = %q|CP="HONK"| }

  private

    def user
      @user ||= ChatUser.find session[:user_id]
    end
    helper_method :user

end
