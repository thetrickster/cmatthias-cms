# Install our project's needs with our Gemfile
echo ---Installing Jekyll and dependencies---
cd /srv/www/ && bundle install

# Install any dependencies with bower
echo ---Installing bower dependencies---
cd /srv/www/ && bower install

# Setup users file for local netlify-git-api
echo ---Setting up netlify-git-api .users.yml file---
if [[ ! -d '/srv/www/.users.yml' ]]; then
  cd /srv/www/ && netlify-git-api users add --name=Admin --email=admin@admin.com --password=admin
fi

# Install GulpJS
cd /home/vagrant/ && sudo npm install -g gulp
