# webapp

## Assignment_5

Command to copy the zip file to server

scp -i .ssh/privatekeyfile $zipfile.zip root@$IPAddress/opt

ssh -i .ssh/privatekeyfile root@$IPAddress

Installing Dependencies
```bash
$ sudo apt update
$ sudo apt install -y mariadb-server
$ sudo apt install -y nodejs
$ node -v
$ sudo apt-get install -y  npm
$ npm -v
$ sudo apt-get install -y unzip

#Database creation:
$ ALTER USER 'root'@'localhost' IDENTIFIED BY '%PASSWORD';
$ FLUSH PRIVILEGES;
$ CREATE DATABASE assignmentdb;

$ show databases;


## Packer Commands
packer init
packer fmt .
packer validate .

