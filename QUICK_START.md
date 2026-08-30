# Quick Start Guide - Tegano Recreation Center CMS

## 🚀 What's New

### ✅ Just Implemented
1. **User Self-Service Password Change** - All users can now change their own passwords securely
2. **Admin Self-Service Password Change** - Admins can change their own passwords from profile
3. **Profile Settings Page** - New dedicated page for account management

### ✅ Already Working
1. **Public Booking Submission** - Users can submit requests from website
2. **Admin Dashboard** - Real-time display of all requests
3. **Approval Workflow** - One-click approve with auto PDF + WhatsApp
4. **Rejection Workflow** - Reject with reason and auto WhatsApp notification
5. **Quotation System** - Create quotes with auto-send to WhatsApp
6. **WhatsApp Integration** - Twilio-powered messaging with PDF attachments

---

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Twilio account with WhatsApp sandbox (or production number)
- npm or yarn package manager

---

## ⚡ Quick Setup (5 minutes)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# Required variables:
# - DATABASE credentials
# - JWT_SECRET
# - TWILIO credentials
# - PUBLIC_APP_URL

# Run database migrations
npm run typeorm migration:run

# Seed initial data (creates admin user)
npm run seed

# Start backend server
npm run start:dev

# Backend will run on http://localhost:3001
```

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

# Start frontend server
npm run dev

# Frontend will run on http://localhost:3000
```

### 3. Verify Installation

**Test Backend:**
```bash
curl http://localhost:3001/api/bookings/stats
```

**Test Frontend:**
Open browser: http://localhost:3000

---

## 🔑 Default Credentials

After running the seed script:

```
Email: admin@tegano.com
Password: password123
```

**⚠️ IMPORTANT:** Change this password immediately after first login!

---

## 🎯 Test the New Features (2 minutes)

### Test Password Change

1. **Login**
   - Go to http://localhost:3000/login
   - Use default credentials above

2. **Navigate to Profile**
   - Click "Profile" in the sidebar (user icon)
   - Or go directly to: http://localhost:3000/profile

3. **Change Password**
   - Current Password: `password123`
   - New Password: `MyNewPassword123`
   - Confirm Password: `MyNewPassword123`
   - Click "Update Password"

4. **Verify**
   - Logout
   - Login with new password
   - Should succeed ✅

5. **Reset (Optional)**
   - Login with new password
   - Go to Profile again
   - Change back to `password123`

---

## 📝 Test Complete Workflow

### A. Public Booking Submission

1. Open http://localhost:3000/book-now
2. Fill the 4-step form:
   - Step 1: School details
   - Step 2: Contact & visit date
   - Step 3: Group size
   - Step 4: Review
3. Submit
4. See success confirmation

### B. Admin Approval

1. Login as admin
2. Go to http://localhost:3000/bookings
3. Find the new booking (status: Pending)
4. Click "View" (eye icon)
5. Click "Approve" button
6. Confirm approval
7. **What happens:**
   - PDF generated in `backend/uploads/bookings/`
   - WhatsApp sent to customer
   - Status changes to "Approved"
   - Green success toast appears

### C. Create & Send Quotation

1. Go to http://localhost:3000/quotations
2. Click "New Quotation"
3. Fill form:
   - School name
   - Contact details
   - Add line items (description, qty, price)
4. Submit
5. **What happens:**
   - Quotation saved
   - PDF auto-generated
   - WhatsApp auto-sent to customer
   - Status: "Sent"

---

## 🔧 Configuration Files

### Backend .env
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=tegano_db

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRATION=7d

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Public URL (for PDF links)
PUBLIC_APP_URL=http://localhost:3001
```

### Frontend .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 📱 WhatsApp Setup

### Development (Sandbox)

1. Go to https://console.twilio.com/
2. Navigate to Messaging → Try it out → Send a WhatsApp message
3. Join the sandbox by sending code to sandbox number
4. Use sandbox number in .env: `whatsapp:+14155238886`

### Production

1. Request WhatsApp Business approval from Twilio
2. Get production WhatsApp number
3. Update .env with production number
4. Set PUBLIC_APP_URL to production domain

---

## 🗂️ Project Structure

```
TAS/
├── backend/
│   ├── src/
│   │   ├── auth/              ✅ Password change added
│   │   ├── bookings/          ✅ Approval workflow
│   │   ├── quotations/        ✅ Auto-send feature
│   │   ├── whatsapp/          ✅ Twilio integration
│   │   └── users/             ✅ User management
│   ├── uploads/               📁 Generated PDFs
│   ├── assets/                🖼️ Logo & images
│   └── .env                   ⚙️ Configuration
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (dashboard)/
    │   │   │   ├── bookings/  ✅ Approval UI
    │   │   │   ├── profile/   ✅ NEW Password change
    │   │   │   └── quotations/ ✅ Quote UI
    │   │   └── (website)/
    │   │       └── book-now/  ✅ Public form
    │   ├── components/        🎨 Reusable UI
    │   └── store/             💾 Auth state
    └── .env.local             ⚙️ Configuration
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if PostgreSQL is running
psql -U postgres -l

