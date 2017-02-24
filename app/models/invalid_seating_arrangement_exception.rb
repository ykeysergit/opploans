class InvalidSeatingArrangementException < RuntimeError
  attr_reader :person
  
  def initialize(person, message)
    super message
    @person=person
  end
end