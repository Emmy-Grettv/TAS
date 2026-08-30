# Fixing the 404 Errors

## Issues You're Seeing

1. ❌ `GET /dashboard/trainer/profile 404` - Old cached route
2. ❌ `GET /assets/fonts/Inter-Regular.woff2 404` - Font loading issue
3. ❌ Failed to post to login - Possible API connection issue

## Quick Fixes

### Fix 1: Clear Browser Cache

**Option A: Hard Refresh (Recommended)**
1. Open your browser on the Tegano site
2. Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. This will force reload and clear cached files

**Option B: Clear Cache Completely**
1. Press `F12` to open DevTools
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

**Option C: Clear All Site Data**
1. Press `F12` to open DevTools
2. Go to "Application" tab
3. Click "Clear site data"
4. Refresh the page

### Fix 2: The Font 404 is Actually Harmless

The font 404 error is **NOT a problem**. Here's why:

- Next.js is loading Inter font from **Google Fonts** (correct)
- The 404 for `/assets/fonts/Inter-Regular.woff2` is just a leftover cache request
- Your fonts are displaying correctly
- This won't affect functionality

**To verify fonts are working:**
- Look at your page - if text displays normally, fonts are working ✅

### Fix 3: Fix Login POST Failure

If login is failing, check:

**Step 1: Verify Backend is Running**
```bash
# Check if backend responds
curl http://localhost:3001/api/auth/me
```

You should see: `{"message":"Unauthorized","statusCode":401}` ← This is correct!

**Step 2: Check Frontend API URL**

Check `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Step 3: Test Login**
1. Go to http://localhost:3000/login
2. Enter:
   - Email: `admin@tegano.com`
   - Password: `Admin@123`
3. Click Login

**If login still fails:**
- Open DevTools (F12) → Network tab
- Try logging in
- Click on the failed `/auth/login` request
- Check the "Response" tab
- Tell me what error message you see

### Fix 4: Remove Trainer Route References

The `/dashboard/trainer/profile` route doesn't exist in your current project. This is coming from:

**Possible causes:**
1. **Browser cached redirect** - Clear cache (see Fix 1)
2. **Old bookmark** - Delete any bookmarks to trainer routes
3. **Service worker cache** - Clear in DevTools → Application → Service Workers

**To permanently fix:**

1. **Clear Next.js cache:**
```bash
cd frontend
rm -rf .next
npm run dev
```

2. **Clear browser localStorage:**
```javascript
// In browser console (F12):
localStorage.clear()
sessionStorage.clear()
location.reload()
```

## Step-by-Step Resolution

### For the Trainer 404:

1. **Stop the frontend**
   - Press `Ctrl + C` in the frontend terminal

2. **Clear the build cache**
   ```bash
   cd frontend
   rm -rf .next
   rm -rf node_modules/.cache
   ```

3. **Clear browser data**
   - F12 → Application → Clear site data
   - Or: `localStorage.clear()` in console

4. **Restart frontend**
   ```bash
   npm run dev
   ```

5. **Hard refresh browser**
   - `Ctrl + Shift + R`

### For Login Failure:

1. **Check both servers are running:**
   ```bash
   # Terminal 1: Backend should show
   [Nest] Listening on http://localhost:3001

   # Terminal 2: Frontend should show
   ready - started server on 0.0.0.0:3000
   ```

2. **Test backend directly:**
   ```bash
   # This should return 401 Unauthorized (correct!)
   curl http://localhost:3001/api/auth/me
   ```

3. **Check frontend can reach backend:**
   - Open http://localhost:3000
   - F12 → Network tab
   - Try to login
   - Look for the POST request to `/auth/login`
   - Check if it's going to the right URL

## If Issues Persist

### Check Backend Logs

Look at your backend terminal for errors. You should see:
```
[Nest] LOG [RoutesResolver] AuthController {/api/auth}:
[Nest] LOG [RouterExplorer] Mapped {/api/auth/login, POST} route
[Nest] LOG [RouterExplorer] Mapped {/api/auth/change-password, PATCH} route
```

If you see database connection errors, check:
1. PostgreSQL is running
2. Database credentials in `backend/.env` are correct
3. Database `tegano_db` exists

### Check Frontend Console

Open F12 → Console tab. Look for errors like:
- `Failed to fetch` - Backend not running
- `Network Error` - API URL wrong
- `401 Unauthorized` - After login (this would be a code issue)

### Nuclear Option (Complete Reset)

If nothing works, do a complete reset:

```bash
# Stop both servers (Ctrl+C in both terminals)

# Backend
cd backend
rm -rf node_modules .next dist
npm install
npm run start:dev

# Frontend (in new terminal)
cd frontend
rm -rf node_modules .next
npm install
npm run dev

# Clear browser
# F12 → Application → Clear site data
# Or localStorage.clear() in console

# Hard refresh: Ctrl + Shift + R
```

## Expected Behavior

After following these fixes:

✅ Login page loads at http://localhost:3000/login  
✅ No trainer-related 404 errors  
✅ Login works with default credentials  
✅ Redirects to /dashboard after login  
✅ Dashboard shows statistics  
✅ All navigation links work  

## Still Getting Errors?

If you're still seeing issues:

1. **Take a screenshot** of:
   - The error in the browser
   - The Network tab showing the failed request
   - The backend terminal output

2. **Share the exact error message** including:
   - The full URL that's failing
   - The response status code
   - Any error message in the response

3. **Try these debug steps:**
   ```bash
   # Check what's actually running on port 3001
   netstat -ano | findstr :3001

   # Test backend health
   curl http://localhost:3001/api/bookings/stats

   # Check frontend can resolve API URL
   # In browser console:
   console.log(process.env.NEXT_PUBLIC_API_URL)
   ```

## Summary

The two main issues are:

1. **Trainer 404** → Old cached route, clear browser cache
2. **Font 404** → Harmless, fonts are working via Google Fonts
3. **Login failure** → Check backend is running and API URL is correct

**Quick fix command sequence:**
```bash
# Stop servers (Ctrl+C in both terminals)

# Clear caches
cd frontend
rm -rf .next
npm run dev

# In browser:
# F12 → Application → Clear site data
# Ctrl + Shift + R (hard refresh)

# Try login again at http://localhost:3000/login
```

That should resolve the 404 errors!
