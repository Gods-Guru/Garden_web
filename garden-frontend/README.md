# 🌱 Community Garden Management System – Project Summary for GitHub Copilot

## 📌 Overview
This is a **full-stack web application** for managing a community garden. The system supports **multiple user roles** with **role-based access and dashboards**, and enables real-time interaction between admins, managers, and users (gardeners). It also supports core operations like garden plot requests, approvals, maintenance tracking, garden finances, events, and feedback.

---

## 👥 User Roles & Dashboards

### 1. **Admin**
- Manages system-wide users and roles.
- Creates/edit/deletes garden records.
- Reviews and assigns managers to specific gardens.
- Views detailed reports on garden status, finances, plots, etc.
- Handles escalated issues and returns.

### 2. **Manager**
- Assigned to one or more gardens by Admin.
- Approves or rejects garden plot requests within their assigned gardens.
- Tracks garden activity: maintenance, harvests, plots, events.
- Creates internal garden events.
- Communicates with users and handles disputes.
- Can escalate issues to Admin.

### 3. **User (Gardener)**
- Can register, log in, and view available gardens.
- Requests to join a garden and apply for a plot.
- Participates in garden events and activities.
- Submits feedback, suggestions, or complaints.
- Views own assigned plots and tasks.

---

## ⚙️ System Features (Grouped by Modules)

### ✅ Authentication & Authorization
- JWT-based authentication with protected routes.
- Role-based access control.
- Admin, Manager, and User dashboards with scoped permissions.

### 🌿 Garden Management
- CRUD for gardens (admin-only).
- Manager assignment to gardens.
- Plot listing per garden.

### 📦 Plot Application Workflow
- Users request to join gardens or apply for plots.
- Managers approve/reject applications.
- Status updates are reflected in the user’s dashboard.

### 🧹 Maintenance Tracking
- Managers log maintenance activities (watering, weeding, etc.).
- Users can view maintenance schedules for their plots.
- Activity logs are stored for reports.

### 💰 Financial Management (Optional Enhancement)
- Admin & Manager can log garden expenses/income.
- Track donations, purchases, labor, etc.
- Monthly summaries for admins.

### 📅 Event Management
- Managers can create events for users.
- Users can RSVP to garden events.
- Past and upcoming events tracked.

### 📨 Complaints & Feedback
- Users submit feedback or complaints.
- Managers/Admins can respond and change status (resolved, pending, escalated).

---

## 🔗 API & Backend Notes
- RESTful API built with Express and MongoDB.
- Models include: `User`, `Garden`, `Plot`, `PlotRequest`, `ActivityLog`, `Complaint`, `Event`, `FinanceRecord`.
- Backend uses `asyncHandler`, `AppError`, and role middleware to simplify request handling.
- Routes are prefixed with `/api/...` and secured using JWT.

---

## 💡 UI/UX Notes for Copilot
- Uses external `.scss` files, not Tailwind CSS.
- Component-based structure.
- Each page includes role-based UI logic, e.g.:
  - **Admin Dashboard:** tabs for users, garden reports, finances.
  - **Manager Dashboard:** plots list, garden status, complaint resolution.
  - **User Dashboard:** view plots, join garden, submit feedback, RSVP events.

---

## 🧠 Copilot Instructions
Copilot, please:
- Recognize role-based rendering and API requests.
- Understand that managers are not global admins.
- Use meaningful variable and function names (e.g., `handleApprovePlot`, `fetchUserComplaints`).
- Assume the backend follows REST standards and returns JSON with success/error codes.

I am building a full-stack community gardeneing management system application and I want you to scan my existing structure to ensure it works perfectly well. I am using jsx and scss for the frontend. It is to have the following:
---

### 1. **Home Page (Landing)**

**Frontend File:** `Home.jsx` or `Home.tsx`

```jsx
// Home.jsx
// Public-facing landing page for the Community Garden Management System
// This page introduces the platform to new visitors.
// Sections:
// - Hero banner with title and CTA (e.g., "Join the community", button to Register/Login)
// - Overview of what the system does
// - Features summary: plot management, event participation, community growth
// - Testimonials or success stories (optional)
// - Footer with contact info and social links
```

**No backend interaction** required here.

---

### 2. **About Us Page**

**Frontend File:** `AboutUs.jsx`

```jsx
// AboutUs.jsx
// Static informational page about the Community Garden project
// Should include:
// - Mission statement
// - How the system helps community growth
// - Benefits to users, managers, and admins
// - Optional: photos or history of the project
```

**No backend interaction** required.

---

### 3. **Features Page**

**Frontend File:** `Features.jsx`

```jsx
// Features.jsx
// Page describing key system features for different roles:
// - Gardeners: Plot application, activity log, events, tips
// - Managers: Plot assignment, event creation, complaint resolution
// - Admins: Full control, analytics, platform customization
// Display each feature in a card/grid layout with icons
```

**No backend interaction** required.

---

### 4. **Contact Us / Support Page**

**Frontend File:** `ContactUs.jsx`

