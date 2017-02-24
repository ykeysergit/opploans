class TablesController < ApplicationController
  before_action :init_logger
  protect_from_forgery with: :null_session
  
  def init_logger
    @logger = Rails.logger
  end
  
  def create
    render json: Table.create.to_hash
  end
  
  def show
    process_if_table_found do |foundTable|
      render json: foundTable.to_hash
    end
  end
  
  def update
    process_if_table_found do |foundTable|
      update_people(foundTable, params[:table][:people]) if params[:table] && params[:table][:people]
      render json: foundTable.to_hash
    end
  end
  
  def destroy
    process_if_table_found do |foundTable|
      foundTable.destroy
      render json: foundTable.to_hash
    end
  end
  
  protected

  def update_people(foundTable, people)
    people.each do |person|
      begin
        unseated_person = Person.new
        
        unseated_person.name=person['name']
        unseated_person.age=person['age'].to_i
        foundTable.seat_a_person(unseated_person)
      rescue InvalidSeatingArrangementException => e
        @logger.info("Message: #{e.message}. Not seated: #{e.person}")
      rescue AlreadySeatedPersonException => e
        @logger.info("Message: #{e.message}. Not seated: #{e.person}")
      end 
    end
  end

  def process_if_table_found
    foundTable=Table.find_by(id: params[:id].to_i)
    
    if foundTable
      yield foundTable
    else
      render json:{}, status: :not_found
    end
  end
end
