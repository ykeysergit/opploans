class AddPositionToSeatArrangements < ActiveRecord::Migration[5.0]
  def change
    add_column :seating_arrangements, :position, :integer
  end
end