```jsx
// ContactUs.jsx
// Page with a contact/support form for users to reach out to support/admin
// Fields: name, email, subject, message
// On submit: Send POST request to /api/support/contact
// Show confirmation message after successful submission
```

**Backend File:** `support.routes.js`

```js
// POST /api/support/contact
// Handles contact form submissions from users
// Request body: { name, email, subject, message }
// Save submission to DB table: supportMessages (optional)
// Send confirmation response back to frontend
router.post('/contact', async (req, res) => {
  // Copilot should generate the logic to store or email the message
});
```

---

### 5. **Login Page**

**Frontend File:** `Login.jsx`

```jsx
// Login.jsx
// Secure login form for all roles
// Fields: email/username, password
// On submit: POST to /api/auth/login
// If successful: redirect based on role
// - User → /dashboard
// - Manager → /manager-dashboard
// - Admin → /admin-dashboard
// Show error message if login fails
```

**Backend File:** `auth.routes.js`

```js
// POST /api/auth/login
// User login endpoint
// Request body: { email, password }
// Verify credentials, return JWT token and user role
// Respond with: { token, user: { id, name, role } }
router.post('/login', async (req, res) => {
  // Copilot will generate JWT authentication logic here
});
```

---

### 6. **Register Page**

**Frontend File:** `Register.jsx`

```jsx
// Register.jsx
// User registration form (for gardeners only)
// Fields: full name, email, password, confirm password
// On submit: POST to /api/auth/register
// After success: redirect to login or dashboard
// Optional: Add password strength indicator and validation
```

**Backend File:** `auth.routes.js`

```js
// POST /api/auth/register
// Handles user sign-up
// Request body: { name, email, password }
// Save user to DB with role: 'user'
// Hash password, return confirmation response
router.post('/register', async (req, res) => {
  // Copilot should implement registration with bcrypt and MongoDB (or SQL)
});
```

---

### 7. **Forgot Password / Reset Password**

**Frontend File(s):** `ForgotPassword.jsx`, `ResetPassword.jsx`

```jsx
// ForgotPassword.jsx
// Page where users can request a password reset
// Field: email
// On submit: POST to /api/auth/forgot-password
// Show success message if email is sent
```

```jsx
// ResetPassword.jsx
// Page users land on from reset email link
// Fields: new password, confirm new password
// On submit: POST to /api/auth/reset-password/:token
```

**Backend File:** `auth.routes.js`

```js
// POST /api/auth/forgot-password
// Send a password reset link to user's email
// Use a secure token and email service

// POST /api/auth/reset-password/:token
// Reset user's password
// Validate token, hash new password, update in DB
```

---

### 8. **404 / Error Page**

**Frontend File:** `NotFound.jsx`

```jsx
// NotFound.jsx
// Fallback page for broken links or unknown routes
// Message: "Page not found"
// Include link back to home or login
```

This is a **static frontend-only page**, no backend logic.

---

### 9. **Terms & Conditions / Privacy Policy**

**Frontend File:** `Terms.jsx`

```jsx
// Terms.jsx
// Static legal page with platform terms and privacy policy
// Include:
// - Data usage
// - Plot ownership disclaimers
// - User responsibilities
// Can be shown in a modal or standalone page
```

Again, **frontend-only**, but consider storing version/date in DB if you ever want to show change logs or enforce terms acceptance.

---

### 10. **User Dashboard**

**Frontend File:** `UserDashboard.jsx`

```jsx
// UserDashboard.jsx
// Main landing page after user login
// Show overview of:
// - Assigned plot (if any)
// - Gardening logs summary (last 5 logs)
// - Upcoming events
// - Latest announcements
// Requires GET requests to:
// - /api/plots/my-plot
// - /api/logs/user/:id
// - /api/events/upcoming
// - /api/announcements/user
```

**Backend Endpoints:** `dashboard.routes.js`, `logs.routes.js`, `events.routes.js`, `announcements.routes.js`

```js
// GET /api/plots/my-plot
// Returns plot info for authenticated user

// GET /api/logs/user/:id
// Returns user's recent garden activity logs

// GET /api/events/upcoming
// Returns list of upcoming community events

// GET /api/announcements/user
// Returns announcements relevant to this user
```

---

### 11. **Apply for Plot**

**Frontend File:** `ApplyForPlot.jsx`

```jsx
// ApplyForPlot.jsx
// Page where authenticated users (gardeners) can apply for a garden plot
// Fields:
// - Preferred garden location (dropdown)
// - Desired plot size (small/medium/large)
// - Reason for request (textarea)
// On submit: POST to /api/plots/apply
// Show success message and pending status
// Disable form if user already applied or has a plot
```

**Backend File:** `plot.routes.js`

```js
// POST /api/plots/apply
// User applies for a garden plot
// Body: { userId (from token), gardenId, plotSize, message }
// Check if user already has a plot or existing request
// Save to 'plotRequests' table/collection with status: "pending"
// Notify relevant Manager
router.post('/apply', authMiddleware, async (req, res) => {
  // Copilot will generate validation, check, save, and notify logic
});
```

---

### 12. **My Plot Details**

