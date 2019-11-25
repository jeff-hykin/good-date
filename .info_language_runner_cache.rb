require 'atk_toolbox'

system "_ build"
previous_process_finished_successfully = $?.success?
if previous_process_finished_successfully
    system "project sync"
    system "npm version patch && npm publish"
end