# Check if port 3001 is available
netstat -ano | findstr :3001

# Check dependencies
cd backend
npm install
```

### Frontend won't start
```bash
# Check if port 3000 is available
netstat -ano | findstr :3000

# Clear cache and reinstall
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### WhatsApp not sending
- Verify Twilio credentials in .env
- Check Twilio console for errors
- Ensure phone number format: +263...
- Verify PUBLIC_APP_URL is accessible
- Check Twilio account balance

### Profile page shows 404
- Restart frontend: Ctrl+C then `npm run dev`
- Clear browser cache
- Check file exists: `frontend/src/app/(dashboard)/profile/page.tsx`

### Password change fails
- Verify current password is correct
- Check backend logs for errors
- Ensure JWT token is valid (re-login)
- Check network tab in browser DevTools

---

## 📊 Database Management

### View All Users
```sql
psql -U postgres -d tegano_db

SELECT id, name, email, role, "isActive" FROM users;
```

### Reset Admin Password (Emergency)
```sql
-- In psql
UPDATE users 
SET password = '$2a$10$rG7iKZLXEKYHSfVZjZz2ouWQQP6EL3fUVE5YE5OEb8K9C1YdLLJgq'
WHERE email = 'admin@tegano.com';
-- This resets password to: password123
```

### View Recent Bookings
```sql
SELECT 
  "schoolName",
  "contactPerson",
  status,
  "createdAt"
FROM bookings
ORDER BY "createdAt" DESC
LIMIT 10;
```

---

## 📚 Documentation

- **IMPLEMENTATION_SUMMARY.md** - Complete feature documentation
- **TESTING_GUIDE.md** - Detailed testing procedures
- **WORKFLOW_DIAGRAM.md** - Visual system architecture
- **README.md** - General project information

---

## 🚀 Production Deployment

### Checklist Before Going Live

#### Security
- [ ] Change default admin password
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database SSL

#### Environment
- [ ] Set PUBLIC_APP_URL to production domain
- [ ] Use production Twilio WhatsApp number
- [ ] Set up production database
- [ ] Configure backup strategy
- [ ] Set up monitoring (logs, errors)

#### Testing
- [ ] Test booking submission
- [ ] Test approval workflow
- [ ] Test WhatsApp delivery
- [ ] Test password changes
- [ ] Load testing
- [ ] Security scan

---

## 💡 Tips & Best Practices

### For Admins
1. Change your password immediately after first login
2. Review bookings daily
3. Keep Twilio account funded for WhatsApp
4. Backup PDFs regularly
5. Monitor system logs

### For Developers
1. Always test locally before deploying
2. Use environment variables (never hardcode secrets)
3. Keep dependencies updated
4. Review security best practices
5. Document any custom changes

### For Users
1. Use strong passwords (12+ characters)
2. Don't share login credentials
3. Logout when finished
4. Report suspicious activity
5. Keep browser updated

---

## 🆘 Support

### Getting Help

**Technical Issues:**
- Check troubleshooting section above
- Review documentation files
- Check backend/frontend logs
- Search GitHub issues

**Feature Requests:**
- Document the feature clearly
- Explain the use case
- Consider impact on existing features

**Bug Reports:**
- Describe steps to reproduce
- Include error messages
- Specify environment (dev/prod)
- Attach relevant logs

---

## ✨ What's Next?

### Suggested Enhancements
1. Email notifications (in addition to WhatsApp)
2. SMS fallback
3. Advanced reporting dashboard
4. Calendar integration
5. Payment gateway
6. Multi-language support
7. 2FA for admin accounts
8. Audit logs
9. Export to Excel/CSV
10. Automated reminders

---

## 🎉 Success Checklist

After setup, you should be able to:

- [ ] Login to admin dashboard
- [ ] View existing bookings
- [ ] Approve a booking (generates PDF)
- [ ] Reject a booking (with reason)
- [ ] Create a quotation
- [ ] Send quotation via WhatsApp
- [ ] Change your password
- [ ] View your profile
- [ ] Submit booking from website
- [ ] See WhatsApp messages delivered

**All checked? You're good to go! 🚀**

---

## 📞 Contact

For additional support or questions, contact the development team.

**Last Updated:** January 2025  
**Version:** 1.0  
**Project:** Tegano Recreation Center CMS