**Frontend File:** `MyPlot.jsx`

```jsx
// MyPlot.jsx
// Displays details of the user's assigned plot
// Includes:
// - Plot number/ID, size, garden name
// - Upload photo(s) of current state
// - Notes section for gardener to jot private info
// Fetch data from: GET /api/plots/my-plot
// Upload endpoint: POST /api/plots/my-plot/upload-image
```

**Backend File:** `plot.routes.js`

```js
// GET /api/plots/my-plot
// Return plot assigned to authenticated user

// POST /api/plots/my-plot/upload-image
// Upload photo of current plot condition
// Save photo to server/cloud and update plot image field
```

---

### 13. **Garden Activity Log**

**Frontend File:** `ActivityLog.jsx`

```jsx
// ActivityLog.jsx
// Users can create, view, edit, and delete their garden task logs
// Each log includes: date, activity description, optional photo
// Fetch logs: GET /api/logs/user/:id
// Create log: POST /api/logs
// Edit log: PUT /api/logs/:id
// Delete log: DELETE /api/logs/:id
```

**Backend File:** `logs.routes.js`

```js
// GET /api/logs/user/:id → Get all logs by user
// POST /api/logs → Add new garden log
// PUT /api/logs/:id → Update a log (only if owned by user)
// DELETE /api/logs/:id → Remove a log (only if owned by user)
```

---

### 14. **Garden Diary / Journal (Optional)**

**Frontend File:** `GardenDiary.jsx`

```jsx
// GardenDiary.jsx
// Displays a chronological view (timeline style) of user’s garden activity
// Pulls from the activity logs endpoint
// Optional filter by date range, tag (watering, planting, etc.)
// Add animations, icons, and images to make it engaging
```

No new backend logic — reuse `/api/logs/user/:id` with optional filters via query params.

---

### 15. **Event Participation Page**

**Frontend File:** `Events.jsx`

```jsx
// Events.jsx
// Users can view and RSVP for community gardening events
// Display upcoming events in card or list format
// Include RSVP button: POST to /api/events/:eventId/rsvp
// Show user’s RSVP status and joined events
// Fetch from: GET /api/events/upcoming
```

**Backend File:** `events.routes.js`

```js
// GET /api/events/upcoming → Fetch future events (sorted by date)
// POST /api/events/:eventId/rsvp
// Body: { userId }
// Add user to attendees list (avoid duplicate RSVPs)
```

---

### 16. **View Community Announcements**

**Frontend File:** `Announcements.jsx`

```jsx
// Announcements.jsx
// Show all announcements visible to logged-in user
// Announcements include: title, message, sender (admin/manager), date
// Filter by type (platform-wide, local garden, urgent)
// Fetch from: GET /api/announcements/user
```

**Backend File:** `announcements.routes.js`

```js
// GET /api/announcements/user
// Return announcements targeted to user’s role or assigned garden
// Optionally filter by importance (e.g., priority: "urgent")
```

---

### 17. **Garden Resources / Tips Page**

**Frontend File:** `Resources.jsx`

```jsx
// Resources.jsx
// Library of helpful guides, gardening tips, and downloadable PDFs
// Each item: title, short summary, download/view link
// Filter by category (soil, composting, pests, etc.)
// Fetch from: GET /api/resources/all
```

**Backend File:** `resources.routes.js`

```js
// GET /api/resources/all
// Return all uploaded gardening resources (admin uploads these)
// Optional query: ?category=soil
```

---

### 18. **Raise Complaint / Report Issue**

**Frontend File:** `ReportIssue.jsx`

```jsx
// ReportIssue.jsx
// Form to submit a garden-related complaint
// Fields: subject, description, attach optional photo
// Submit to: POST /api/complaints
// Show ticket status if submitted already
```

**Backend File:** `complaints.routes.js`

```js
// POST /api/complaints
// Submit complaint from authenticated user
// Save with status: "open", attach userId, timestamp
// Optionally notify Manager assigned to user’s garden
```

---

### 19. **Notifications Page**

**Frontend File:** `Notifications.jsx`

```jsx
// Notifications.jsx
// List of all system and role-specific notifications for the user
// Types: announcement, event reminder, complaint update, etc.
// Show read/unread status
// Mark as read: PATCH /api/notifications/:id/read
// Fetch: GET /api/notifications/user
```

**Backend File:** `notifications.routes.js`

```js
// GET /api/notifications/user → Fetch all notifications for user
// PATCH /api/notifications/:id/read → Mark notification as read
```

---

### 20. **Profile Page**

**Frontend File:** `Profile.jsx`

```jsx
// Profile.jsx
// Displays and allows update of user’s personal info
// Fields: name, phone, profile photo
// Fetch: GET /api/users/me
// Update: PUT /api/users/me
// Profile photo upload: POST /api/users/me/photo
```

**Backend File:** `users.routes.js`

```js
// GET /api/users/me → Return authenticated user’s profile
// PUT /api/users/me → Update personal details
// POST /api/users/me/photo → Upload/update profile picture
```
21. View Notifications (User)
Frontend File: Notifications.jsx

