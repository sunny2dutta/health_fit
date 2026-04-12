variable "project_id" {
  type = string
}

variable "region" {
  type    = string
  default = "europe-west1"
}

variable "service_name" {
  type    = string
  default = "healthfit-dev"
}

variable "artifact_registry_repository_id" {
  type    = string
  default = "healthfit-dev"
}

variable "image" {
  type = string
}

variable "service_account_email" {
  type    = string
  default = null
}

variable "frontend_bucket_name" {
  type = string
}

variable "domain_name" {
  type    = string
  default = ""
}

variable "frontend_origin" {
  type    = string
  default = ""
}

variable "env_vars" {
  type    = map(string)
  default = {}
}

variable "secret_env_vars" {
  type = list(object({
    name      = string
    secret_id = string
    version   = optional(string, "latest")
  }))
  default = []
}
