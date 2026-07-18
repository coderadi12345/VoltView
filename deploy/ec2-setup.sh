#!/usr/bin/env bash
# Bootstrap an Ubuntu EC2 instance for VoltView (Docker Compose).
# Usage (on EC2):
#   curl -fsSL https://raw.githubusercontent.com/<org>/VoltView/main/deploy/ec2-setup.sh | bash
# Or after cloning:
#   bash deploy/ec2-setup.sh

set -euo pipefail

echo "==> Installing Docker & Docker Compose plugin"
if ! command -v docker >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo apt-get install -y ca-certificates curl gnupg
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update -y
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  sudo usermod -aG docker "$USER" || true
fi

echo "==> Docker ready: $(docker --version)"
echo "==> Compose ready: $(docker compose version)"
echo ""
echo "Next steps:"
echo "  1. Clone the repo and cd into it"
echo "  2. cp .env.example .env  &&  edit CLIENT_URL + JWT secrets"
echo "  3. docker compose up -d --build"
echo "  4. docker compose exec api node src/seed/seed.js"
echo "  5. Open http://<EC2-PUBLIC-IP>  (open inbound TCP 80 in Security Group)"