// Notifications.jsx
// Show list of notifications for the user
// Each includes:
//  - Title
//  - Message
//  - Timestamp
//  - Mark as read option
// GET /api/notifications
Backend Endpoint: GET /api/notifications

// Return notifications where recipient = current user
// Allow sorting by newest first
22. Mark Notification as Read
Frontend:

// Clicking "Mark as Read" calls:
// PATCH /api/notifications/:id/read
Backend Endpoint: PATCH /api/notifications/:id/read

// Mark notification as read for the current user
// Update 'readAt' timestamp
23. Report an Issue (User)
Frontend File: ReportIssue.jsx

// ReportIssue.jsx
// Users can submit an issue about a garden or plot
// Form includes:
//  - Issue type (dropdown: plot issue, facility, pest, other)
//  - Description
//  - Optional image upload
// POST /api/issues/report
Backend Endpoint: POST /api/issues/report

// Log user-submitted issue
// Save with status = "open"
// Assign to relevant admin/manager
24. Issue Tracker (Admin/Manager)
Frontend File: IssueTracker.jsx

// IssueTracker.jsx
// Table showing reported issues
// Includes:
//  - User
//  - Issue type
//  - Description
//  - Status
//  - Button to mark as resolved
// PATCH /api/issues/:id/resolve
Backend Endpoint: PATCH /api/issues/:id/resolve

// Mark issue as resolved
// Add resolver info and timestamp
// Notify the user
25. Community Events Calendar
Frontend File: EventsCalendar.jsx

// EventsCalendar.jsx
// Show upcoming gardening events in calendar format
// Allow filtering by garden
// Click on event to view full details
// Fetch from /api/events/upcoming
Backend Endpoint: GET /api/events/upcoming

// Return all upcoming public events
// Optionally filter by garden ID

## ✅ Page 26: **View Approved Plots** (Admin)

### 📁 Frontend: `ApprovedPlotsPage.jsx`

```jsx
// ApprovedPlotsPage.jsx
// Admin-only page to view all approved garden plots.
// Should fetch all approved plot requests.
// Display as a table or grid with: Plot ID, Assigned User, Garden Name, Plot Size, Date Approved
// Include filter by garden and date range
// Add button: [View Plot Details] to open full info in a modal or drawer
```

### 📁 Backend: `routes/adminPlots.js`

```js
// GET /api/admin/plots/approved
// Admin route to fetch all approved plots with optional filters: gardenId, dateFrom, dateTo
// Include plot info, assigned user, and garden name (via populate or JOIN)
```

---

## ✅ Page 27: **Assign Plot to User** (Admin)

### 📁 Frontend: `AssignPlotPage.jsx`

```jsx
// AssignPlotPage.jsx
// Admin interface to assign a specific plot to a registered user.
// Fields: User (dropdown), Garden (dropdown), Plot Size, Custom Notes
// On submit: POST to /api/admin/plots/assign
// Validate: Check if user already has a plot in the same garden
```

### 📁 Backend:

```js
// POST /api/admin/plots/assign
// Assign a plot to a specific user in a selected garden
// Validate no duplicate plot per garden per user
// Save to 'plots' table/collection with status "assigned" and assignedBy (admin ID)
```

---

## ✅ Page 28: **View Rejected Applications** (Admin)

### 📁 Frontend: `RejectedApplications.jsx`

```jsx
// RejectedApplications.jsx
// Admin-only page to view all rejected plot requests
// Display table with: Applicant, Garden, Request Date, Rejection Reason, Reviewed By
```

### 📁 Backend:

```js
// GET /api/admin/plots/rejected
// Return all plot requests with status "rejected" along with user info and rejection note
```

---

## ✅ Page 29: **All Gardens Overview** (Admin Dashboard)

### 📁 Frontend: `AllGardensOverview.jsx`

```jsx
// AllGardensOverview.jsx
// Dashboard card view of all gardens
// Each card shows: Garden Name, Total Plots, Assigned Plots, Vacant Plots
// Include pie chart or bar chart using Chart.js or Recharts
```

### 📁 Backend:

```js
// GET /api/admin/gardens/overview
// Returns summary stats for each garden: total plots, assigned, available
```

---

## ✅ Page 30: **Deactivate Garden** (Admin)

### 📁 Frontend: `DeactivateGardenPage.jsx`

```jsx
// DeactivateGardenPage.jsx
// Admin form to deactivate a garden (set active: false)
// Show warning: “This action will prevent new plots from being assigned in this garden.”
```

### 📁 Backend:

```js
// PATCH /api/admin/gardens/:id/deactivate
// Set garden.active = false
// Return updated garden document
```

---

## ✅ Page 31: **Manage Garden Managers** (Admin)

### 📁 Frontend: `ManageManagers.jsx`

```jsx
// ManageManagers.jsx
// Admin page to view, add, and remove second-level admins (Garden Managers)
// Table: Name, Email, Assigned Gardens
// Add button to assign a manager to a garden
```

### 📁 Backend:

