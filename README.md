# VoltView

Smart Energy Monitoring & Utility Management Platform.

Stack: **React (Vite) + Express + MongoDB + Socket.IO**

---

## Local development

### Prerequisites
- Node.js 20+
- MongoDB running locally

### Setup

```bash
npm install
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run seed
npm run dev
```

- Frontend: http://localhost:5173  
- API: http://localhost:5000/api/health  

### Seed logins

Password for all accounts: `VoltView!Secure@2026`

| Role | Email |
|------|-------|
| Super Admin | `superadmin@voltview.com` |
| Admin | `admin@voltview.com` |
| Manager | `manager@voltview.com` |
| User | `user@voltview.com` |

---

## Deploy on AWS EC2 (recommended: Docker Compose)

### 1. Launch EC2
- AMI: **Ubuntu 22.04/24.04 LTS**
- Instance: `t3.small` or larger (t3.micro works for demos)
- Security Group inbound:
  - **TCP 22** (SSH) — your IP
  - **TCP 80** (HTTP) — `0.0.0.0/0`
  - Optional **TCP 443** if you add TLS later

### 2. Install Docker on the instance

```bash
sudo apt-get update -y
git clone <YOUR_REPO_URL> VoltView
cd VoltView
bash deploy/ec2-setup.sh
# log out/in once so docker group applies, or use sudo
```

### 3. Configure environment

```bash
cp .env.example .env
nano .env
```

Set at minimum:

```env
CLIENT_URL=http://<EC2_PUBLIC_IP>
JWT_ACCESS_SECRET=<long-random-string>
JWT_REFRESH_SECRET=<long-random-string>
JWT_RESET_SECRET=<long-random-string>
```

If you use a domain: `CLIENT_URL=http://voltview.example.com` (or `https://...` once TLS is configured).

### 4. Build & run

One-shot deploy (build + seed):

```bash
bash deploy/deploy.sh
```

Or manually:

```bash
docker compose up -d --build
docker compose exec api node src/seed/seed.js
docker compose ps
curl http://127.0.0.1/api/health
```

Open `http://<EC2_PUBLIC_IP>` in a browser and sign in with a seed account.

### Useful commands

```bash
docker compose logs -f api
docker compose restart api
docker compose down          # stop
docker compose down -v       # stop + wipe Mongo volume
```

---

## Alternative: PM2 on EC2 (no Docker)

```bash
# Install Node 22, MongoDB, nginx, pm2
sudo apt-get update -y
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm i -g pm2

# App
git clone <YOUR_REPO_URL> VoltView && cd VoltView
npm install && npm run install:all
cp .env.example .env
# edit .env — CLIENT_URL=http://<EC2_PUBLIC_IP>, MONGO_URI, JWT secrets
cp client/.env.example client/.env
# for same-origin production build:
printf 'VITE_API_URL=/api\nVITE_SOCKET_URL=\n' > client/.env.production
npm run build

NODE_ENV=production pm2 start ecosystem.config.cjs
pm2 save && pm2 startup

# nginx reverse proxy
sudo cp deploy/nginx-pm2.conf /etc/nginx/sites-available/voltview
sudo ln -sf /etc/nginx/sites-available/voltview /etc/nginx/sites-enabled/voltview
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

---

## Architecture (production)

```
Browser  →  nginx:80  →  Node API:5000  →  MongoDB
                │              ├── /api/*
                │              ├── /socket.io/*
                │              └── static SPA (client/dist)
```

---

## Health check

`GET /api/health` → `{ "success": true, "service": "VoltView API" }`
