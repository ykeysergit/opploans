class SeatingArrangement < ApplicationRecord
  belongs_to :person, inverse_of: :seating_arrangements
  belongs_to :table, inverse_of: :seating_arrangements
  
  def to_hash
    {id: id, person: person, table_id: table.id, position: position}
  end
  
  def to_s
    to_hash.to_s
  end
end