```js
// GET /api/admin/managers
// Fetch all managers with their assigned gardens

// POST /api/admin/managers/assign
// Assign a manager to a specific garden
```

---

## ✅ Page 32: **Reports Dashboard** (Admin)

### 📁 Frontend: `ReportsDashboard.jsx`

```jsx
// ReportsDashboard.jsx
// Admin analytics dashboard
// Show charts: 
// - Applications Over Time
// - Approved vs Rejected
// - Plot Utilization by Garden
// - Return Rate (if applicable)
// Use filters: date range, garden, manager
```

### 📁 Backend:

```js
// GET /api/admin/reports/summary
// Return data for charts: applications, plot usage, approvals, rejections grouped by time
```

---

## ✅ Page 33: **Custom Notifications Page** (Admin)

### 📁 Frontend: `SendNotificationPage.jsx`

```jsx
// SendNotificationPage.jsx
// Admin page to send custom notifications to:
// - All users
// - Specific users
// - Users in a specific garden
// Fields: Title, Message Body, Audience Type
```

### 📁 Backend:

```js
// POST /api/admin/notifications
// Send notification to target users (all, by userId, or by gardenId)
// Save to notifications table and trigger real-time if sockets or push is supported
```

---

## ✅ Page 34: **Bulk Plot Assignment** (Admin)

### 📁 Frontend: `BulkPlotAssignment.jsx`

```jsx
// BulkPlotAssignment.jsx
// Admin tool to assign plots to multiple users in bulk
// Upload CSV with columns: User Email, Garden ID, Plot Size
// Parse CSV, preview assignments before confirmation
```

### 📁 Backend:

```js
// POST /api/admin/plots/bulk-assign
// Accept CSV file
// Parse entries, validate, and assign plots
// Return list of successful and failed assignments
```

---

## ✅ Page 35: **Garden Resource Upload** (Admin)

### 📁 Frontend: `UploadGardenResources.jsx`

```jsx
// UploadGardenResources.jsx
// Admin page to upload garden maps, guides, or resource documents
// Fields: Garden, File (PDF/image), Title, Description
// Show uploaded resources below
```

### 📁 Backend:

```js
// POST /api/admin/resources/upload
// Upload file with metadata: gardenId, title, description
// Save to ‘resources’ table with file URL
```

---

## ✅ Page 36: **View Resource Downloads** (Admin)

### 📁 Frontend: `ResourceDownloadStats.jsx`

```jsx
// ResourceDownloadStats.jsx
// Admin stats page for downloaded resources
// Table: Resource Name, Garden, Downloads Count, Last Downloaded
```

### 📁 Backend:

```js
// GET /api/admin/resources/stats
// Return each resource with download stats
```

---

## ✅ Page 37: **Site-Wide Announcements** (Admin)

### 📁 Frontend: `SiteAnnouncements.jsx`

```jsx
// SiteAnnouncements.jsx
// Admin can publish site-wide announcements
// Fields: Title, Message, Expiry Date
// Show current and expired announcements
```

### 📁 Backend:

```js
// POST /api/admin/announcements
// Create a new announcement

// GET /api/announcements
// Public endpoint to show all non-expired announcements
```

---

## ✅ Page 38: **Feedback and Complaints** (Admin View)

### 📁 Frontend: `ViewFeedbackPage.jsx`

```jsx
// ViewFeedbackPage.jsx
// Admin page to view feedback from users
// Table: User, Message, Type (feedback or complaint), Date, Status
// Ability to mark as resolved
```

### 📁 Backend:

```js
// GET /api/admin/feedback
// Fetch all user feedback and complaints

// PATCH /api/admin/feedback/:id/resolve
// Mark feedback as resolved
```

---

## ✅ Page 39: **Admin Profile Settings**

### 📁 Frontend: `AdminSettingsPage.jsx`

```jsx
// AdminSettingsPage.jsx
// Allow admin to update profile info, change password
// Sections: Personal Info, Password, Notification Preferences
```

### 📁 Backend:

```js
// PATCH /api/admin/profile/update
// Update admin profile info

// PATCH /api/admin/profile/password
// Change password with oldPassword and newPassword
```

---

## ✅ Page 40: **System Logs** (Super Admin Only)

### 📁 Frontend: `SystemLogsPage.jsx`

```jsx
// SystemLogsPage.jsx
// Super Admin page to view system logs (login attempts, CRUD actions, errors)
// Table with filters: Action Type, User, Date, Success/Failure
```

### 📁 Backend:

```js
// GET /api/admin/logs
// Return system logs with optional filters: userId, actionType, date range
```
### **41. View Messages (Admin Panel)**

**Frontend (React/SCSS):**

```jsx
// AdminMessages.jsx
// Admin view for reading messages sent via contact form or user feedback
// Fetch messages from /api/admin/messages
// Display: sender name, email, subject, message preview, date sent
// Allow sorting by date and filtering unread/read
```

**Backend (Node.js/Express):**

```js
// GET /api/admin/messages
// Admin-only route to fetch all messages from users
// Supports optional query params: ?status=unread or ?status=read
// Response: array of messages with sender info, subject, and timestamp
```

