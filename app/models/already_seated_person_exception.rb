class AlreadySeatedPersonException < InvalidSeatingArrangementException
  attr_reader :person
  
  def initialize(person, message)
    super person, message
    @person=person
  end
end