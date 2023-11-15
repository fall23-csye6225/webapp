# webapp

## Assignment_8

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
```

## Web Application Deployment

### Load Balancer Security Group
- Create a security group for the load balancer, allowing TCP traffic on ports 80 and 443 globally.

### Update App Security Group
- Modify EC2 security group to permit TCP traffic on ports 22 and app port, and restrict internet access.

### Auto Scaling Setup
- Launch instances in an auto-scaling group (min: 1, max: 3) with CPU-based scaling policies.

### Application Load Balancer
- Balance EC2 instances in the auto-scaling group and set up an Application Load Balancer for HTTP on port 80.

### DNS Configuration
- Update Route53 to alias the domain to the load balancer, ensuring access at http://(dev|demo).your-domain-name.tld/.


