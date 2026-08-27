# 🚀 Deployment Guide: Tool System (Free 100%)

This guide provides step-by-step instructions for deploying the **Tool System** for **100% Free** using either:
- **Method 1:** Vercel (Frontend) + Render.com (Backend API) + TiDB / Aiven (Cloud MySQL)
- **Method 2:** Oracle Cloud Always Free VPS (Docker + Nginx + MySQL + Node.js)

---

## 🌟 Method 1: Vercel + Render + Free Cloud MySQL (No Server Management)

### Step 1: Create a Free MySQL Database on TiDB Cloud or Aiven
1. Go to **[TiDB Cloud](https://tidbcloud.com)** or **[Aiven.io](https://aiven.io)** and register for a free account.
2. Create a free MySQL cluster (5GB Free forever).
3. Copy the database connection details (`Host`, `Port`, `User`, `Password`, `Database`).
4. Import `server/schema.sql` to initialize tables.

### Step 2: Deploy Backend to Render.com
1. Go to **[Render.com](https://render.com)** and sign in with GitHub.
2. Click **New +** ➡️ **Web Service** ➡️ Connect your `Tool_CV` repository.
3. Configure settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
4. Add Environment Variables:
   - `DB_HOST`: *Your TiDB/Aiven Host*
   - `DB_USER`: *Your DB User*
   - `DB_PASSWORD`: *Your DB Password*
   - `DB_NAME`: *cvforge_db*
   - `DB_PORT`: *4000 or 3306*
   - `JWT_SECRET`: *your_random_secret_key*
5. Click **Create Web Service**. You will get a backend URL (e.g. `https://toolcv-api.onrender.com`).

### Step 3: Deploy Frontend to Vercel
1. Go to **[Vercel.com](https://vercel.com)** and sign in with GitHub.
2. Click **Add New...** ➡️ **Project** ➡️ Select your `Tool_CV` repository.
3. Configure settings:
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
4. Click **Deploy**. You will get a public live URL (e.g. `https://toolcv.vercel.app`)!

---

## 🏢 Method 2: Oracle Cloud Always Free VPS (All-in-One Docker)

### Step 1: Create Oracle Cloud Always Free VM
1. Sign up at **[Oracle Cloud](https://www.oracle.com/cloud/free/)** (Choose *Always Free* Ampere ARM or AMD instance).
2. Create an **Ubuntu 22.04 LTS** Compute Instance.
3. Open ports `80`, `443`, and `5000` in Oracle Cloud Ingress Rules.

### Step 2: Install Docker & Docker Compose on VPS
Connect to your VPS via SSH and run:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose git
sudo systemctl enable --now docker
```

### Step 3: Clone Project & Run with 1 Command
```bash
git clone https://github.com/your-username/Tool_CV.git
cd Tool_CV

# Build frontend production bundle
cd client && npm install && npm run build && cd ..

# Launch MySQL, Backend API, and Nginx reverse proxy
docker-compose up -d --build
```

### Step 4: Add Free SSL Certificate (HTTPS)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

Your system is now live 24/7 with enterprise-grade SSL, MySQL database, and REST API!
