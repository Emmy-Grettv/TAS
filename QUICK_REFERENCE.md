# Quick Reference Card - Tegano CMS

## 🚀 Start the System

```bash
# Terminal 1: Start Backend
cd backend
npm run start:dev

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

**Backend:** http://localhost:3001  
**Frontend:** http://localhost:3000

---

## 🔑 Default Login

```
Email: admin@tegano.com
Password: Admin@123
```

⚠️ **Change this immediately after first login!**

---

## 📍 Important URLs

| Page | URL |
|------|-----|
| Public Website | http://localhost:3000 |
| Book Now Form | http://localhost:3000/book-now |
| Admin Login | http://localhost:3000/login |
| Dashboard | http://localhost:3000/dashboard |
| Bookings | http://localhost:3000/bookings |
| Quotations | http://localhost:3000/quotations |
| Profile | http://localhost:3000/profile |
| Users (Admin) | http://localhost:3000/users |

---

## ✅ What Works

### Booking Approval Workflow
1. User submits booking from website
2. Appears as "Pending" in admin dashboard
3. Admin clicks "Approve"
4. **System automatically:**
   - ✅ Generates PDF confirmation letter
   - ✅ Sends WhatsApp with PDF attached
   - ✅ Updates status to "Approved"

### Quotation Workflow
1. Admin creates quotation with line items
2. Submits form
3. **System automatically:**
   - ✅ Generates professional quotation PDF
   - ✅ Sends WhatsApp with PDF attached
   - ✅ Marks as "Sent"

### Password Management
1. Any user clicks "Profile" in sidebar
2. Fills password change form
3. **System:**
   - ✅ Verifies current password
   - ✅ Updates with secure hashing
   - ✅ Shows success notification

---

## 📝 Generated PDFs

### Confirmation Letter
- Professional letterhead
- "Re: Reservation Confirmation – School Trip Visit"
- All booking details
- Annexure 1 with activities
- Matches your template exactly ✅

### Quotation
- Blue "QUOTATION" banner
- Professional pricing table
- Payment terms
- Annexure 1 with activities
- Signature section
- Matches your template exactly ✅

**PDF Location:** `backend/uploads/`
- `bookings/Reservation_[id].pdf`
- `quotations/Quotation_[id].pdf`

---

## 🎯 Quick Actions

### Approve a Booking
1. Dashboard → Bookings
2. Click "View" on pending booking
3. Click "Approve"
4. Confirm
5. Done! PDF + WhatsApp sent automatically

### Reject a Booking
1. Dashboard → Bookings
2. Click "View" on pending booking
3. Click "Reject"
4. Enter rejection reason (required)
5. Submit
6. Done! WhatsApp sent with reason

### Create & Send Quote
1. Dashboard → Quotations
2. Click "New Quotation"
3. Fill school details
4. Add line items (description, qty, price)
5. Submit
6. Done! PDF + WhatsApp sent automatically

### Change Your Password
1. Click "Profile" in sidebar
2. Enter current password
3. Enter new password (min 6 chars)
4. Confirm new password
5. Click "Update Password"
6. Done! Password changed securely

---

## 🔧 Troubleshooting

### Backend Won't Start
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Stop any node processes
taskkill /F /IM node.exe

# Restart backend
cd backend
npm run start:dev
```

### Frontend Won't Start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Restart frontend
cd frontend
npm run dev
```

### WhatsApp Not Sending
1. Check Twilio credentials in `backend/.env`
2. Verify `PUBLIC_APP_URL` is accessible
3. Check Twilio account balance
4. View backend logs for errors

### Can't Login
1. Check backend is running (port 3001)
2. Verify database connection
3. Check credentials: `admin@tegano.com` / `Admin@123`
4. Try resetting password (see below)

### Password Change Fails
1. Verify current password is correct
2. Check new password is 6+ characters
3. Ensure confirm password matches
4. Check backend logs for errors
5. Try logging out and back in

---

## 🗄️ Database Commands

### Connect to Database
```bash
psql -U postgres -d tegano_db
```

### View All Users
```sql
SELECT id, name, email, role, "isActive" 
FROM users;
```

### Reset Admin Password
```sql
-- Resets password to: password123
UPDATE users 
SET password = '$2a$10$rG7iKZLXEKYHSfVZjZz2ouWQQP6EL3fUVE5YE5OEb8K9C1YdLLJgq'
WHERE email = 'admin@tegano.com';
```

### View Recent Bookings
```sql
SELECT 
  "schoolName",
  "contactPerson",
  status,
  "dateOfVisit",
  "createdAt"
