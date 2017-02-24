class TablesController < ApplicationController
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
      update_people(params[:table][:people]) if params[:table] && params[:table][:people]
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

  def update_people(people)
    
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
