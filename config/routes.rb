Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  
  resources :tables, only: [:create, :show, :update, :destroy]
  resources :people, only: [:create, :show, :update, :destroy]
end
