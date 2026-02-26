# 🚀 CRM Pro - Dynamic No-Code CRM Platform

A full-stack, dynamic Customer Relationship Management (CRM) platform inspired by Salesforce. Unlike standard applications with hardcoded tables, this project features an **Object Manager** that allows users to dynamically create database tables, define custom fields, and instantly generate CRUD (Create, Read, Update, Delete) interfaces without writing additional code.

## ✨ Key Features

* **Dynamic Schema Builder (Object Manager):**
    * Create new custom objects (MySQL tables) directly from the UI.
    * Add custom fields (columns) on the fly, supporting Text, Number, Date, Checkboxes (Booleans), and Picklists (ENUMs).
* **Universal CRUD Engine:**
    * A single, dynamic Vue component handles the reading, creating, editing, and deleting of records for *any* custom object.
    * Forms automatically adapt their input types (text, number, date, select) based on the database schema.
* **Automated Navigation:** The sidebar dynamically updates to include links to newly created objects.
* **Real-time Dashboard:** Summarized statistics (e.g., Total Leads, Pipeline Value) calculating metrics directly from the database.
* **Modern UI:** Fully responsive and styled using Tailwind CSS.

## 🛠️ Tech Stack

* **Frontend:** Vue 3 (Composition API), Vite, Vue Router, Tailwind CSS, Axios
* **Backend:** Node.js, Express.js
* **Database:** MySQL (using `mysql2` package)

## 📂 Project Structure

This repository contains both the frontend and backend code.

```text
crm-pro/
├── client/                 # Vue.js Frontend
│   ├── src/
│   │   ├── router/         # Vue Router (Dynamic routing setup)
│   │   ├── views/          # Pages (Dashboard, ObjectManager, DynamicListView, EditItem)
│   │   └── App.vue         # Main layout with dynamic sidebar
│   └── .env.example        # Frontend environment variables template
│
└── server/                 # Node.js Backend
    ├── config/             # Database connection setup
    ├── routes/             # API routes (data.js, schema.js, leads.js)
    ├── server.js           # Main Express server entry point
    └── .env.example        # Backend environment variables template
```

## ⚙️ Installation & Setup

### Prerequisites
* Node.js (v16+)
* MySQL installed and running locally.

### 1. Database Setup
1. Log into your MySQL instance.
2. Create a new database:
   ```sql
   CREATE DATABASE crm_db;
   ```
*(Note: You do not need to create individual tables like `leads` or `projects`; the Object Manager handles that directly from the UI!)*

### 2. Backend Setup (Node.js)
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your database credentials:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=crm_db
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup (Vue.js)
1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🚀 Usage

1. Open your browser and go to `http://localhost:5173`.
2. Navigate to the **Object Manager** via the sidebar.
3. Create a new Object (e.g., "Projects").
4. Add fields to your new object (e.g., "Budget" as a Number, "Status" as an ENUM with options 'Planning, Active, Completed').
5. Click on your newly created "Projects" tab in the sidebar and start adding dynamic records!

## 🗺️ Future Enhancements
* **Relational Lookup Fields:** Allow custom objects to reference each other (e.g., assigning a 'Lead' to a specific 'User').
* **Authentication & Authorization:** Secure the application using JWT and bcrypt, implementing Role-Based Access Control (Admin vs. Standard User).
* **Server-Side Pagination & Filtering:** Optimize data fetching for tables with thousands of records.
