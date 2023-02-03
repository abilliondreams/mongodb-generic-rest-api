echo 'Deploying K8S on GCP'
terraform init
terraform plan
terraform apply  -auto-approve 
$ helm repo add istio https://istio-release.storage.googleapis.com/charts