---

### **42. Message Detail Page**

**Frontend:**

```jsx
// MessageDetail.jsx
// Page that shows full message content when admin clicks on a message
// Fetch full message by ID from /api/admin/messages/:id
// Show: full sender info, subject, message body, date
```

**Backend:**

```js
// GET /api/admin/messages/:id
// Fetch a specific user message by its ID
// Response: sender name, email, subject, message, date, status
```

---

### **43. Mark Message as Read/Unread**

**Frontend:**

```jsx
// In MessageDetail or AdminMessages page
// Button to toggle message status between read and unread
// PATCH /api/admin/messages/:id/read-status
```

**Backend:**

```js
// PATCH /api/admin/messages/:id/read-status
// Toggle the "read" status of a message
// Request body: { status: "read" | "unread" }
```

---

### **44. Community Rules (Public)**

**Frontend:**

```jsx
// CommunityRules.jsx
// Public page listing all community garden rules
// Fetch from /api/public/rules
// Display rules in a styled list or collapsible format
```

**Backend:**

```js
// GET /api/public/rules
// Public endpoint to fetch rules of the garden community
// Response: array of rule objects (title, description)
```

---

### **45. Admin Manage Rules**

**Frontend:**

```jsx
// AdminRulesPanel.jsx
// Admin page to manage community rules
// CRUD UI: create, edit, delete rules
// Use /api/admin/rules endpoints
```

**Backend:**

```js
// POST /api/admin/rules — create a new rule
// PUT /api/admin/rules/:id — edit rule
// DELETE /api/admin/rules/:id — delete rule
```

---

### **46. Add Manager (Admin Only)**

**Frontend:**

```jsx
// AddManager.jsx
// Admin form to create a new Manager account
// Fields: name, email, phone, garden assignment
// On submit, POST to /api/admin/managers
```

**Backend:**

```js
// POST /api/admin/managers
// Admin-only route to create a new Manager user
// Validate inputs, assign roles, send invite email if needed
```

---

### **47. View Managers List**

**Frontend:**

```jsx
// ManagersList.jsx
// Admin page to list all current managers
// Fetch from /api/admin/managers
// Show name, contact info, assigned garden, and status
```

**Backend:**

```js
// GET /api/admin/managers
// Fetch all Manager-level users from database
// Include pagination and filtering options
```

---

### **48. Remove or Deactivate Manager**

**Frontend:**

```jsx
// Part of ManagersList.jsx
// Admin can either remove or deactivate a manager
// PATCH /api/admin/managers/:id/deactivate
// DELETE /api/admin/managers/:id
```

**Backend:**

```js
// PATCH /api/admin/managers/:id/deactivate
// Mark manager as inactive without deleting account
// DELETE /api/admin/managers/:id — permanently delete manager
```

---

### **49. Add Admin (Super Admin Only)**

**Frontend:**

```jsx
// AddAdmin.jsx
// Super admin form to create new admin account
// Fields: name, email, password, confirm password
// POST /api/superadmin/admins
```

**Backend:**

```js
// POST /api/superadmin/admins
// Super admin route to create new admin
// Validates for unique email, strong password
```

---

### **50. Admin List (Super Admin Only)**

**Frontend:**

```jsx
// AdminList.jsx
// List of all admins — viewable only by super admin
// Show name, email, role, created date, last login
```

**Backend:**

```js
// GET /api/superadmin/admins
// Super admin-only route
// Fetch all users with role = "admin"
```

---

### **51. System Notifications (Admin)**

**Frontend:**

```jsx
// Notifications.jsx
// Admin panel to view system alerts: new plot requests, user messages, etc.
// Fetch from /api/admin/notifications
```

**Backend:**

```js
// GET /api/admin/notifications
// Fetch recent alerts (limit to 50, sorted by date)
// Types: "new_plot_request", "message", "issue_report"
```

---

### **52. Send System Announcement**

**Frontend:**

```jsx
// SendAnnouncement.jsx
// Admin form to send announcement to users or managers
// Fields: title, body, audience (all, users only, managers only)
// POST to /api/admin/announcements
```

**Backend:**

```js
// POST /api/admin/announcements
// Admin sends announcement message to audience group
// Save to DB, notify relevant users
```

---

### **53. View Announcements (User + Manager)**

**Frontend:**

```jsx
// AnnouncementsPage.jsx
// Displays announcements sent by admin
// Fetch from /api/announcements
// Show title, body, timestamp, posted by
```

**Backend:**

```js
// GET /api/announcements
// Public/user-accessible route to view all announcements
```

---

### **54. Report a Garden Issue (User)**

**Frontend:**

```jsx
// ReportIssue.jsx
// User form to report a garden problem (e.g., irrigation, pests)
// Fields: issue type, description, garden, optional image
// POST /api/issues
```

**Backend:**

```js
// POST /api/issues
// Authenticated user submits a report
// Store issue with user info, timestamp, and pending status
```

---

### **55. Admin View Reported Issues**

**Frontend:**

