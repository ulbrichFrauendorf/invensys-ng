param(
  [Parameter(Mandatory = $true)]
  [string]$HostName,

  [string]$User = "deploy",
  [string]$RemotePath = "/opt/integra-ng",
  [string]$Branch = "main",
  [string]$RepositoryUrl = ""
)

$ErrorActionPreference = "Stop"

$target = "${User}@${HostName}"

Write-Host "Deploying integra-ng to ${target}:${RemotePath}"

ssh $target "mkdir -p $RemotePath"
if ($RepositoryUrl) {
  ssh $target "cd $RemotePath && if [ ! -d .git ]; then git clone --branch $Branch $RepositoryUrl .; fi"
} else {
  ssh $target "cd $RemotePath && if [ ! -d .git ]; then echo 'Missing git checkout. Re-run with -RepositoryUrl <repo-url> for first deploy.' >&2; exit 2; fi"
}
ssh $target "cd $RemotePath && git fetch origin $Branch && git reset --hard origin/$Branch"
ssh $target "cd $RemotePath && docker compose up -d --build"
ssh $target "cd $RemotePath && docker image prune -f"

Write-Host "Deployment complete. Check https://integra.web.za/ and https://integra.web.za/health"
