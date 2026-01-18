# 🚀 Deployment Guide

Since the assignment requires an **"Active Link"**, here is the fastest free way to deploy your MERN stack application.

## 1. Backend Deployment (Render.com) - Free
1.  Push your code to **GitHub**.
2.  Go to [Render.com](https://render.com) and create an account.
3.  Click **"New +"** -> **"Web Service"**.
4.  Connect your GitHub repository.
5.  **Settings**:
    *   **Root Directory**: `backend`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
6.  **Environment Variables** (Add these):
    *   `MONGODB_URI`: (Copy from your `.env`)
    *   `PORT`: `10000` (Render default)
    *   `Redis`: (Skip if you don't have a Redis Cloud URL, code handles failure gracefully)
7.  Click **"Create Web Service"**.
8.  **Copy the URL** (e.g., `https://sydney-events.onrender.com`).

## 2. Frontend Deployment (Vercel) - Free
1.  Go to [Vercel.com](https://vercel.com).
2.  "Add New..." -> "Project".
3.  Import your GitHub repository.
4.  **Framework Preset**: Select `Create React App`.
5.  **Root Directory**: Click "Edit" and select `frontend`.
6.  **Build Command**: `npm run build`
7.  **Environment Variables**:
    *   `REACT_APP_API_URL`: Paste your Render Backend URL (e.g., `https://sydney-events.onrender.com/api`)
        *   *Note: Add `/api` at the end if your frontend code expects it, or just the base URL.*
8.  Click **"Deploy"**.

## 3. Industrial Deployment (Docker)
For your resume/interview, show them you can run it locally with one command:
```bash
docker-compose up --build
```
This starts Backend, Frontend, and Redis containers automatically.
