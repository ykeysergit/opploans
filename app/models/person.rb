class Person < ApplicationRecord
  has_many :seating_arrangements, inverse_of: :person
  has_many :tables, :through => :seating_arrangements
  
  def to_s
    "#{name}(#{age})"
  end
end
