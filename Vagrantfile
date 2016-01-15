Vagrant.configure(2) do |config|
  vagrant_version = Vagrant::VERSION.sub(/^v/, '')
  config.vm.box = "ubuntu/trusty64"
  config.vm.provision :shell, path: "provision.sh", privileged: false
  config.vm.provision :shell, path: "project.sh", privileged: false
  config.vm.provision :file, source: "~/.gitconfig", destination: ".gitconfig"

  # Jekyll dev port
  config.vm.network "forwarded_port", guest: 4000, host: 4000, auto_correct: true
  # Netlify CMS Git API for authentication port
  config.vm.network "forwarded_port", guest: 4080, host: 4080, auto_correct: true

  if vagrant_version >= "1.3.0"
    config.vm.synced_folder "./", "/srv/www", create: true, :owner => "vagrant", :mount_options => [ "dmode=775", "fmode=774" ]
  else
    config.vm.synced_folder "./", "/srv/www", create: true, :owner => "vagrant", :extra => 'dmode=775,fmode=774'
  end
  # config.vm.synced_folder ".", "/vagrant", type: "rsync", rsync__exclude: ".git/"

  # VirtualBox-specific configuration
  config.vm.provider "virtualbox" do |v|
    v.customize ["modifyvm", :id, "--memory", 512]
    v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    v.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
  end

  config.ssh.forward_agent = true

end
