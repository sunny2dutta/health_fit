module "app" {
  source = "../../modules/cloud_run_app"

  project_id            = var.project_id
  region                = var.region
  service_name          = var.service_name
  artifact_registry_repository_id = var.artifact_registry_repository_id
  image                 = var.image
  service_account_email = var.service_account_email

  min_instance_count = 1
  max_instance_count = 5

  env_vars = merge({
    NODE_ENV = "production"
    PORT     = "3000"
  }, var.env_vars)

  secret_env_vars = var.secret_env_vars
}
