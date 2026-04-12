variable "project_id" {
  description = "Google Cloud project ID."
  type        = string
}

variable "region" {
  description = "Google Cloud region for Cloud Run."
  type        = string
}

variable "service_name" {
  description = "Cloud Run service name."
  type        = string
}

variable "artifact_registry_repository_id" {
  description = "Artifact Registry repository ID for the service image."
  type        = string
}

variable "image" {
  description = "Container image to deploy."
  type        = string
}

variable "container_port" {
  description = "Container port exposed by the application."
  type        = number
  default     = 3000
}

variable "allow_unauthenticated" {
  description = "Whether to allow public access to the Cloud Run service."
  type        = bool
  default     = true
}

variable "ingress" {
  description = "Cloud Run ingress setting."
  type        = string
  default     = "INGRESS_TRAFFIC_ALL"
}

variable "cpu" {
  description = "CPU limit for the container."
  type        = string
  default     = "1"
}

variable "memory" {
  description = "Memory limit for the container."
  type        = string
  default     = "512Mi"
}

variable "min_instance_count" {
  description = "Minimum number of instances."
  type        = number
  default     = 0
}

variable "max_instance_count" {
  description = "Maximum number of instances."
  type        = number
  default     = 2
}

variable "service_account_email" {
  description = "Optional runtime service account email."
  type        = string
  default     = null
}

variable "env_vars" {
  description = "Plain environment variables."
  type        = map(string)
  default     = {}
}

variable "secret_env_vars" {
  description = "Secret Manager-backed environment variables."
  type = list(object({
    name      = string
    secret_id = string
    version   = optional(string, "latest")
  }))
  default = []
}
