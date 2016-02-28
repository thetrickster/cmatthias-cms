vagrant up
#vagrant ssh -c "cd /srv/www && bundle exec jekyll server --detach --watch --host 0.0.0.0"
vagrant ssh -c "cd /srv/www && gulp"
vagrant ssh -c "cd /srv/www && netlify-git-api serve --host=0.0.0.0 --port=8080"
