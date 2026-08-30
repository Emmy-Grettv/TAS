# Testing Guide - Password Update Feature

## Quick Test: User Password Change

### Prerequisites
- Backend server running on http://localhost:3001
- Frontend running on http://localhost:3000
- User account credentials (either admin or regular user)

### Test Steps

#### 1. Login to Dashboard
```
URL: http://localhost:3000/login
Credentials: Use your existing user account
```

#### 2. Navigate to Profile
- After login, look at the sidebar navigation
- Click on "Profile" (icon: user circle)
- Or directly navigate to: http://localhost:3000/profile

#### 3. View Account Information
You should see a card displaying:
- Your name
- Your email address
- Your role (admin/user)

#### 4. Change Password
Fill out the form:
- **Current Password:** Enter your existing password
- **New Password:** Enter a new password (minimum 6 characters)
- **Confirm New Password:** Re-enter the new password

Click "Update Password"

#### 5. Expected Results

**Success Case:**
- Green success toast: "Password updated successfully"
- Form fields cleared
- You remain logged in

**Error Cases:**
- Wrong current password: Red error toast "Current password is incorrect"
- Passwords don't match: Red error message under confirm field
- New password too short: Red error "Password must be at least 6 characters"

#### 6. Verify Password Change
- Logout from the dashboard
- Try logging in with OLD password → Should FAIL
- Try logging in with NEW password → Should SUCCEED

---

## API Testing with Postman/Thunder Client

### 1. Login First
```http
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "admin@tegano.com",
  "password": "password123"
}
```

**Response:** Copy the `token` from response

