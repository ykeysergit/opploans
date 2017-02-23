class CreatePeopleTableManyToMany < ActiveRecord::Migration[5.0]
  def change
     create_table :seating_arrangements do |t|
      t.belongs_to :person, index: true
      t.belongs_to :table, index: true
      t.references :person_left, index: true
      t.references :person_right, index: true
      t.timestamps
    end
  end
end
