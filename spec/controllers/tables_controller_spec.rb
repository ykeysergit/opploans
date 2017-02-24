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
  
      put :update, params: {id: empty_table.id, table: populated_table.to_hash}, :format => :json
      
      expect(response.status).to eq(200)
      expect(JSON.parse(response.body)['id']).to_not be_nil
      expect(JSON.parse(response.body)['people']).to be_an_instance_of(Array)
      expect(JSON.parse(response.body)['seating_arrangements']).to be_an_instance_of(Array)
      expect(JSON.parse(response.body)['people'].count).to eq(3)
      expect(JSON.parse(response.body)['seating_arrangements'].count).to eq(3)
      expect(JSON.parse(response.body)['people']).to include(JSON.parse(people[0].to_hash.to_json))
      expect(JSON.parse(response.body)['people']).to include(JSON.parse(people[1].to_hash.to_json))
      expect(JSON.parse(response.body)['people']).to include(JSON.parse(people[2].to_hash.to_json))
    end
  end
  
  describe 'POST #create' do
    it 'shall create a new table' do
      count_before = Table.all.count
      
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
