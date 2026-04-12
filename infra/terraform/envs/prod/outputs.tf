output "service_name" {
  value = module.app.service_name
}

output "artifact_registry_repository_url" {
  value = module.app.artifact_registry_repository_url
}

output "service_uri" {
  value = module.app.service_uri
}

output "frontend_bucket_name" {
  value = data.google_storage_bucket.frontend.name
}

output "load_balancer_ip" {
  value = google_compute_global_address.app.address
}

output "domain_name" {
  value = var.domain_name
}
