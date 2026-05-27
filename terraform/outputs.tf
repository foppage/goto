output "container_name" {
  value = docker_container.goto.name
}

output "image_digest" {
  value = data.docker_registry_image.goto.sha256_digest
}

output "image_tag" {
  value = var.image_tag
}
