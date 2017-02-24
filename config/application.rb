require_relative 'boot'

require 'rails/all'
require 'log4r'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module CircularTable
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    
     
    custom_logger = Log4r::Logger.new 'circular-table'
    custom_logger.outputters = Log4r::Outputter.stdout

    Rails.logger=custom_logger
    config.log_level = :warn
  end
end
