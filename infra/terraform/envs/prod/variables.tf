variable "project_id" {
  type = string
}

variable "region" {
  type    = string
  default = "europe-west1"
}

variable "service_name" {
  type    = string
  default = "healthfit"
}

variable "artifact_registry_repository_id" {
  type    = string
  default = "healthfit"
}

variable "image" {
  type = string
}

variable "service_account_email" {
  type    = string
  default = null
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
