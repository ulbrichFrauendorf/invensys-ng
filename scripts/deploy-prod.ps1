param(
  [Parameter(Mandatory = $true)]
  [string]$HostName,

  [string]$User = "github-actions",
  [string]$RemotePath = "/home/github-actions/sites/invensys-ng",
  [string]$AppName = "invensys-ng",
  [string]$WebPort = "8083",
  [string]$Branch = "main",
  [string]$RepositoryUrl = ""
)

$ErrorActionPreference = "Stop"

$target = "${User}@${HostName}"

Write-Host "Deploying invensys-ng to ${target}:${RemotePath}"

ssh $target "mkdir -p $RemotePath"
if ($RepositoryUrl) {
  ssh $target "cd $RemotePath && if [ ! -d .git ]; then git clone --branch $Branch $RepositoryUrl .; fi"
} else {
  ssh $target "cd $RemotePath && if [ ! -d .git ]; then echo 'Missing git checkout. Re-run with -RepositoryUrl <repo-url> for first deploy.' >&2; exit 2; fi"
}
ssh $target "cd $RemotePath && git fetch origin $Branch && git reset --hard origin/$Branch"
ssh $target "cd $RemotePath && COMPOSE_PROJECT_NAME=$AppName DEPLOY_APP_NAME=$AppName DEPLOY_WEB_PORT=$WebPort docker compose up -d --build --remove-orphans"
ssh $target "cd $RemotePath && COMPOSE_PROJECT_NAME=$AppName DEPLOY_APP_NAME=$AppName DEPLOY_WEB_PORT=$WebPort docker compose ps"
ssh $target "for i in `$(seq 1 60); do if curl -fsS http://127.0.0.1:$WebPort/health >/dev/null 2>&1; then echo 'App health check passed'; exit 0; fi; sleep 5; done; echo 'App health check failed'; exit 1"
ssh $target "cd $RemotePath && docker image prune -f"

Write-Host "Deployment complete. Check the configured public site and /health endpoint."
