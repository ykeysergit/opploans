class AlreadySeatedPersonException < RuntimeError
  attr_reader :person
  
  def initialize(person, message)
    super message
    @person=person
  end
end