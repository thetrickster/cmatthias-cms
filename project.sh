# Install our project's needs with our Gemfile
cd /srv/www/ && bundle install

# Setup users file for local netlify-git-api
echo ---Setting up netlify-git-api .users.yml file---
if [[ ! -d '/srv/www/.users.yml' ]]; then
  cd /srv/www/ && netlify-git-api users add --name=Admin --email=admin@admin.com --password=admin
fi
