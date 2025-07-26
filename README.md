# 🌱 Community Garden Management System

A comprehensive, full-stack web application for managing community gardens, built with modern technologies and designed for scalability and user experience.

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## 🎯 Overview

The Community Garden Management System is a professional-grade application that enables communities to efficiently manage shared gardening spaces. It provides tools for plot management, task coordination, event organization, and community engagement.

### ✨ Key Features

- **🔐 Multi-Role Authentication** - Admin, Garden Manager, and User roles with granular permissions
- **🏡 Garden Management** - Create and manage multiple community gardens
- **📍 Plot Tracking** - Assign, monitor, and maintain individual garden plots
- **📋 Task Management** - Create, assign, and track gardening tasks with progress monitoring
- **📅 Event Organization** - Plan workshops, volunteer days, and community events
- **💬 Community Forum** - Share knowledge, ask questions, and connect with other gardeners
- **💳 Payment Processing** - Handle plot fees, donations, and financial transactions
- **📱 Mobile Responsive** - Fully responsive design for all devices
- **🌙 Dark Mode** - Complete dark mode support throughout the application

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
```
garden-backend/
├── src/
│   ├── controllers/     # API route handlers
│   ├── models/         # MongoDB schemas with Mongoose
│   ├── routes/         # Express route definitions
│   ├── middleware/     # Authentication, validation, error handling
│   ├── services/       # Business logic and external integrations
│   └── utils/          # Helper functions and utilities
├── uploads/            # File storage for images and documents
└── server.js          # Main server entry point
```

### Frontend (React + SCSS)
```
garden-frontend/
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/         # Main application pages
│   ├── store/         # Zustand state management
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Helper functions
│   └── styles/        # SCSS stylesheets
└── public/            # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/community-garden-management.git
   cd community-garden-management
   ```

2. **Setup Backend**
   ```bash
   cd garden-backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Setup Frontend**
   ```bash
   cd ../garden-frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd garden-backend
   npm run dev

   # Terminal 2 - Frontend
   cd garden-frontend
   npm start
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/garden-management

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Community Garden <noreply@yourdomain.com>

# Server
PORT=5000
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Frontend Environment Variables (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Community Garden Management
REACT_APP_VERSION=1.0.0
```

## 📊 Database Models

### Core Models
- **User** - Authentication, profiles, roles, and permissions
- **Garden** - Community garden information and settings
- **Plot** - Individual garden plots with assignments and tracking
- **Task** - Gardening tasks with assignments and progress
- **Event** - Community events with registration and attendance
- **Application** - Plot applications with review workflow
- **Post** - Community forum posts and discussions
- **Notification** - Multi-channel notification system
- **Payment** - Financial transactions and billing

## 🎨 User Interface

### Design System
- **Color Palette**: Nature-inspired greens with professional accents
- **Typography**: Clean, readable fonts optimized for accessibility
- **Components**: Consistent, reusable UI components
- **Responsive**: Mobile-first design that works on all screen sizes
- **Accessibility**: WCAG 2.1 compliant with proper ARIA labels

### Key Pages
- **Dashboard** - Overview with stats, tasks, and recent activity
- **Gardens** - Browse and manage community gardens
- **Plots** - View and manage assigned garden plots
- **Tasks** - Create, assign, and track gardening tasks
- **Events** - Discover and register for community events
- **Community** - Forum for discussions and knowledge sharing
- **Profile** - User settings and preferences

## 🔐 Security Features

- **JWT Authentication** with refresh tokens
- **Role-Based Access Control** (RBAC)
- **Input Validation** and sanitization
- **Rate Limiting** to prevent abuse
- **CORS Protection** for cross-origin requests
- **Helmet.js** for security headers
- **Password Hashing** with bcrypt
- **File Upload Security** with type and size validation

## 🧪 Testing

### Model Validation
```bash
cd garden-backend
node test-models.js --validate
```

### API Testing
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### Garden Management
- `GET /api/gardens` - List all gardens
- `POST /api/gardens` - Create new garden
- `GET /api/gardens/:id` - Get garden details
- `PUT /api/gardens/:id` - Update garden
- `DELETE /api/gardens/:id` - Delete garden

### Plot Management
- `GET /api/plots` - List plots
- `POST /api/plots` - Create new plot
- `GET /api/plots/:id` - Get plot details
- `PUT /api/plots/:id` - Update plot
- `POST /api/plots/:id/assign` - Assign plot to user

### Task Management
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `POST /api/tasks/:id/complete` - Mark task as complete

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   # Set production environment variables
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/garden-management
   ```

2. **Build Frontend**
   ```bash
   cd garden-frontend
   npm run build
   ```

3. **Deploy Backend**
   ```bash
   cd garden-backend
   npm install --production
   npm start
   ```

### Recommended Hosting
- **Backend**: Heroku, DigitalOcean, AWS EC2
- **Frontend**: Netlify, Vercel, AWS S3 + CloudFront
- **Database**: MongoDB Atlas
- **File Storage**: AWS S3, Cloudinary

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration for code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design for UI changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React** - Frontend framework
- **Node.js & Express** - Backend framework
- **MongoDB & Mongoose** - Database and ODM
- **React Icons** - Icon library
- **SCSS** - Styling preprocessor
- **Zustand** - State management

## 📞 Support

For support, email support@yourdomain.com or create an issue in the GitHub repository.

---

**Built with ❤️ for the gardening community** 🌱
