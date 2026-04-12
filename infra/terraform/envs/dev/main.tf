locals {
  frontend_origin = trimspace(var.frontend_origin) != "" ? trimspace(var.frontend_origin) : (
    trimspace(var.domain_name) != "" ? "https://${trimspace(var.domain_name)}" : ""
  )
}

module "app" {
  source = "../../modules/cloud_run_app"

  project_id                      = var.project_id
  region                          = var.region
  service_name                    = var.service_name
  artifact_registry_repository_id = var.artifact_registry_repository_id
  image                           = var.image
  service_account_email           = var.service_account_email

  min_instance_count = 0
  max_instance_count = 2

  env_vars = merge({
    NODE_ENV         = "production"
    PORT             = "3000"
    FRONTEND_ORIGINS = local.frontend_origin
  }, var.env_vars)

  secret_env_vars = var.secret_env_vars
}

data "google_storage_bucket" "frontend" {
  name = var.frontend_bucket_name
}

resource "google_compute_backend_bucket" "frontend" {
  name        = "${var.service_name}-frontend"
  project     = var.project_id
  bucket_name = data.google_storage_bucket.frontend.name
  enable_cdn  = true
}

resource "google_compute_region_network_endpoint_group" "api" {
  name                  = "${var.service_name}-api-neg"
  project               = var.project_id
  region                = var.region
  network_endpoint_type = "SERVERLESS"

  cloud_run {
    service = module.app.service_name
  }
}

resource "google_compute_backend_service" "api" {
  name                  = "${var.service_name}-api"
  project               = var.project_id
  protocol              = "HTTP"
  load_balancing_scheme = "EXTERNAL_MANAGED"

  backend {
    group = google_compute_region_network_endpoint_group.api.id
  }
}

resource "google_compute_url_map" "app" {
  name            = "${var.service_name}-url-map"
  project         = var.project_id
  default_service = google_compute_backend_bucket.frontend.id

  host_rule {
    hosts        = trimspace(var.domain_name) != "" ? [trimspace(var.domain_name)] : ["*"]
    path_matcher = "app-routes"
  }

  path_matcher {
    name            = "app-routes"
    default_service = google_compute_backend_bucket.frontend.id

    path_rule {
      paths   = ["/api", "/api/*"]
      service = google_compute_backend_service.api.id
    }
  }
}

resource "google_compute_global_address" "app" {
  name    = "${var.service_name}-lb-ip"
  project = var.project_id
}

resource "google_compute_managed_ssl_certificate" "app" {
  count   = trimspace(var.domain_name) != "" ? 1 : 0
  name    = "${var.service_name}-cert"
  project = var.project_id

  managed {
    domains = [trimspace(var.domain_name)]
  }
}

resource "google_compute_target_http_proxy" "http" {
  name    = "${var.service_name}-http-proxy"
  project = var.project_id
  url_map = google_compute_url_map.app.id
}

resource "google_compute_target_https_proxy" "https" {
  count            = trimspace(var.domain_name) != "" ? 1 : 0
  name             = "${var.service_name}-https-proxy"
  project          = var.project_id
  url_map          = google_compute_url_map.app.id
  ssl_certificates = [google_compute_managed_ssl_certificate.app[0].id]
}

resource "google_compute_global_forwarding_rule" "http" {
  name                  = "${var.service_name}-http"
  project               = var.project_id
  ip_protocol           = "TCP"
  port_range            = "80"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  target                = google_compute_target_http_proxy.http.id
  ip_address            = google_compute_global_address.app.id
}

resource "google_compute_global_forwarding_rule" "https" {
  count                 = trimspace(var.domain_name) != "" ? 1 : 0
  name                  = "${var.service_name}-https"
  project               = var.project_id
  ip_protocol           = "TCP"
  port_range            = "443"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  target                = google_compute_target_https_proxy.https[0].id
  ip_address            = google_compute_global_address.app.id
}
