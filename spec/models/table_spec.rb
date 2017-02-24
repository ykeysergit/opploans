require 'rails_helper'

describe Table, type: :model do
  let(:table){
    Table.create
  }
  
  let(:first_person){
    p=Person.new
    p.name="John"
    p.age=30
    p
  }
  
  let(:second_person){
      p=Person.new
      p.name="Tom"
      p
    }
    
  let(:third_person){
      p=Person.new
      p.name="Joe"
      p
    }
  
  describe 'when first person sits' do
    it 'then that person will be seated' do
      table.seat_a_person(first_person)
      expect(table.seating_arrangements.count).to eql(1)
      expect(table.seating_arrangements.first.person).to eql(first_person)
    end
  end
  
  describe 'when second person sits next to first person' do
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
      let(:valid_person){
        second_person.age=25
        second_person
      }
      
      it 'then that person will be seated' do
        table.seat_a_person(first_person)
        table.seat_a_person(valid_person)
        expect(table.seating_arrangements.count).to eql(2)
        expect(table.seating_arrangements.first.person).to eql(first_person)       
        expect(table.seating_arrangements.second.person).to eql(valid_person)       
      end
    end
  end
  
  describe 'when third person wants to sit' do
    describe ' and exceeds the age difference threshold' do
      let(:invalid_person){
        third_person.age=40
        third_person
      }
      
      let(:second_person){
        p=Person.new
        p.name="Mike"
        p.age=25
        p
      }
      
      it 'then that person will not be seated' do
        table.seat_a_person(first_person)
        table.seat_a_person(second_person)
        
        expect{table.seat_a_person(invalid_person)}.to raise_error(InvalidSeatingArrangementException)
        
        table.seating_arrangements.reload
        expect(table.seating_arrangements.count).to eql(2)
        expect(table.seating_arrangements.first.person).to eql(first_person)
        expect(table.seating_arrangements.second.person).to eql(second_person)
      end
    end
    
    describe ' and may be sandwiched between the first two people' do
      let(:valid_person){
        third_person.age=28
        third_person
      }
      
      let(:second_person){
        p=Person.new
        p.name="Mike"
        p.age=25
        p
      }
      
      it 'then that person will be seated' do
        table.seat_a_person(first_person)
        table.seat_a_person(second_person)
        table.seat_a_person(valid_person)
        
        table.seating_arrangements.reload
        expect(table.seating_arrangements.count).to eql(3)
        expect(table.seating_arrangements.first.person).to eql(first_person)
        expect(table.seating_arrangements.second.person).to eql(valid_person)
        expect(table.seating_arrangements.third.person).to eql(second_person)
      end
    end
  end
end
