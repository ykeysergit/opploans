require 'rails_helper'

describe Table do
  let(:table){
    Table.create
  }
  
  let(:first_person){
    Person.create(name: 'Age15', age: 15)
  }
  
  
    
    
  describe 'when first person sits' do
    it 'then that person will be seated' do
      table.seat_a_person(first_person)
      expect(table.seating_arrangements.count).to eql(1)
      expect(table.seating_arrangements.first.person).to eql(first_person)
    end
  end
  
  describe 'when second person sits next to first person' do
    let(:second_person){
        Person.create(name: 'Age17', age: 17)
    }
    
    describe 'and is not within the age threshold' do
      let(:invalid_person){
        second_person.age=40
        second_person
      }
      
      it 'then that person will not be seated' do
        table.seat_a_person(first_person)
        
        expect{table.seat_a_person(invalid_person)}.to raise_error(InvalidSeatingArrangementException)
        expect(table.seating_arrangements.count).to eql(1)
        expect(table.seating_arrangements.first.person).to eql(first_person)     
      end
    end
    
    describe 'and within age threshold' do
      let(:second_person){
        Person.create(name: 'Age17', age: 17)
      }
      
      it 'then that person will be seated' do
        table.seat_a_person(first_person)
        table.seat_a_person(second_person)
        expect(table.seating_arrangements.count).to eql(2)
        expect(table.seating_arrangements.first.person).to eql(first_person)       
        expect(table.seating_arrangements.second.person).to eql(second_person)       
      end
    end
  end
  
  describe 'when third person wants to sit' do
    let(:second_person){
        Person.create(name: 'Age17', age: 17)
    }
    
    let(:third_person){
        Person.create(name: 'age20', age: 20)
    }
  
    describe 'and third person is youngest' do
      let(:first_person){
        Person.create(name: 'Age20', age: 20)
      }
      
      let(:second_person){
         Person.create(name: 'Age22', age: 22)
      }
      
      let(:third_person){
        Person.create(name: 'age17', age: 17)
      }
      
      it 'then the third person will not be seated' do
        table.seat_a_person(first_person)
        table.seat_a_person(second_person)
        
        expect{table.seat_a_person(third_person)}.to raise_error(InvalidSeatingArrangementException)
      end
    end
    
    describe 'and when exceeds the age difference threshold' do
      let(:third_person){
        Person.create(name: 'age40', age: 40)
      }
      
      it 'then that person will not be seated' do
        table.seat_a_person(first_person)
        table.seat_a_person(second_person)
        
        expect{table.seat_a_person(third_person)}.to raise_error(InvalidSeatingArrangementException)
        
        table.seating_arrangements.reload
        expect(table.seating_arrangements.count).to eql(2)
        expect(table.seating_arrangements.first.person).to eql(first_person)
        expect(table.seating_arrangements.second.person).to eql(second_person)
      end
    end
    
    describe 'and may be sandwiched between the first two people' do
      it 'then that person will be seated' do
        table.seat_a_person(first_person)
        table.seat_a_person(second_person)
        table.seat_a_person(third_person)
        
        table.seating_arrangements.reload
        expect(table.seating_arrangements.count).to eql(3)
        expect(table.seating_arrangements.first.person).to eql(first_person)
        expect(table.seating_arrangements.second.person).to eql(third_person)
        expect(table.seating_arrangements.third.person).to eql(second_person)
      end
    end
  end
end
