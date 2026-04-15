# EatSoft Canteen Management - Backend

## 1. Preconditions
You must have the following installed before starting:
- **Node.js (v16+)**: [Download & Install Node.js](https://nodejs.org/)
- **Docker Desktop**: [Download & Install Docker](https://www.docker.com/products/docker-desktop/) *(Used to host the local PostgreSQL database)*

---

## 2. First-time Setup
Open a terminal at the **root** of the project and run the following commands sequentially:

```bash
# 1. Start the PostgreSQL database container
docker-compose up -d

# 2. Navigate to the backend folder
cd backend

# 3. Install all Node.js dependencies
npm install

# 4. Copy the environment variables template
cp .env.example .env
```

**⚠️ IMPORTANT:** Open the newly created `backend/.env` file and make sure the `DATABASE_URL` exactly matches the Docker credentials:
```env
DATABASE_URL="postgresql://quockhanhtruong:secretpassword@localhost:5432/eatsoft_db?schema=public"
```

Once `.env` is configured, finish the setup:
```bash
# 5. Build tables and seed fake data (Users, Stores, Orders, etc.)
npx prisma db push --force-reset
npx prisma generate
npx prisma db seed

# 6. Start the server!
npm run dev
```

---

## 3. Daily Run
When you return to work on the project another day, you only need to run:

```bash
# 1. From the ROOT folder (starts the database in background)
docker-compose up -d

# 2. From the BACKEND folder (starts the API)
npm run dev
```

---

## 4. Useful Commands (run inside `backend/`)

| Action | Command |
| :--- | :--- |
| **Open Database GUI** | `npx prisma studio` |
| **Reset & Reseed Database** | `npx prisma db push --force-reset && npx prisma db seed` |
| **Stop Database Container** | `docker-compose down` *(run from root folder)* |
