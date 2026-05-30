# VoltView

**See Every Watt. Control Every Cost.**

VoltView is a production-oriented MERN SaaS starter for smart energy monitoring and utility management across organizations, buildings, floors, rooms, and devices.

## Stack

- React, React Router, Axios, Tailwind CSS, Recharts, Socket.IO Client
- Node.js, Express, Socket.IO, JWT, bcryptjs, express-validator
- MongoDB, Mongoose
- PDFKit, ExcelJS, Nodemailer

## Quick Start

```bash
npm run install:all
cp .env.example server/.env
npm run seed
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Demo Login

- Email: `superadmin@voltview.com`
- Password: `Password123!`

## Project Structure

```text
server/
  src/config
  src/controllers
  src/services
  src/repositories
  src/routes
  src/middlewares
  src/validators
  src/sockets
  src/models
  src/jobs
  src/utils
client/
  src/pages
  src/components
  src/layouts
  src/charts
  src/hooks
  src/services
  src/context
  src/routes
  src/utils
```

## API Overview

All protected endpoints require:

```http
Authorization: Bearer <access-token>
```

Core endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/dashboard/summary`
- `GET /api/organizations`
- `GET /api/buildings`
- `GET /api/floors`
- `GET /api/rooms`
- `GET /api/devices`
- `GET /api/energy-logs`
- `POST /api/billing/generate`
- `GET /api/alerts`
- `GET /api/notifications`
- `GET /api/reports`
- `POST /api/reports/export`
- `GET /api/audit-logs`
- `GET /api/settings`

Socket.IO emits live events on:

- `energy:update`
- `device:update`
- `alert:new`
- `notification:new`
