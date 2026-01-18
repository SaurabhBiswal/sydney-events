# 🚀 Deployment Guide: Render + Netlify

## Prerequisites
1. GitHub account (code push karna hoga)
2. MongoDB Atlas connection string ready

---

## Part 1: Backend Deployment (Render)

### Step 1: Push Code to GitHub
```bash
cd "C:\Users\punpu\OneDrive\Desktop\New folder (2)\louder assignment"
git init
git add .
git commit -m "Initial commit: Sydney Events Platform"
# GitHub pe naya repo banao aur push karo
git remote add origin https://github.com/YOUR_USERNAME/sydney-events.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. **Settings:**
   - **Name**: `sydney-events-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

5. **Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   ```
   PORT=10000
   MONGODB_URI=mongodb+srv://punpunsaurabh2002_db_user:Punpun2002@job-portal-cluster.ruztisb.mongodb.net/sydney-events?retryWrites=true&w=majority
   ```

6. Click **"Create Web Service"**
7. Wait 2-3 minutes. Copy the URL (e.g., `https://sydney-events-backend.onrender.com`)

---

## Part 2: Frontend Deployment (Netlify)

### Step 1: Update Frontend API URL
**File**: `frontend/src/pages/Home.js`
**Line 7** ko change karo:
```javascript
// Before:
const API_URL = 'http://localhost:5001/api';

// After (use your Render URL):
const API_URL = 'https://sydney-events-backend.onrender.com/api';
```

**File**: `frontend/src/components/ChatWidget.js`
**Line 36** ko change karo:
```javascript
// Before:
const response = await axios.post('http://localhost:5001/api/chat', {

// After:
const response = await axios.post('https://sydney-events-backend.onrender.com/api/chat', {
```

**Commit changes:**
```bash
git add .
git commit -m "Updated API URLs for production"
git push
```

### Step 2: Deploy on Netlify
1. Go to [netlify.com](https://netlify.com) → Sign up with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Select GitHub → Choose your repository
4. **Settings:**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

5. Click **"Deploy site"**
6. Wait 2-3 minutes. Copy the URL (e.g., `https://sydney-events-abc123.netlify.app`)

---

## Part 3: Testing

1. Open your Netlify URL
2. Trigger scraper: `https://sydney-events-backend.onrender.com/api/scrape/events`
3. Refresh frontend → Events should appear!
4. Test chatbot → Type "food" or "music"

---

## 🎯 Final Submission

**Assignment mein yeh link submit karo:**
- **Live Website**: `https://sydney-events-abc123.netlify.app`
- **GitHub Repo**: `https://github.com/YOUR_USERNAME/sydney-events`

**Documents:**
- README.md (already in repo)
- REPORT.md (already in repo)

---

## ⚠️ Important Notes

### Free Tier Limitations:
- **Render**: Server "sleeps" after 15 min inactivity. First request slow hoga (30 sec), phir fast.
- **Netlify**: Unlimited bandwidth for static sites.

### CRON Job:
- Render free tier mein CRON properly nahi chalega (server sleep hota hai).
- **Workaround**: Use [cron-job.org](https://cron-job.org) to ping your scraper URL daily:
  - URL: `https://sydney-events-backend.onrender.com/api/scrape/events`
  - Schedule: Daily at 2:00 AM

---

**Ready to deploy? Pehle GitHub push karo, phir bataiye!** 🚀
