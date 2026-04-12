# Terraform Scaffold

This directory adds the first real Terraform-as-Code structure for the repo.

Current scope:
- Google Cloud Run service
- Artifact Registry repository
- Required Google APIs
- Environment-specific entrypoints for `dev` and `prod`
- Support for plain env vars and Secret Manager-backed env vars

Current limitation:
- Secret Manager secrets must already exist
- The Terraform backend bucket must already exist
- The workflow injects image tags at deploy time, so local `terraform apply` still needs an `image` value

Recommended next steps:
1. Create a GCS bucket for Terraform state
2. Add the required GitHub Actions secrets
3. Build and push images in CI
4. Point Terraform envs at immutable image tags

Suggested structure:

```text
infra/terraform/
  modules/
    cloud_run_app/
  envs/
    dev/
    prod/
```

Quick start:

```bash
cd infra/terraform/envs/dev
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
```
