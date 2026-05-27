terraform {
  backend "s3" {
    bucket = "goto"
    key    = "terraform.tfstate"
    region = "auto"

    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
    use_path_style              = true

    access_key = var.r2_access_key
    secret_key = var.r2_access_secret
    endpoints = { s3 = var.r2_endpoint }
  }

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = "ssh://${var.docker_user}@${var.docker_host}"
}

data "docker_registry_image" "goto" {
  name = "git.june.pet/june/goto:${var.image_tag}"
}

resource "docker_image" "goto" {
  name          = data.docker_registry_image.goto.name
  pull_triggers = [data.docker_registry_image.goto.sha256_digest]
  keep_locally  = true

  triggers = {
    sha256 = data.docker_registry_image.goto.sha256_digest
  }
}

resource "docker_volume" "app_data" {
  name = "app-data"
  lifecycle {
    prevent_destroy = true
  }
}

resource "docker_container" "goto" {
  name  = "goto"
  image = docker_image.goto.image_id

  ports {
    internal = 6020
    external = 6020
  }

  volumes {
    volume_name    = docker_volume.app_data.name
    container_path = "/app/db"
  }

  restart = "always"
}
