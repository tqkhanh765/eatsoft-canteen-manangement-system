# EatSoft Canteen Management - Frontend

## 1. Preconditions
You must have the following installed before starting:
- **Node.js (v16+)**: [Download & Install Node.js](https://nodejs.org/)

*(Note: Ensure the Backend is properly running before starting the Frontend so the API functions correctly.)*

---

## 2. First-time Setup
Open a terminal at the **root** of the project and run the following commands sequentially:

```bash
# 1. Navigate to the frontend folder
cd frontend

# 2. Install all required dependencies
npm install
```

*(Optional)* If you have an environment variables template:
```bash
cp .env.example .env
```

Once installed, start the local development server:
```bash
# 3. Start the app!
npm start
```
*(This will automatically open your default browser to `http://localhost:3000`)*

---

## 3. Daily Run
When you return to work on the frontend another day, you only need to run:

```bash
# 1. Go to the frontend folder
cd frontend

# 2. Start the local server
npm start
```

---

## 4. Useful Commands (run inside `frontend/`)

| Action | Command |
| :--- | :--- |
| **Start Development Server** | `npm start` |
| **Run Tests** | `npm test` |
| **Build for Production** | `npm run build` |
