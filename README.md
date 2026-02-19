Lead Management System

A full-stack Lead Management Web Application built using React and Node.js.  
This system allows users to create, view, update, delete, and analyze leads with webhook integration support.

---

Tech Stack Used

🔹 Frontend
- React.js
- React Bootstrap
- Axios
- React Router DOM
- Lucide React (Icons)
- Context API (Theme Toggle)

🔹 Backend
- Node.js
- Express.js

🔹 Database
- MongoDB / MySQL (Update according to your project)

🔹 Tools & Technologies
- REST API
- Webhook Integration
- Git & GitHub
- Environment Variables (.env)

---

⚙️ Setup Instructions

Follow the steps below to run the project locally.

---

1️⃣ Clone the Repository

```bash
git clone https://github.com/Sharmi-11/lead-management-system.git

🔹 Backend Setup

cd backend
npm install

🔹 Frontend Setup

cd frontend
npm install
npm start

🔹 Webhook Integration Explanation

Webhook integration allows the system to notify external services automatically when a new lead is created.

 How Webhook Works in This Project

User submits a new lead from the frontend form.

Backend receives the request.

Lead data is saved to the database.

Backend checks if WEBHOOK_URL is configured.

Backend sends a POST request to the webhook URL with lead details.


