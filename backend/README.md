# EatSoft Canteen Management - Backend

## 1. Preconditions
You must have the following installed before starting:
- **Node.js (v16+)**: [Download & Install Node.js](https://nodejs.org/)

---

## 2. First-time Setup
Open a terminal at the **root** of the project and run the following commands sequentially:

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Install all Node.js dependencies
npm install

# 3. Copy the environment variables template
cp .env.example .env
```

**⚠️ IMPORTANT:** The project uses a shared Cloud Database hosted on Supabase. Open your newly created `backend/.env` file and ask the lead developer (quockhanhtruong) for the **Direct Connection URL**. Paste it into your `DATABASE_URL`:
```env
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-X-[region].pooler.supabase.com:5432/postgres"
```

Once `.env` is configured, finish the setup:
```bash
# 4. Generate Prisma Client (allows backend to talk to DB)
npx prisma generate

# 5. Start the server!
npm run dev
```

---

## 3. Daily Run
When you return to work on the project another day, you only need to run:

```bash
# From the BACKEND folder (starts the API)
npm run dev
```

---

## 4. Useful Commands (run inside `backend/`)

| Action | Command |
| :--- | :--- |
| **Open Database GUI** | `npx prisma studio` |
| **Reset Database Schema** | `npx prisma db push --force-reset` *(Warning: Drops all tables!)* |
| **Reseed Dummy Data** | `npx prisma db seed` |
