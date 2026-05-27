variable "docker_host" {
  type        = string
}

variable "docker_user" {
  type        = string
  default     = "root"
}

variable "image_tag" {
  type        = string
  default     = "latest"
}

variable "r2_endpoint" {
  description = "Cloudflare R2 S3 endpoint"
  type        = string
  sensitive   = true
}

variable "r2_access_key" {
  description = "Cloudflare R2 Access Key ID"
  type        = string
  sensitive   = true
}

variable "r2_access_secret" {
  description = "Cloudflare R2 Secret Access Key"
  type        = string
  sensitive   = true
}