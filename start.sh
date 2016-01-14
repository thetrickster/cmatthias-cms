vagrant up
#vagrant ssh -c "jekyll serve -s /vagrant -d /vagrant/_site --host 0.0.0.0"
vagrant ssh -c "cd /vagrant && bundle install && bundle exec jekyll serve -s . -d ./_site --host 0.0.0.0"
