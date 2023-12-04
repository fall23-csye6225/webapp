# webapp

## Assignment_09

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

#Command to import certificate
aws acm import-certificate --certificate fileb:///cloud_cred/ssl_cred/demo_shinycrafts_me.crt \
      --certificate-chain fileb:///cloud_cred/ssl_cred/demo_shinycrafts_me.p7b \
      --private-key fileb:///cloud_cred/ssl_cred/private.key

```

  
## Web Application Updates

### API Specification

- Implement Additional API functionalities for Submissions based on the provided SwaggerHub API specification.

### Submission Handling

- Handle POST requests for submission, allowing multiple attempts based on specified retry config.
- Reject submissions if the user exceeds retries or if the assignment deadline has passed.
  
### SNS Topic Interaction

- Post the URL to the SNS topic along with user information.

## Assignment_10

## Assignment Objectives

- Secure web application endpoints with valid SSL certificates.
- Implement CI/CD workflow for a pull request merged scenario.

## Secure Application Endpoints

### SSL Certificate Setup

- **Dev Environment:**
  - Utilize AWS Certificate Manager for SSL certificates.

- **Demo Environment:**
  - Request an SSL certificate from Namecheap.
  - Import the certificate into AWS Certificate Manager from the CLI.
