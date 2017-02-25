class Table < ApplicationRecord
  has_many :seating_arrangements, ->{ order(:position => :asc) },  inverse_of: :table
  has_many :people, :through => :seating_arrangements
  
  @@AGE_THRESHOLD=5
  
  after_initialize do |record|
    @logger = Rails.logger
  end

  def self.valid_to_sit_between?(left_person, right_person, middle_person)
    if !middle_person.is_a?(Person)
      raise "Middle person is not a Person: #{middle_person}"
    elsif !left_person.is_a?(Person)
      raise "Left person is not a Person: #{left_person}"
    elsif !right_person.is_a?(Person)
      raise "Right person is not a Person: #{right_person}"
    end
    
    
    (left_person.age < middle_person.age ||
          right_person.age < middle_person.age) &&
          (left_person.age-middle_person.age).abs <= @@AGE_THRESHOLD &&
          (right_person.age-middle_person.age).abs <= @@AGE_THRESHOLD
  end
  
  def self.age_within_threshold?(age1,age2)
    (age1-age2).abs <= @@AGE_THRESHOLD
  end
  
  def seat_a_person(unseated_person)
    # Handle base cases

    if unseated_person.nil?
      raise 'Unseated person is missing' 
    elsif unseated_person.age.nil?
      raise 'Unseated person is missing an age'
    end

    new_seat_arrangement=false

    if !self.people.where(name: unseated_person.name, age: unseated_person.age).blank?
      raise AlreadySeatedPersonException.new(unseated_person, "Person(#{unseated_person.name}) already seated")
    end

    # First person
    if seating_arrangements.empty?
      new_seat_arrangement=seating_arrangements.create(person: unseated_person, table: self, position: 0)
      @logger.info("First person has been seated: #{unseated_person.name}(#{unseated_person.age})")
    # Second person  
    elsif seating_arrangements.count == 1 && 
      self.class.age_within_threshold?(seating_arrangements.reload.first.person.age, unseated_person.age)
      
      new_seat_arrangement=seating_arrangements.create(table: self, person: unseated_person, position: 1)
      @logger.info("Second person has been seated: #{unseated_person.name}(#{unseated_person.age})")
    # Find sandwich  
    elsif seating_arrangements.count > 1      
      for position in (1..seating_arrangements.count-1) 
        if self.class.valid_to_sit_between?(seating_arrangements[position-1].person,
                                          seating_arrangements[position].person,
                                          unseated_person)
                                          
            new_seat_arrangement=self.class.place_in_between(self,unseated_person, seating_arrangements[position-1], seating_arrangements[position])
        end
      end
      
      if !new_seat_arrangement && self.class.valid_to_sit_between?(seating_arrangements[0].person,
                                          seating_arrangements[seating_arrangements.count-1].person,
                                          unseated_person)                
          new_seat_arrangement=self.class.place_in_between(self,unseated_person, seating_arrangements[0], seating_arrangements[seating_arrangements.count-1])
      end
    end
    
    if new_seat_arrangement
      @logger.info("Person has been seated: #{unseated_person.name}(#{unseated_person.age}). Position: #{new_seat_arrangement.position}")
    else
      raise InvalidSeatingArrangementException.new(unseated_person, "Person(#{unseated_person.name}) could not be seated")
    end
  end
  
  # left_seat: left seating arrangement
  # right_seat: right seating arrangement
  def self.place_in_between(table,middle_person, left_seat, right_seat)
    target_position=right_seat.position
    
    for position in (right_seat.position)..table.seating_arrangements.count-1
      table.seating_arrangements[position].position+=1
      table.seating_arrangements[position].save!
    end
    
    table.seating_arrangements.create(table: table, person: middle_person, position: target_position)
  end
  
  def to_hash
    self_hash = {id: self.id, people: [], seating_arrangements: []}
    
    people.reload.each do |person|
      self_hash[:people] << person.to_hash
    end
    
    seating_arrangements.reload.each do |seating|
      self_hash[:seating_arrangements] << seating.to_hash
    end
    
    self_hash
  end
  
  def to_s
    to_hash.to_s
  end
end
