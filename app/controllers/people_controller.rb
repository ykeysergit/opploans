class PeopleController < ApplicationController
  def create
    render json: Person.create(name: params[:person][:name], age: params[:person][:age].to_i).to_hash
  end
  
  def show
    process_if_person_found do |foundPerson|
      render json: foundPerson.to_hash
    end
  end
  
  def update
    process_if_person_found do |foundPerson|
      foundPerson.update(name: params[:person][:name], age: params[:person][:age].to_i) 
      render json: foundPerson.to_hash
    end
  end
  
  def destroy
    process_if_person_found do |foundPerson|
      foundPerson.destroy
      render json: foundPerson.to_hash
    end
  end
  
  protected

  def process_if_person_found
    foundPerson=Person.find_by(id: params[:id].to_i)
    
    if foundPerson
      yield foundPerson
    else
      render json:{}, status: :not_found
    end
  end
end