```jsx
// ReportedIssuesPanel.jsx
// Admin page to view and manage reported garden issues
// Filter by garden or status (pending/resolved)
// Update status or assign manager
```

**Backend:**

```js
// GET /api/admin/issues
// Fetch all reported issues
// PATCH /api/admin/issues/:id/status — mark as resolved or in progress
```

---

### **56. Site Settings (Admin)**

**Frontend:**

```jsx
// SiteSettings.jsx
// Admin panel to adjust settings like platform name, logo, email templates
// Fetch current settings from /api/admin/settings
// PUT /api/admin/settings to update
```

**Backend:**

```js
// GET /api/admin/settings — fetch current platform settings
// PUT /api/admin/settings — update site config (admin only)
```

---

### **57. Audit Logs (Super Admin)**

**Frontend:**

```jsx
// AuditLogs.jsx
// Super admin panel to view key actions in the system (logins, plot approvals, deletions)
// Fetch logs from /api/superadmin/audit-logs
// Filter by user, action type, or date
```

**Backend:**

```js
// GET /api/superadmin/audit-logs
// Fetch log entries showing who did what and when
// Logged actions: login, create, update, delete, assign
```

And:
Let’s approach this like a **complete product team** designing an **enterprise-level, community-focused platform** with clear **role-based access**, **professional polish**, and **scalable structure**.

Below is a **comprehensive and thoughtfully organized breakdown** of the pages your system should include — grouped by **core sections**, **user roles**, and **best practices** for a truly impressive application.

---

## 🧭 **A. General Pages (Accessible to Everyone)**

| Page                           | Purpose                                         |
| ------------------------------ | ----------------------------------------------- |
| **1. Home (Landing Page)**     | Public-facing introduction to the platform      |
| **2. About Us**                | Project overview, mission, and impact statement |
| **3. Features**                | Benefits of the system across user types        |
| **4. Contact / Support**       | Communication channel for inquiries or issues   |
| **5. Login**                   | Secure authentication                           |
| **6. Register**                | User account creation                           |
| **7. Forgot / Reset Password** | Account recovery mechanism                      |
| **8. 404 / Error Page**        | Handles navigation or access errors             |
| **9. Terms & Privacy Policy**  | Legal and compliance information                |

---

## 👤 **B. Authenticated User Pages (Regular Users/Gardeners)**

| Page                                | Purpose                                    |
| ----------------------------------- | ------------------------------------------ |
| **10. Dashboard**                   | Personalized summary: plots, logs, events  |
| **11. Apply for Plot**              | Submit a request for a gardening plot      |
| **12. My Plot**                     | View assigned plot, notes, uploads         |
| **13. Activity Log**                | Record and track gardening tasks           |
| **14. Garden Diary / Journal**      | Chronological activity feed with photos    |
| **15. Events Participation**        | Browse and join upcoming events            |
| **16. Announcements**               | Read community-wide updates                |
| **17. Gardening Resources**         | Access tips, guides, and best practices    |
| **18. Report an Issue**             | Flag problems (e.g., pests, damaged plots) |
| **19. Notifications**               | View alerts and system messages            |
| **20. Profile Settings**            | Update personal information                |
| **21. Change Password**             | Manage account security                    |
| **22. Messages / Forum (Optional)** | Connect with other users or moderators     |

---

## 🧑‍🌾 **C. Manager Pages (Second-Level Admins)**

| Page                               | Purpose                                                             |
| ---------------------------------- | ------------------------------------------------------------------- |
| **23. Manager Dashboard**          | Overview of assigned gardens, users, and activity                   |
| **24. Plot Requests**              | View and respond to incoming plot applications                      |
| **25. Assign Plot**                | Allocate plots manually to users                                    |
| **26. View Activity Logs**         | Monitor user-submitted gardening records                            |
| **27. Manage Events (Local)**      | Create and manage events for their assigned gardens                 |
| **28. User Oversight**             | Access profiles and activity summaries of users in assigned gardens |
| **29. Garden Health Reports**      | Submit higher-level reports on garden status                        |
| **30. Send Announcements**         | Communicate with users within their jurisdiction                    |
| **31. Respond to Complaints**      | View, resolve, or escalate user issues                              |
| **32. Manager Notifications**      | Receive manager-specific alerts                                     |
| **33. Manager Profile / Settings** | Personal profile management with extended privileges                |

---

## 🛠️ **D. Admin Pages (Super Admins Only)**

| Page                                | Purpose                                             |
| ----------------------------------- | --------------------------------------------------- |
| **34. Admin Dashboard**             | System-wide overview and quick actions              |
| **35. Manage Gardens**              | Add, edit, or remove community gardens              |
| **36. Manage Plots**                | Define and edit plots within gardens                |
| **37. Assign Managers**             | Designate managers to specific gardens              |
| **38. Manage Users**                | Full control over user accounts                     |
| **39. Manage Managers**             | Promote, demote, suspend, or audit managers         |
| **40. View All Complaints**         | Oversee all reported issues                         |
| **41. Global Event Management**     | Create or manage platform-wide events               |
| **42. Analytics & Reports**         | Visualize platform usage, trends, and garden health |
| **43. Upload Resources**            | Share gardening tips, downloadable content          |
| **44. Platform-Wide Announcements** | System-level communication tool                     |
| **45. Data Backup & Export**        | Ensure data safety and accessibility                |
| **46. Platform Settings**           | General configurations (terms, caps, rules)         |
| **47. Admin Notifications**         | Receive alerts on system-wide events                |
| **48. Admin Profile / Settings**    | Admin-specific account controls                     |

