require 'rails_helper'

describe PeopleController do
  let(:person){
      Person.create(name: "John", age: 30)
    }
    
  describe 'GET #index' do
    it 'shall get all people' do
      person
      get :index
      
      expect(JSON.parse(response.body)).to be_an_instance_of(Array)
      
      all_people = JSON.parse(response.body)
      
      expect(all_people.count).to eq(1)
      expect(all_people.first['name']).to eq(person.name)
      expect(all_people.first['age'].to_i).to eq(person.age)
    end
  end
    
  describe 'DELETE #destroy' do
    describe 'when the person exists' do
      it 'shall delete the person' do
        expect(Person.find_by(name: person.name, age: person.age)).to_not be_nil
        
        delete :destroy, params: {id: person.id}, :format => :json
        
        expect(response.status).to eq(200)
        expect(JSON.parse(response.body)['name']).to eq(person.name)
        expect(JSON.parse(response.body)['age']).to eq(person.age)
        
        foundPerson = Person.find_by(name: person.name, age: person.age)
        
        expect(foundPerson).to be_nil
      end
    end
  end
  
  describe 'PUT #update' do
    describe 'when the person exists' do
      it 'shall update the person' do
        put :update, params: {id: person.id, person:{name: person.name, age: 31}}, :format => :json
        
        expect(response.status).to eq(200)
        expect(JSON.parse(response.body)['name']).to eq(person.name)
        expect(JSON.parse(response.body)['age']).to eq(31)
        
        foundPerson = Person.find_by(name: person.name, age: 31)
        
        expect(foundPerson).to_not be_nil
        expect(foundPerson.name).to eq(person.name)
        expect(foundPerson.age).to eq(31)
      end
    end
  end
  
  describe 'POST #create' do
    describe 'when the person exists' do
      it 'shall create the person' do
        post :create, params: {person: {age: person.age, name: person.name}}, :format => :json
        
        expect(response.status).to eq(200)
        expect(JSON.parse(response.body)['name']).to eq(person.name)
        expect(JSON.parse(response.body)['age']).to eq(person.age)
        
        foundPerson = Person.find_by(name: person.name, age: person.age)
        
        expect(foundPerson).to_not be_nil
        expect(foundPerson.name).to eq(person.name)
        expect(foundPerson.age).to eq(person.age)
      end
    end
  end
  
  describe 'GET #show' do
    describe 'when the person exists' do
      it 'shall show the person' do
        get :show, params: {id: person.id}, :format => :json
        
        expected_json = {'id' => person.id, 'name' => person.name, 'age' => person.age}
        
        expect(JSON.parse(response.body)).to eq(expected_json)
      end
    end
    
    describe 'when the person does not exist' do
      it 'shows 404' do
        get :show, {id: -1}, :format => :json
        expect(response.status).to eq(404)
        expect(JSON.parse(response.body).empty?).to be true
      end
    end
  end
end
