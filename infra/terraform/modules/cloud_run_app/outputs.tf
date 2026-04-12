output "service_name" {
  description = "Cloud Run service name."
  value       = google_cloud_run_v2_service.app.name
}

output "artifact_registry_repository_url" {
  description = "Artifact Registry repository base URL."
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.app.repository_id}"
}

output "service_uri" {
  description = "Cloud Run service URL."
  value       = google_cloud_run_v2_service.app.uri
}
