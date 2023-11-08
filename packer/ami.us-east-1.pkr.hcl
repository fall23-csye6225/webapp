packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9" #Debian 12 (HVM)
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "subnet_id" {
  type    = string
  default = "subnet-08bbe8110935053cc"
}

variable "ssh_private_key_path" {
  type    = string
  default = "/path/to/your/private-key.pem"
}

source "amazon-ebs" "my-ami" {
  region   = "${var.aws_region}"
  ami_name = "csye6225_f23_${formatdate("YYYY_MM_DD_hh_mm", timestamp())}"
  //ami_name        = "cyse6225"
  ami_description = "AMI for CSYE6225"
  ami_regions     = ["us-east-1", ]
  instance_type   = "t2.micro"
  source_ami      = "${var.source_ami}"
  ssh_username    = "${var.ssh_username}"
  subnet_id       = "${var.subnet_id}"
  ami_users       = ["528663852260", ]
  tags = {
    "Name" = "csye6225_f23_${formatdate("YYYY_MM_DD_hh_mm", timestamp())}",
  }

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }



  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }

}

build {
  sources = [
    "source.amazon-ebs.my-ami",
  ]

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1",
    ]
    script = "./setup.sh"
  }

  provisioner "file" {
    source      = "./web_app_ami.zip"
    destination = "/home/admin/web_app_ami.zip"
  }

  // provisioner "shell" {
  // inline = [
  //   "sudo mkdir -p /dist/",
  //   "cp ../web_app_ami.zip /dist/web_app_ami.zip",
  // ]
  // }

  provisioner "shell" {
    script = "./app_setup.sh"
  }

  provisioner "shell" {
    script          = "./create-service.sh"
    execute_command = "chmod +x {{ .Path }}; {{ .Vars }} {{ .Path }}"
  }

  provisioner "file" {
    source      = "./cloudwatch-config.json"
    destination = "/home/admin/cloudwatch-config.json"
  }

  provisioner "shell" {
    script = "./install-cloudwatchagent.sh"
  }



}