---

## 🧩 **E. Advanced & Optional Pages (Go the Extra Mile)**

| Page                               | Purpose                                           |
| ---------------------------------- | ------------------------------------------------- |
| **49. Garden Gallery**             | Showcase community contributions with photos      |
| **50. Leaderboard / Achievements** | Reward active participation and event attendance  |
| **51. Interactive Garden Map**     | Visual, clickable layout of gardens and plot data |
| **52. Calendar View**              | Unified view of events, tasks, and logs           |
| **53. Real-Time Chat Center**      | Messaging between users, managers, or admins      |
| **54. Weather Integration**        | Forecasts to aid planting decisions               |
| **55. Admin Audit Logs**           | Track admin activity across the system            |
| **56. Heatmap Activity View**      | Visualize plot usage and community engagement     |
| **57. Feedback & Suggestions**     | Collect user ideas and recommendations            |

---

## 📱 **F. Mobile Optimization (Responsive & PWA Ready)**

All critical pages should be:

* Fully responsive (touch-first design)
* Mobile navigation–friendly (e.g., bottom nav bar)
* Lightweight and stackable for performance

---

## ✅ **Page Summary: 57 Total**

* **Core pages:** \~30
* **Role-specific features:** \~20
* **Advanced enhancements:** \~7+

> For MVP, focus on **Pages 1–33**, then roll out extras for scale or visual impact.

---

## 🧭 **User Flows by Role**

Let’s now explore how different roles navigate the system:

---

### 👤 **1. Regular User (Gardener)**

#### 🌱 Getting Started

1. Visit Home → Click **Register**
2. Fill form → Role auto-assigned as User
3. Login → Redirected to **User Dashboard**
4. Welcome message & guidance shown

#### 🪴 Apply for Plot

1. Navigate to **Apply for Plot**
2. Complete request form
3. Status: "Pending"
4. Get notified once approved → See assigned plot

#### 📔 Log Activities

1. Go to **My Plot**
2. Click **Add Log**
3. Input activity + upload photo
4. View in **Activity Log** (edit/delete allowed)

#### 📅 Join Events

1. Browse **Events Page**
2. Click **Join/RSVP**
3. Added to calendar + notification sent

#### 📢 Stay Informed

1. Read **Announcements**
2. Browse **Gardening Tips**
3. Use **Support** or **Raise Complaint**
4. Check **Notifications** regularly

#### 🔐 Manage Profile

1. Visit **Profile Page**
2. Update info, photo, password
3. Logout when done

---

### 🧑‍🌾 **2. Manager Flow**

#### 🎯 Access & Overview

1. Login → **Manager Dashboard**
2. View garden overview, requests, active users

#### 📝 Handle Plot Requests

1. Go to **Plot Requests**
2. Approve or reject applicants
3. Assign plots manually if needed

#### 📊 Monitor Activity

1. Go to **Activity Logs**
2. Review and export gardener activity

#### 📢 Announcements

1. Use **Send Announcement**
2. Select audience → Publish

#### 🛠 Manage Events

1. Go to **Events**
2. Click **Create Event** → Fill in details

#### ❗ Handle Complaints

1. Access **Complaints Page**
2. Review submissions → Resolve or escalate

---

### 🛠️ **3. Admin Flow**

#### 🧑‍💼 Dashboard & Insights

1. Login → **Admin Dashboard**
2. View KPIs: plots, complaints, user stats

#### 🌍 Garden Management

1. Navigate to **Manage Gardens**
2. Add/edit/delete garden entries
3. Manage plots within gardens

#### 👥 User & Manager Roles

1. Go to **User Management**
2. Promote users → Assign garden roles

#### 📣 Broadcast Messaging

1. Use **Send Platform Announcement**
2. Target system-wide or segmented users

#### 📈 Analytics

1. View system **Reports**
2. Export data (PDF/CSV)

#### 🔧 Admin Tools

1. Upload resources
2. Adjust platform settings
3. Review audit logs
4. Handle escalated issues
5. Backup/restore database

---

## 🔁 **Combined Role Flow Options**

| Role Combo          | Benefits                                                           |
| ------------------- | ------------------------------------------------------------------ |
| **User + Manager**  | Allows participation and oversight — switch via tab or role toggle |
| **Manager + Admin** | Enables garden-level and platform-level control for key personnel  |

---

## 🗺️ Presentation Tips (If Presenting)

* Use **flowcharts** for visual clarity
* Clearly label flows (e.g., *User → Apply for Plot → Pending → Assigned → Log Activities*)
* Color-code per role: **User**, **Manager**, **Admin**