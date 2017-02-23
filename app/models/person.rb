class Person < ApplicationRecord
  has_many :seating_arrangements, inverse_of: :person
  has_many :tables, :through => :seating_arrangements
  
  def to_s
    "#{name}(#{age})"
  end
  
  def to_hash
    {id: id, name: name, age: age}
  end
end