### 2. Change Password
```http
PATCH http://localhost:3001/api/auth/change-password
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Success Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

**Error Response (401) - Wrong current password:**
```json
{
  "statusCode": 401,
  "message": "Current password is incorrect",
  "error": "Unauthorized"
}
```

**Error Response (400) - Validation failure:**
```json
{
  "statusCode": 400,
  "message": [
    "newPassword must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

---

## Complete Workflow Test

### Scenario: Admin manages bookings and changes password

#### Step 1: Public User Submits Booking
1. Go to: http://localhost:3000/book-now
2. Fill out the booking form (all 4 steps)
3. Submit the booking
4. Note the success message

#### Step 2: Admin Reviews Booking
1. Login as admin: http://localhost:3000/login
2. Navigate to: http://localhost:3000/bookings
3. See the new booking in "Pending" status
4. Click "View" (eye icon) to see details

#### Step 3: Admin Approves Booking
1. Click "Approve" button in the view modal
2. Confirm approval in the dialog
3. Wait for "Booking approved and notification sent" toast
4. Check that:
   - Status changed to "Approved" (green badge)
   - WhatsApp message sent to customer (check Twilio logs)
   - PDF generated in `backend/uploads/bookings/`

#### Step 4: Admin Changes Password
1. Click "Profile" in sidebar
2. Fill password change form:
   - Current: your current password
   - New: new_secure_password_123
   - Confirm: new_secure_password_123
3. Click "Update Password"
4. See success message

#### Step 5: Verify New Password Works
1. Click logout (top right)
2. Login with NEW password
3. Confirm successful login
4. Dashboard should load normally

---

## Database Verification

### Check Password Hash Changed

```sql
-- Connect to PostgreSQL
psql -U postgres -d tegano_db

-- View user passwords (hashed)
SELECT id, name, email, LEFT(password, 20) as password_hash 
FROM users 
WHERE email = 'admin@tegano.com';

-- After password change, run again and compare hashes
-- They should be different
```

### Check Booking Status

```sql
-- View all bookings with status
SELECT 
  id,
  "schoolName",
  "contactPerson",
  telephone,
  status,
  "createdAt"
FROM bookings
ORDER BY "createdAt" DESC
LIMIT 10;
```

### Check Quotations Sent

```sql
-- View quotations and their send status
SELECT 
  id,
  "schoolName",
  "contactPerson",
  status,
  "documentPath",
  "createdAt"
FROM quotations
ORDER BY "createdAt" DESC;
```

---

## Security Testing

### Test 1: Cannot change password without current password
```http
PATCH http://localhost:3001/api/auth/change-password
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "currentPassword": "",
  "newPassword": "newpass123"
}
```
**Expected:** 400 Bad Request (validation error)

### Test 2: Wrong current password rejected
```http
PATCH http://localhost:3001/api/auth/change-password
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "currentPassword": "wrongpassword",
  "newPassword": "newpass123"
}
```
**Expected:** 401 Unauthorized - "Current password is incorrect"

### Test 3: Cannot change password without authentication
```http
PATCH http://localhost:3001/api/auth/change-password
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpass123"
}
```
**Expected:** 401 Unauthorized (no token)

### Test 4: Password too short rejected
```http
PATCH http://localhost:3001/api/auth/change-password
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "12345"
}
```
**Expected:** 400 Bad Request - validation error

---

## Frontend UI Testing

### Visual Checks

#### Profile Page (/profile)
- [ ] Page loads without errors
- [ ] Account information card displays correctly
- [ ] Name, email, role visible
- [ ] Password change form renders
- [ ] All input fields present
- [ ] Submit button styled correctly (green Tegano color)
- [ ] Form is responsive on mobile

#### Sidebar Navigation
- [ ] "Profile" link visible in sidebar
- [ ] User circle icon displayed
- [ ] Link highlights when active (green background)
- [ ] Available to both admin and regular users

### Interaction Checks
- [ ] Current password field masked (type=password)
- [ ] New password field masked
- [ ] Confirm password field masked
- [ ] Form validation shows errors in real-time
- [ ] Submit button shows loading state ("Updating...")
- [ ] Success toast appears and auto-dismisses
- [ ] Error toast appears and can be dismissed
- [ ] Form clears after successful submission

---

## Error Handling Tests

### Frontend Validation
1. **Empty fields:**
   - Leave fields empty and submit
   - Should show "required" errors

2. **Password mismatch:**
   - New: "password123"
   - Confirm: "password456"
   - Should show "Passwords do not match"

3. **Too short:**
   - New: "12345"
   - Should show "Password must be at least 6 characters"

### Backend Validation
1. **Invalid token:**
   - Use expired/invalid JWT
   - Should return 401 Unauthorized

2. **Wrong current password:**
   - Provide incorrect current password
   - Should return 401 with message

3. **Network error:**
   - Stop backend server
   - Submit form
   - Should show "Failed to update password"

---

## Performance Testing

### Load Test Password Changes
```bash
# Using Apache Bench (if installed)
ab -n 100 -c 10 \
   -H "Authorization: Bearer YOUR_TOKEN" \
   -H "Content-Type: application/json" \
   -p password_payload.json \
   http://localhost:3001/api/auth/change-password
```

**Expected:** All requests should complete in < 500ms

---

## Integration Testing Checklist

- [ ] User can login with default credentials
- [ ] User can navigate to profile page
- [ ] Profile page displays correct user information
- [ ] Password change form validates input
- [ ] Correct password change succeeds
- [ ] Incorrect current password fails appropriately
- [ ] Password is hashed in database (not plain text)
- [ ] User can login with new password after change
- [ ] Old password no longer works after change
- [ ] JWT token remains valid after password change
- [ ] Other users cannot change another user's password
- [ ] Admin can still use admin-reset endpoint for users
- [ ] Bookings approval workflow still works
- [ ] Quotations creation and sending still works

---

## Common Issues & Solutions

### Issue 1: "Failed to update password"
**Causes:**
- Backend not running
- Wrong API URL in frontend .env.local
- Network connectivity issue

**Solution:**
- Verify backend is running: `cd backend && npm run start:dev`
- Check frontend .env.local has correct API_URL
- Check browser console for specific error

### Issue 2: "Current password is incorrect"
**Causes:**
- Actually entering wrong password
- Password was recently changed elsewhere
- Copy-paste added extra spaces

**Solution:**
- Double-check current password
- Try logging out and back in with current password first
- Type password manually (don't paste)

### Issue 3: Profile page shows 404
**Causes:**
- Frontend not rebuilt after adding new page
- Route not registered
- Browser cache

**Solution:**
- Restart Next.js dev server
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)

### Issue 4: Sidebar doesn't show Profile link
**Causes:**
- Frontend not updated
- Component not re-rendered

**Solution:**
- Refresh the page
- Check Sidebar.tsx was updated correctly
- Restart frontend dev server

---

## Automated Test Script (Optional)

### Using curl

```bash
#!/bin/bash

# Test 1: Login
echo "Test 1: Login"
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tegano.com","password":"password123"}' \
  -s | jq -r '.token')

echo "Token: ${TOKEN:0:20}..."

# Test 2: Change Password
echo "\nTest 2: Change Password"
curl -X PATCH http://localhost:3001/api/auth/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"password123","newPassword":"newpass123"}' \
  -v

# Test 3: Login with new password
echo "\nTest 3: Login with new password"
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tegano.com","password":"newpass123"}' \
  -v

# Test 4: Restore old password
echo "\nTest 4: Restore original password"
NEW_TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tegano.com","password":"newpass123"}' \
  -s | jq -r '.token')

curl -X PATCH http://localhost:3001/api/auth/change-password \
  -H "Authorization: Bearer $NEW_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"newpass123","newPassword":"password123"}' \
  -v

echo "\nAll tests completed!"
```

---

## Test Results Template

### Test Session: [Date]
**Tester:** [Name]  
**Environment:** Development / Staging / Production

| Test Case | Status | Notes |
|-----------|--------|-------|
| Login works | ✅/❌ | |
| Profile page loads | ✅/❌ | |
| Account info displays | ✅/❌ | |
| Form validation works | ✅/❌ | |
| Successful password change | ✅/❌ | |
| Error handling correct | ✅/❌ | |
| New password login works | ✅/❌ | |
| Old password fails | ✅/❌ | |
| Security checks pass | ✅/❌ | |
| UI responsive | ✅/❌ | |

**Overall Status:** PASS / FAIL / PARTIAL

**Additional Comments:**
_[Add any observations, bugs found, or suggestions]_

---

## Quick Smoke Test (2 minutes)

```
1. ✓ Open http://localhost:3000/login
2. ✓ Login as admin
3. ✓ Click "Profile" in sidebar
4. ✓ See your account info
5. ✓ Change password (current: password123, new: test123456)
6. ✓ See success message
7. ✓ Logout
8. ✓ Login with new password (test123456)
9. ✓ Change password back to original
10. ✓ Done! ✅
```

---

**Happy Testing! 🚀**

If you encounter any issues not covered here, check:
1. Backend console logs
2. Frontend browser console
3. Network tab in DevTools
4. Database connection status
