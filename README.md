# EatSoft Canteen Management System

EatSoft is a comprehensive canteen management solution designed to streamline the food ordering and stall management process. This project is built using a modern full-stack JavaScript architecture, separating the client-side interface from the robust server-side backend.

## 🚀 Tech Stack

### Frontend
* **Framework:** React.js
* **Routing:** React Router v7
* **HTTP Client:** Axios
* **Charting:** Recharts (for dashboard analytics)
* **Build Tool:** Create React App

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JSON Web Tokens (JWT) & bcrypt/bcryptjs
* **File Storage:** Cloudinary (via Multer)
* **Emailing:** Nodemailer

## 📁 Project Structure

The repository is organized into a monorepo-style structure:

```
eatsoft-canteen-manangement-system/
├── backend/                # Express REST API, Prisma schema, and server logic
├── frontend/               # React application and UI components
├── docker-compose.yml      # Docker configuration for local services (e.g., PostgreSQL)
└── README.md               # Project documentation
```

## ✨ Features

* **Role-Based Access Control:** Distinct interfaces and permissions for Customers, Vendors/Stall Owners, and System Administrators.
* **Menu Management:** Vendors can add, update, and manage their food items, including image uploads via Cloudinary.
* **Order Processing:** Customers can browse stalls, place orders, and track their order status.
* **Analytics Dashboard:** Visual representation of sales and order data using Recharts.
* **Secure Authentication:** JWT-based authentication with encrypted passwords.

## 🛠️ Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn
* PostgreSQL (or Docker to run the provided `docker-compose.yml`)
* Cloudinary Account (for image uploads)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd eatsoft-canteen-manangement-system
   ```

2. **Database Setup:**
   If you have Docker installed, you can easily spin up a PostgreSQL instance:
   ```bash
   docker-compose up -d
   ```

3. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   * Create a `.env` file in the `backend` directory with the following variables:
     ```env
     PORT=5000
     DATABASE_URL="postgresql://user:password@localhost:5432/eatsoft?schema=public"
     JWT_SECRET="your_jwt_secret"
     CLOUDINARY_CLOUD_NAME="your_cloud_name"
     CLOUDINARY_API_KEY="your_api_key"
     CLOUDINARY_API_SECRET="your_api_secret"
     EMAIL_USER="your_email@gmail.com"
     EMAIL_PASS="your_email_password"
     ```
   * Run Prisma migrations and seed the database (if applicable):
     ```bash
     npx prisma migrate dev
     npx prisma db seed
     ```
   * Start the backend development server:
     ```bash
     npm run dev
     ```

4. **Frontend Setup:**
   Open a new terminal window/tab:
   ```bash
   cd frontend
   npm install
   ```
   * Create a `.env` file in the `frontend` directory:
     ```env
     REACT_APP_API_URL=http://localhost:5000/api
     ```
   * Start the React development server:
     ```bash
     npm start
     ```

The frontend will typically be accessible at `http://localhost:3000` and the backend at `http://localhost:5000`.

## 📜 License

This project is licensed under the ISC License.
