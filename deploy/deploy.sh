#!/usr/bin/env bash
# Deploy VoltView on this machine with Docker Compose.
# Run from repo root:  bash deploy/deploy.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env ]]; then
  echo "==> Creating .env from .env.example"
  cp .env.example .env
  echo "    Edit .env and set CLIENT_URL + JWT secrets, then re-run."
  echo "    Example: CLIENT_URL=http://$(curl -s ifconfig.me || echo YOUR_EC2_IP)"
  exit 1
fi

# Warn if secrets were left as placeholders
if grep -q 'replace-with-a-long' .env; then
  echo "WARNING: JWT secrets in .env still use placeholders. Change them before production use."
fi

echo "==> Building and starting containers"
docker compose up -d --build

echo "==> Waiting for API health"
for i in $(seq 1 30); do
  if docker compose exec -T api node -e "fetch('http://127.0.0.1:5000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" 2>/dev/null; then
    echo "    API is healthy"
    break
  fi
  if [[ "$i" -eq 30 ]]; then
    echo "API did not become healthy in time. Check: docker compose logs api"
    exit 1
  fi
  sleep 2
done

echo "==> Seeding demo data (safe to re-run; resets demo DB)"
docker compose exec -T api node src/seed/seed.js

HOST_PORT="$(grep -E '^HOST_PORT=' .env | cut -d= -f2 || true)"
HOST_PORT="${HOST_PORT:-80}"
echo ""
echo "VoltView is up."
echo "  Open:  http://<EC2_PUBLIC_IP>:${HOST_PORT}"
echo "  Health: http://<EC2_PUBLIC_IP>:${HOST_PORT}/api/health"
echo "  Login:  admin@voltview.com / VoltView!Secure@2026"
echo ""
echo "Logs: docker compose logs -f"
