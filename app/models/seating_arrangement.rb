class SeatingArrangement < ApplicationRecord
  belongs_to :person, inverse_of: :seating_arrangements
  belongs_to :table, inverse_of: :seating_arrangements
  
  def to_s
    "#{person}"
  end
end
