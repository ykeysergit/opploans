require 'rails_helper'

describe TablesController do
  let(:empty_table){
    Table.create
  }
  
  let(:people){
    [
      Person.create(name: 'Age20', age: 20),
      Person.create(name: 'Age17', age: 17),
      Person.create(name: 'Age22', age: 22)
    ]
  }
  
  let(:populated_table){
    people.each do |person|
      empty_table.seat_a_person(person)  
    end
    
    empty_table
  }
  
  describe 'PUT #update' do
    it 'shall update an existing table' do
      expect(populated_table.people.count).to eq(3)
  
      update_hash = populated_table.to_hash
      populated_table.people.clear
      populated_table.seating_arrangements.clear
      
      put :update, params: {id: populated_table.id, table: update_hash}, :format => :json
      
      expect(response.status).to eq(200)
      expect(JSON.parse(response.body)['id']).to_not be_nil
      expect(JSON.parse(response.body)['people']).to be_an_instance_of(Array)
      expect(JSON.parse(response.body)['seating_arrangements']).to be_an_instance_of(Array)
      expect(JSON.parse(response.body)['people'].count).to eq(2)
      expect(JSON.parse(response.body)['seating_arrangements'].count).to eq(2)

      found_first_person = JSON.parse(response.body)['people'].find do |found_person|
        found_person['name'] == people[0].name && found_person['age'].to_i == people[0].age 
      end
      
      found_second_person = JSON.parse(response.body)['people'].find do |found_person|
        found_person['name'] == people[2].name && found_person['age'].to_i == people[2].age 
      end
      
      expect(found_first_person).to_not be_nil
      expect(found_second_person).to_not be_nil
    end
  end
  
  describe 'POST #create' do
    it 'shall create a new table' do
      count_before = Table.count
      
      post :create, :format => :json
      
      expect(response.status).to eq(200)
      expect(JSON.parse(response.body)['id']).to_not be_nil
      expect(JSON.parse(response.body)['people'].empty?).to be true
      expect(JSON.parse(response.body)['seating_arrangements'].empty?).to be true
      
      count_after = Table.all.count
      expect(count_after-count_before).to eq(1)
    end
  end
end
