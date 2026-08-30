# System Workflow Diagrams

## 1. Booking Request & Approval Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     PUBLIC USER (Website)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1. Fill booking form
                              │ (book-now page)
                              ▼
                    POST /api/bookings/public
                              │
                              │ 2. Save to database
                              │ Status: PENDING
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                               │
│  • View all requests                                             │
│  • Filter & search                                               │
│  • See details                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
          3a. APPROVE              3b. REJECT
                    │                   │
                    ▼                   ▼
         POST /bookings/:id/approve    POST /bookings/:id/reject
                    │                   │
         4a. Generate PDF              4b. Get rejection reason
         5a. Send via WhatsApp         5b. Send via WhatsApp
         6a. Status = APPROVED          6b. Status = REJECTED
                    │                   │
                    ▼                   ▼
            Customer receives      Customer receives
            confirmation letter    rejection notice
```

## 2. Quotation Creation & Delivery Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN USER                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1. Create quotation
                              │ (Fill form with line items)
                              ▼
                     POST /api/quotations
                              │
                    ┌─────────┴─────────────────┐
                    │                           │
          2. Save to database           3. Auto-generate PDF
            Status: DRAFT                    (quotation.pdf)
                    │                           │
                    └─────────┬─────────────────┘
                              │
                    4. Auto-send via WhatsApp
                       (PDF attached)
                              │
                    5. Update Status: SENT
                              ▼
                  Customer receives quotation
                     on WhatsApp instantly
```

## 3. Password Change Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   USER / ADMIN (Dashboard)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1. Navigate to Profile
                              │ (Click sidebar link)
                              ▼
                    Profile Page Loads
                    /profile
                              │
                              │ 2. Fill password form:
                              │    • Current password
                              │    • New password  
                              │    • Confirm password
                              ▼
                 Frontend Validation
                 (Zod schema)
                              │
                    ┌─────────┴──────────┐
                    │                    │
            Valid ✓              Invalid ✗
                    │                    │
                    ▼                    ▼
        PATCH /auth/change-password    Show error
                    │
        3. Backend validates current password
                    │
            ┌───────┴───────┐
            │               │
      Valid ✓          Invalid ✗
            │               │
            ▼               ▼
    4. Hash new         Return 401
       password         Unauthorized
       (bcrypt)
            │
    5. Update user
       in database
            │
    6. Return success
            │
            ▼
    Success toast shown
    Form cleared
    User remains logged in
```

## 4. System Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                      PUBLIC WEBSITE                         │
│  • Home page                                                │
│  • About, Activities, Gallery                               │
│  • Book Now form (multi-step)                               │
│  • Contact                                                  │
└────────────────────────────────────────────────────────────┘
                         │
                         │ Submit booking
                         │ (No auth required)
                         ▼
┌────────────────────────────────────────────────────────────┐
│                    BACKEND API (NestJS)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Auth Module                                         │  │
│  │  • JWT authentication                                │  │
│  │  • Login / logout                                    │  │
│  │  • Change password ✅ NEW                           │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Bookings Module                                     │  │
│  │  • CRUD operations                                   │  │
│  │  • Approve / reject                                  │  │
│  │  • PDF generation                                    │  │
│  │  • Public endpoint                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Quotations Module                                   │  │
│  │  • Create quotation                                  │  │
│  │  • Auto-send WhatsApp                                │  │
│  │  • PDF generation                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  WhatsApp Service                                    │  │
│  │  • Twilio integration                                │  │
│  │  • Send messages                                     │  │
│  │  • Send media (PDFs)                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Users Module                                        │  │
│  │  • User management (CRUD)                            │  │
│  │  • Admin password reset                              │  │
│  │  • Role-based access                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                         │
                         │ Database queries
                         ▼
┌────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                        │
│  • users                                                    │
│  • bookings                                                 │
│  • quotations                                               │
│  • customers                                                │
│  • message_logs                                             │
└────────────────────────────────────────────────────────────┘
                         ▲
                         │ API calls
                         │
┌────────────────────────────────────────────────────────────┐
│               ADMIN DASHBOARD (Next.js)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Dashboard                                           │  │
│  │  • Statistics & metrics                              │  │
│  │  • Recent bookings/quotations                        │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Bookings                                            │  │
│  │  • View all requests                                 │  │
│  │  • Approve / reject                                  │  │
│  │  • Search & filter                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Quotations                                          │  │
│  │  • Create quotes                                     │  │
│  │  • Auto-send                                         │  │
│  │  • View history                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Profile ✅ NEW                                     │  │
│  │  • View account info                                 │  │
│  │  • Change password                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Users (Admin only)                                  │  │
│  │  • Manage users                                      │  │
│  │  • Reset passwords                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

## 5. Security Flow

```
┌────────────────────────────────────────────────────────────┐
│                     User Login                              │
└────────────────────────────────────────────────────────────┘
                         │
                         │ 1. POST /auth/login
                         │    { email, password }
                         ▼
              2. Find user by email
                         │
                 ┌───────┴────────┐
                 │                │
          Found ✓           Not found ✗
                 │                │
                 ▼                ▼
    3. Compare passwords     Return 401
       (bcrypt.compare)      "Invalid credentials"
                 │
         ┌───────┴────────┐
         │                │
    Valid ✓          Invalid ✗
         │                │
         ▼                ▼
 4. Generate JWT     Return 401
    token            "Invalid credentials"
         │
 5. Return token
    + user info
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│              Protected Route Access                         │
└────────────────────────────────────────────────────────────┘
         │
         │ Request with Authorization: Bearer <token>
         ▼
 6. JWT Guard verifies token
         │
  ┌──────┴──────┐
  │             │
Valid ✓    Invalid/Expired ✗
  │             │
  ▼             ▼
Extract     Return 401
user info   "Unauthorized"
  │
  ▼
7. Role Guard checks permissions
  │
  ┌────────┴─────────┐
  │                  │
Authorized ✓    Forbidden ✗
  │                  │
  ▼                  ▼
Allow access    Return 403
to endpoint     "Insufficient permissions"
```
