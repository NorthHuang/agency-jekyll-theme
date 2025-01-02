require 'yaml'

config_file = '_config.yml'
config = File.exist?(config_file) ? YAML.load_file(config_file) : {}

config['formspree_form_path'] = ENV['FORMSPREE_FORM_PATH']
config['google_recaptcha_site_key'] = ENV['GOOGLE_RECAPTCHA_SITE_KEY']
config['debug'] = ENV['DEBUG']
File.open(config_file, 'w') { |file| file.write(config.to_yaml) }
puts "Updated _config.yml with Formspree Form PATH and Google ReCAPTCHA Site Key"
