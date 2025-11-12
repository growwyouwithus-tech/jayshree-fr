# Deployment Guide 🚀

## Important: API Configuration Fixed! ✅

Login issue fix ho gaya hai. Ab deploy karne ke baad bhi kaam karega.

## Deployment Options

### Option 1: Netlify (Recommended) 🌐

#### Step 1: Build the App
```bash
cd user
npm run build
```

#### Step 2: Deploy to Netlify

**Via Netlify CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**Via Netlify Dashboard:**
1. Go to https://app.netlify.com
2. Drag & drop the `dist` folder
3. Done! ✅

#### Step 3: Configure Environment Variables

In Netlify Dashboard:
1. Go to Site Settings → Environment Variables
2. Add variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.com/api/v1`
3. Redeploy

#### Step 4: Configure Redirects

Create `user/public/_redirects`:
```
/api/*  https://your-backend-url.com/api/:splat  200
/*  /index.html  200
```

### Option 2: Vercel 🔺

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
cd user
vercel
```

#### Step 3: Configure Environment Variables
```bash
vercel env add VITE_API_URL
# Enter: https://your-backend-url.com/api/v1
```

#### Step 4: Configure Rewrites

Create `user/vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-url.com/api/:path*"
    }
  ]
}
```

### Option 3: GitHub Pages 📄

#### Step 1: Update vite.config.js
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

#### Step 2: Build & Deploy
```bash
npm run build
npm install -g gh-pages
gh-pages -d dist
```

## Backend Deployment (Required) 🔧

### Deploy Backend First

#### Option 1: Render
1. Go to https://render.com
2. New → Web Service
3. Connect your GitHub repo
4. Build Command: `cd backend && npm install`
5. Start Command: `cd backend && npm start`
6. Add Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT=5000`

#### Option 2: Railway
```bash
cd backend
railway login
railway init
railway up
```

#### Option 3: Heroku
```bash
cd backend
heroku create your-app-name
git push heroku main
```

## Environment Variables Setup 🔐

### Local Development (.env file)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Production (Deployment Platform)
```env
VITE_API_URL=https://your-backend.com/api/v1
```

**Important:** 
- Local development mein `http://localhost:5000/api/v1`
- Production mein full backend URL

## API Configuration Explained 📝

### How It Works:

```javascript
// axios.js
const API_URL = import.meta.env.VITE_API_URL || '/api/v1'
```

**Local Development:**
- `.env` file mein: `VITE_API_URL=http://localhost:5000/api/v1`
- API calls go to: `http://localhost:5000/api/v1`

**Production (with env var):**
- Platform env var: `VITE_API_URL=https://api.example.com/api/v1`
- API calls go to: `https://api.example.com/api/v1`

**Production (without env var):**
- Fallback to: `/api/v1` (relative path)
- Works with proxy/rewrites

## Deployment Checklist ✅

### Before Deployment:

- [ ] Backend deployed and running
- [ ] Backend URL noted
- [ ] Environment variables ready
- [ ] Build successful locally (`npm run build`)
- [ ] No console errors

### During Deployment:

- [ ] Set `VITE_API_URL` environment variable
- [ ] Configure redirects/rewrites (if needed)
- [ ] Deploy frontend
- [ ] Check deployment logs

### After Deployment:

- [ ] Open deployed URL
- [ ] Test login (use demo credentials)
- [ ] Check browser console for errors
- [ ] Test navigation
- [ ] Test API calls

## Common Issues & Fixes 🔧

### Issue 1: Login Not Working
**Cause:** API URL not configured
**Fix:** 
```bash
# Set environment variable on deployment platform
VITE_API_URL=https://your-backend.com/api/v1
```

### Issue 2: CORS Errors
**Cause:** Backend not allowing frontend origin
**Fix:** Update backend CORS config:
```javascript
// backend/src/index.js
app.use(cors({
  origin: ['https://your-frontend.netlify.app'],
  credentials: true
}))
```

### Issue 3: 404 on Refresh
**Cause:** No redirect rules
**Fix:** Add `_redirects` file:
```
/*  /index.html  200
```

### Issue 4: API Calls Failing
**Cause:** Wrong API URL
**Fix:** Check environment variable:
```bash
# Should be full URL with /api/v1
VITE_API_URL=https://backend.com/api/v1
```

### Issue 5: Build Fails
**Cause:** Missing dependencies
**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Testing Deployment 🧪

### Test Locally First:
```bash
npm run build
npm run preview
# Open http://localhost:4173
```

### Test Production:
1. Open deployed URL
2. Open DevTools (F12)
3. Go to Network tab
4. Try login
5. Check API calls:
   - Should go to correct backend URL
   - Should return 200 OK
   - Should have response data

## Quick Deploy Commands 🚀

### Netlify:
```bash
cd user
npm run build
netlify deploy --prod --dir=dist
```

### Vercel:
```bash
cd user
vercel --prod
```

### Manual:
```bash
cd user
npm run build
# Upload dist/ folder to your hosting
```

## Backend + Frontend Together 🔗

### Same Domain Setup:

If backend and frontend on same domain:
```
https://example.com        → Frontend
https://example.com/api    → Backend
```

Then use:
```env
VITE_API_URL=/api/v1
```

### Different Domains:

```
https://app.example.com    → Frontend
https://api.example.com    → Backend
```

Then use:
```env
VITE_API_URL=https://api.example.com/api/v1
```

## Support 💬

Agar koi issue ho to:
1. Browser console check karo (F12)
2. Network tab mein API calls dekho
3. Environment variables verify karo
4. Backend logs check karo

---

**Ab deploy karne ke baad login kaam karega! 🎉**
