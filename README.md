# Micro Clinic Application - Quick Reference

A microservices-based clinic management system with React frontend, Node.js backend services, PostgreSQL database, and RabbitMQ messaging.

---

## 🏗️ Architecture

```
┌─────────────────┐
│ React Frontend  │ ←─→ Nginx Gateway (port 9000)
└─────────────────┘
         │
    ┌────┴────┬──────────────┬───────────────────┐
    │         │              │                   │
┌───▼───┐ ┌──▼──┐ ┌─────────▼────┐ ┌───────────▼────────┐
│ Nginx │ │ DB  │ │ Registration │ │ Examination        │
│       │ │     │ │ Service      │ │ Service            │
└───┬───┘ └──┬──┘ └──────┬───────┘ └──────┬─────────────┘
    │        │           │                 │
    │        │           └────┬────────────┘
    │        │                │
    │   ┌────▼────┐      ┌────▼─────┐
    │   │Postgres │      │ RabbitMQ │
    │   └─────────┘      └────┬─────┘
    │                         │
    │                ┌────────▼──────────┐
    └────────────────┤ Web Notification  │
                     │ Service (WebSocket)│
                     └───────────────────┘
```

---

## 📦 Services

| Service | Port | Tech Stack | Purpose |
|---------|------|------------|---------|
| **Frontend** | 3000 | React, Ant Design, WebSocket | UI for registration & examination |
| **Registration** | 8000 | Express, Prisma, RabbitMQ | Patient registration API |
| **Examination** | 8000 | Express, Prisma, RabbitMQ | Examination records API |
| **Web Notification** | 8080 | WebSocket, RabbitMQ | Real-time notifications |
| **Gateway** | 9000 | Nginx | Reverse proxy |
| **Database** | 5432 | PostgreSQL 16 | Data persistence |
| **Message Broker** | 5672, 15672 | RabbitMQ | Async messaging |

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 16+ (for local development)

### Start All Services

```bash
cd clinic-devops
docker-compose up --build
```

**Access Points:**
- Frontend: http://localhost:9000
- RabbitMQ Management: http://localhost:15672 (guest/guest)

### Environment Variables

Create `.env` in `clinic-devops/`:

```env
# Database
DB_USER=postgres
DB_PASSWORD=your_password

# RabbitMQ
BROKER_USER=guest
BROKER_PASSWORD=guest

# Application
BASE_URL=http://localhost:9000
BASE_WS_URL=ws://localhost:9000
EXCH_REGISTRATION=registration_exchange
EXCH_EXAMINED=examined_exchange
```

---

## 💻 Local Development

### Run Individual Services

**Frontend:**
```bash
cd clinic-frontend
npm install
npm start
```

**Registration Service:**
```bash
cd clinic-registration
npm install
npx prisma generate
npx prisma migrate dev
node server.js
```

**Examination Service:**
```bash
cd clinic-examination
npm install
npx prisma generate
npx prisma migrate dev
node server.js
```

**Web Notification Service:**
```bash
cd clinic-web-notification
npm install
node server.js
```

---

## 🗄️ Database (Prisma)

### Generate Client
```bash
npx prisma generate
```

### Run Migrations
```bash
npx prisma migrate dev --name migration_name
```

### Open Prisma Studio
```bash
npx prisma studio
```

### Database URLs
- **Registration DB:** `postgresql://user:pass@localhost:5432/registration`
- **Examination DB:** `postgresql://user:pass@localhost:5432/examination`

---

## 📡 Message Queues (RabbitMQ)

**Exchanges:**
- `registration_exchange` - New patient registrations
- `examined_exchange` - Examination completed events

**Connection URL:** `amqp://guest:guest@localhost:5672/`

---

## 🛠️ Useful Commands

### Docker
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f [service_name]

# Stop services
docker-compose down

# Rebuild specific service
docker-compose up --build [service_name]
```

### Prisma
```bash
# Format schema
npx prisma format

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View migrations status
npx prisma migrate status
```

---

## 📁 Project Structure

```
clinic/
├── clinic-devops/          # Docker configs & DB setup
├── clinic-frontend/        # React application
├── clinic-registration/    # Registration microservice
├── clinic-examination/     # Examination microservice
└── clinic-web-notification/# WebSocket notification service
```

---

## 🔧 Troubleshooting

**Port conflicts:** Change ports in `docker-compose.yml`

**Prisma errors:** Run `npx prisma generate` after schema changes

**RabbitMQ connection issues:** Check broker is running and credentials are correct

**Database connection issues:** Verify `DATABASE_URL` environment variable

---

## 📝 Notes

- Each backend service has its own Prisma schema and database
- Services communicate via RabbitMQ for async operations
- Frontend uses WebSocket for real-time updates
- Nginx gateway routes requests to appropriate services

---

**Author:** Tailor Solutions Co., Ltd.