FROM bookings
ORDER BY "createdAt" DESC
LIMIT 10;
```

### View Quotations
```sql
SELECT 
  "schoolName",
  "contactPerson",
  status,
  "documentPath",
  "createdAt"
FROM quotations
ORDER BY "createdAt" DESC;
```

---

## 📊 Status Badges

### Bookings
- 🟡 **Pending** - Waiting for admin review
- 🟢 **Approved** - Confirmed with PDF + WhatsApp sent
- 🔴 **Rejected** - Declined with reason

### Quotations
- ⚪ **Draft** - Created but not sent
- 🟢 **Sent** - Delivered via WhatsApp

---

## 🔐 User Roles

### Admin
✅ Can approve/reject bookings  
✅ Can create quotations  
✅ Can manage users  
✅ Can change own password  
✅ Can reset other users' passwords  

### Regular User
✅ Can create quotations  
✅ Can view own data  
✅ Can change own password  
❌ Cannot approve/reject bookings  
❌ Cannot manage other users  

---

## 📱 WhatsApp Messages

### Booking Approved
```
Good day [Contact Person],

Your reservation at Tegano Recreation Center 
has been approved.

Please find attached your reservation 
confirmation letter.

We look forward to welcoming your learners.

Kind regards,
Tegano Recreation Center

[PDF Attachment: Reservation confirmation]
```

### Booking Rejected
```
Good day [Contact Person],

We regret to inform you that your reservation 
request for Tegano Recreation Center has not 
been approved.

Reason:
[Admin's rejection reason]

For further assistance, please contact us.

Kind regards,
Tegano Recreation Center
```

### Quotation Sent
```
Good day [Contact Person],

Please find attached the quotation for your 
upcoming school trip to Tegano Recreation Center.

For any questions or clarifications, kindly 
contact us.

Kind regards,
Tegano Recreation Center

[PDF Attachment: Quotation]
```

---

## 🎨 Color Scheme

- **Primary Green:** #2D9B4E (Tegano brand)
- **Secondary Blue:** #0066cc (Headers, banners)
- **Success:** Green badges
- **Warning:** Yellow badges (Pending)
- **Danger:** Red badges (Rejected)

---

## 📄 Documentation Files

1. **IMPLEMENTATION_SUMMARY.md** - Complete feature docs
2. **TESTING_GUIDE.md** - Testing procedures
3. **WORKFLOW_DIAGRAM.md** - Visual architecture
4. **QUICK_START.md** - Setup instructions
5. **SYSTEM_OVERVIEW.md** - Complete system overview
6. **QUICK_REFERENCE.md** - This file

---

## ✨ Key Features at a Glance

✅ Public booking form  
✅ Admin dashboard  
✅ One-click approval with PDF + WhatsApp  
✅ Rejection with reason + WhatsApp  
✅ Professional confirmation letters  
✅ Quote creation & auto-delivery  
✅ Self-service password management  
✅ Role-based access control  
✅ Real-time status tracking  
✅ Search & filter  
✅ Responsive design  

---

## 🆘 Quick Help

**System not working?**
1. Check both terminals are running
2. Verify database is running
3. Check environment variables
4. Review error messages
5. Check documentation files

**Need to test everything?**
See **TESTING_GUIDE.md** for complete test procedures.

**Need setup help?**
See **QUICK_START.md** for step-by-step setup.

**Need feature details?**
See **IMPLEMENTATION_SUMMARY.md** for complete documentation.

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Status:** Production Ready ✅
