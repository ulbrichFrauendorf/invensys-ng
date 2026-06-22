# integra-ng

A comprehensive Angular component library containing reusable UI components, directives, services, and themes.

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.0.

## Components

The library includes the following components:

- **Button** - Customizable button component with various severity levels
- **Card** - Card layout component for displaying content
- **Checkbox** - Checkbox input component
- **Chip** - Chip/tag component for displaying labels
- **Confirmation Dialog** - Dialog component for user confirmations
- **Dialog** - Base dialog component for modal interactions
- **Empty State** - Component for displaying empty state UI
- **Empty State Table** - Empty state component specifically for tables
- **Input Text** - Text input component
- **Listbox** - Listbox selection component
- **Multi-Select** - Multi-select dropdown component
- **Radio Button** - Radio button component for single selection
- **Select** - Single select dropdown component
- **Tree View** - Hierarchical tree view component
- **Whisper** - Tooltip/whisper component

## Getting Started

### Development

To view and test the components in the UI Kit showcase:

```bash
npm install

npm run start
```

This will launch the ui-kit project at `http://localhost:4200/` where you can see all available components and their usage examples.

### Code Scaffolding

To generate a new component:

```bash
ng generate component component-name --project integra-ng
```

You can also generate other artifacts:

```bash
ng generate directive|pipe|service|class|guard|interface|enum|module --project integra-ng
```

> Note: Always include `--project integra-ng` or the artifact will be added to the default project in your `angular.json` file.

## Build

To build the library:

```bash
ng build integra-ng
```

The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library:

```bash
cd dist/integra-ng
npm publish
```

## Running Unit Tests

To execute the unit tests via [Karma](https://karma-runner.github.io):

```bash
ng test integra-ng
```

## Further Help

For more information about the Angular CLI, use:

```bash
ng help
```

Or visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
# Integra NG

## Production Docker Deployment

Integra NG is deployed as a Dockerized app with:

- Angular UI kit static files served by nginx inside the container.
- The integra-ng MCP server running as a Node sidecar inside the same container.
- Host nginx terminating TLS and reverse proxying public traffic to the container.

The container listens on `127.0.0.1:8083` on the host by default. The public domain, such as `https://integra.web.za`, should be served by host nginx.

### Shared Server Port Allocation

All apps can keep their internal container port as `8080`, but each app must bind to a different host localhost port.

Recommended host port allocation:

```text
integraflow  keep existing port
integra-ng   127.0.0.1:8083
itrace       127.0.0.1:8082
iserve       choose an unused localhost port
```

Host nginx should route each public domain to the correct localhost port. This avoids Docker port collisions while keeping every app private behind nginx.

### Production Build

The production build now builds both Angular projects and generates the static MCP catalog:

```bash
npm run build
```

This creates:

```text
dist/ui-kit
dist/integra-ng
dist/mcp/integra-ng-catalog.json
```

The Docker image builds these artifacts internally, so production deploys do not need `dist` committed to Git.

### Local Docker Run

Build and run the production container locally:

```bash
docker compose up -d --build
```

Then check:

```bash
curl http://127.0.0.1:8083/
curl http://127.0.0.1:8083/health
curl -X POST http://127.0.0.1:8083/mcp \
  -H "content-type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

### Server Prerequisites

Install Docker, the Docker Compose plugin, nginx, Git, and Certbot on the production server.

Ubuntu example:

```bash
sudo apt update
sudo apt install -y ca-certificates curl git nginx certbot python3-certbot-nginx
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc >/dev/null
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker github-actions
```

Log out and back in after adding the deploy user to the Docker group.

### First-Time Server Setup

Create the app folder:

```bash
sudo mkdir -p /home/github-actions/sites/invensys-ng
sudo chown -R github-actions:github-actions /home/github-actions
```

Clone the repository:

```bash
sudo -iu github-actions
cd /home/github-actions/sites/invensys-ng
git clone <repository-url> .
docker compose up -d --build --remove-orphans
exit
```

The container should now be reachable from the server itself:

```bash
curl http://127.0.0.1:8083/health
```

Expected response:

```json
{"ok":true,"server":"integra-ng-mcp"}
```

### Host Nginx Configuration

Create `/etc/nginx/sites-available/integra.web.za`:

```nginx
server {
    listen 80;
    server_name integra.web.za;

    location / {
        proxy_pass http://127.0.0.1:8083;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/integra.web.za /etc/nginx/sites-enabled/integra.web.za
sudo nginx -t
sudo systemctl reload nginx
```

Issue and install the TLS certificate:

```bash
sudo certbot --nginx -d integra.web.za
```

After Certbot updates nginx, verify the public app:

```bash
curl https://integra.web.za/
curl https://integra.web.za/health
curl -X POST https://integra.web.za/mcp \
  -H "content-type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

### SSH Deployment

Deploy from your workstation with the included PowerShell helper:

```powershell
.\scripts\deploy-prod.ps1 `
  -HostName integra.web.za `
  -User github-actions `
  -RemotePath /home/github-actions/sites/invensys-ng `
  -Branch main `
  -RepositoryUrl <repository-url>
```

After the first deploy, `-RepositoryUrl` is optional because the remote checkout already exists:

```powershell
.\scripts\deploy-prod.ps1 -HostName integra.web.za -User github-actions -RemotePath /home/github-actions/sites/invensys-ng -Branch main
```

The deploy script connects over SSH, updates the Git checkout, rebuilds the Docker image, restarts the container, and prunes unused images.

### GitHub Actions Deployment

The `.github/workflows/npm-deploy.yml` workflow keeps npm publishing and site deployment separate:

```text
push tag v*       publish npm package, then deploy Docker site over SSH
push main         deploy Docker site over SSH
workflow dispatch deploy Docker site when deploy-site is enabled
```

NPM publishing still uses OIDC trusted publishing and only runs for `v*` tags.

Configure these GitHub repository secrets:

```text
DEPLOY_SSH_HOST        production host, for example integra.web.za
DEPLOY_SSH_USER        SSH user, for example github-actions
DEPLOY_SSH_KEY         private SSH key for the deploy user
DEPLOY_SSH_PORT        optional SSH port, defaults to 22
DEPLOY_SSH_PASSPHRASE  optional; leave unset if the key has no passphrase
DEPLOY_APP_NAME        optional Compose app/container name, defaults to invensys-ng
DEPLOY_APP_PATH        optional app directory, defaults to /home/github-actions/sites/invensys-ng
DEPLOY_WEB_PORT        optional host localhost port, defaults to 8083
```

The server must already have the repository checked out in `DEPLOY_APP_PATH`. The action runs:

```bash
git fetch --all --tags --prune
git checkout --force <github-sha>
export COMPOSE_PROJECT_NAME="$DEPLOY_APP_NAME"
docker compose up -d --build --remove-orphans
docker image prune -f
```

### Manual SSH Deployment

The same deploy can be run manually:

```bash
ssh github-actions@integra.web.za
cd /home/github-actions/sites/invensys-ng
git fetch origin main
git reset --hard origin/main
docker compose up -d --build --remove-orphans
docker image prune -f
```

### Production Endpoints

The deployed app exposes:

```text
https://integra.web.za/          Angular UI kit
https://integra.web.za/health    MCP health check
https://integra.web.za/components
https://integra.web.za/mcp       MCP JSON-RPC endpoint
```

Agents should connect to:

```text
https://integra.web.za/mcp
```
