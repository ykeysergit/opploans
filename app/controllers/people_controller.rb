class PeopleController < ApplicationController
  def create
    render json: Person.create(person_params)
  end
  
  def show
    process_if_person_found do |foundPerson|
      render json: foundPerson
    end
  end
  
  def update
    process_if_person_found do |foundPerson|
      foundPerson.update(name: person_params[:name], age: person_params[:age]) 
      render json: foundPerson
    end
  end
  
  def destroy
    process_if_person_found do |foundPerson|
      foundPerson.destroy
    end
  end
  
  protected
  def person_params
    params.require(:person).permit(:id,:name,:age)
  end
  
  def process_if_person_found
    foundPerson=Person.find_by(id: person_params[:id].to_i)
    
    if foundPerson
      yield foundPerson
    else
      render status: :not_found
    end
  end
end
