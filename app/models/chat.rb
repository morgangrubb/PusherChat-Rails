class Chat < ActiveRecord::Base

  has_many :messages, dependent: :destroy

  def to_param
    "#{id}-#{name.parameterize}"
  end

  def to_s
    name
  end

end
