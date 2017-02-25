class TablesController < ApplicationController
  before_action :init_logger
  protect_from_forgery with: :null_session
  
  def index
    all_tables=Table.all.collect do |table|
      table.to_hash
    end
    
    render json: all_tables
  end
  
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
      error_messages = update_people(foundTable, params[:table][:people]) if params[:table] && params[:table][:people]
      result_hash = foundTable.to_hash
      result_hash[:errors]=error_messages
      render json: result_hash
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
    @logger.info("People to update: #{people.count}")
    
    error_messages=[]
    
    people.each do |person|
      begin
        unseated_person = Person.find_by(id: person['id'].to_i)
        unseated_person = Person.create(name: person['name'], age: person['age'].to_i) if unseated_person.nil?

        foundTable.seat_a_person(unseated_person)
      rescue InvalidSeatingArrangementException => e
        error_msg = "#{e.message}. Person: #{e.person}. Table: #{foundTable}"
        @logger.info error_msg
        error_messages << error_msg
      end 
    end
    
    error_messages
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
