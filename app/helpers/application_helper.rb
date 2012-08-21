module ApplicationHelper

  def auto_link_urls(message)
    message.gsub(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i, "<a href='\\1' target='_blank'>\\1</a>".html_safe).html_safe
  end

end
