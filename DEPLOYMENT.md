# 🚀 Deployment Guide - Community Garden Management System

This guide covers deploying the Community Garden Management System to production environments.

## 📋 Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] Production MongoDB database configured
- [ ] Environment variables set for production
- [ ] SSL certificates obtained
- [ ] Domain name configured
- [ ] Email service configured (Gmail, SendGrid, etc.)
- [ ] File storage configured (local or cloud)
- [ ] Payment processing configured (if applicable)

### ✅ Security Review
- [ ] JWT secrets are strong and unique
- [ ] Database credentials are secure
- [ ] API endpoints are properly protected
- [ ] CORS settings are configured for production
- [ ] Rate limiting is enabled
- [ ] Input validation is comprehensive

### ✅ Performance Optimization
- [ ] Frontend build is optimized
- [ ] Images are compressed
- [ ] Database indexes are created
- [ ] Caching strategies implemented
- [ ] CDN configured (if applicable)

## 🌐 Deployment Options

### Option 1: Traditional VPS/Server Deployment

#### Backend Deployment (Node.js + Express)

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js (using NodeSource repository)
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   
   # Install Nginx for reverse proxy
   sudo apt install nginx -y
   ```

2. **Application Setup**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/community-garden-management.git
   cd community-garden-management/garden-backend
   
   # Install dependencies
   npm install --production
   
   # Set up environment variables
   cp .env.example .env
   nano .env  # Edit with production values
   
   # Create uploads directory
   mkdir -p uploads
   chmod 755 uploads
   ```

3. **PM2 Configuration**
   ```bash
   # Create PM2 ecosystem file
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'garden-backend',
       script: 'server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 5000
       },
       error_file: './logs/err.log',
       out_file: './logs/out.log',
       log_file: './logs/combined.log',
       time: true
     }]
   };
   EOF
   
   # Start application
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Nginx Configuration**
   ```bash
   # Create Nginx configuration
   sudo cat > /etc/nginx/sites-available/garden-backend << EOF
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade \$http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host \$host;
           proxy_set_header X-Real-IP \$remote_addr;
           proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto \$scheme;
           proxy_cache_bypass \$http_upgrade;
       }
   }
   EOF
   
   # Enable site
   sudo ln -s /etc/nginx/sites-available/garden-backend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

#### Frontend Deployment (React)

1. **Build Application**
   ```bash
   cd ../garden-frontend
   
   # Set production environment variables
   cp .env.example .env.production
   nano .env.production  # Edit with production values
   
   # Build for production
   npm run build
   ```

2. **Nginx Configuration for Frontend**
   ```bash
   # Create Nginx configuration
   sudo cat > /etc/nginx/sites-available/garden-frontend << EOF
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /path/to/community-garden-management/garden-frontend/build;
       index index.html;
       
       location / {
           try_files \$uri \$uri/ /index.html;
       }
       
       location /static/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   EOF
   
   # Enable site
   sudo ln -s /etc/nginx/sites-available/garden-frontend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

3. **SSL Certificate (Let's Encrypt)**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx -y
   
   # Obtain SSL certificates
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   sudo certbot --nginx -d api.yourdomain.com
   
   # Auto-renewal
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Option 2: Cloud Platform Deployment

#### Heroku Deployment

1. **Backend (Heroku)**
   ```bash
   # Install Heroku CLI
   # Create Heroku app
   heroku create your-garden-backend
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   # ... set all other environment variables
   
   # Deploy
   git subtree push --prefix garden-backend heroku main
   ```

2. **Frontend (Netlify)**
   ```bash
   # Build and deploy to Netlify
   cd garden-frontend
   npm run build
   
   # Deploy using Netlify CLI
   npm install -g netlify-cli
   netlify deploy --prod --dir=build
   ```

#### DigitalOcean App Platform

1. **Create App Spec**
   ```yaml
   # app.yaml
   name: community-garden-management
   services:
   - name: backend
     source_dir: garden-backend
     github:
       repo: yourusername/community-garden-management
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: MONGODB_URI
       value: ${DATABASE_URL}
   
   - name: frontend
     source_dir: garden-frontend
     github:
       repo: yourusername/community-garden-management
       branch: main
     build_command: npm run build
     run_command: serve -s build
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
   ```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Configure network access (whitelist your server IPs)
   - Create database user with appropriate permissions

2. **Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/garden-management?retryWrites=true&w=majority
   ```

### Self-Hosted MongoDB

1. **Installation**
   ```bash
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   
   # Start MongoDB
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

2. **Security Configuration**
   ```bash
   # Create admin user
   mongo
   > use admin
   > db.createUser({
       user: "admin",
       pwd: "secure_password",
       roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
     })
   
   # Enable authentication
   sudo nano /etc/mongod.conf
   # Add:
   # security:
   #   authorization: enabled
   
   sudo systemctl restart mongod
   ```

## 📧 Email Service Configuration

### Gmail Setup
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

### SendGrid Setup
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
```

## 🔍 Monitoring and Logging

### PM2 Monitoring
```bash
# View logs
pm2 logs garden-backend

# Monitor processes
pm2 monit

# Restart application
pm2 restart garden-backend
```

### Log Rotation
```bash
# Install logrotate configuration
sudo cat > /etc/logrotate.d/garden-backend << EOF
/path/to/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
```

## 🔒 Security Hardening

### Firewall Configuration
```bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Fail2Ban Setup
```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Configure for Nginx
sudo cat > /etc/fail2ban/jail.local << EOF
[nginx-http-auth]
enabled = true

[nginx-noscript]
enabled = true

[nginx-badbots]
enabled = true

[nginx-noproxy]
enabled = true
EOF

sudo systemctl restart fail2ban
```

## 📊 Performance Optimization

### Database Indexing
```javascript
// Run in MongoDB shell
use garden-management;

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.gardens.createIndex({ location: "text", name: "text" });
db.plots.createIndex({ garden: 1, status: 1 });
db.tasks.createIndex({ assignedTo: 1, status: 1, dueDate: 1 });
```

### Nginx Caching
```nginx
# Add to Nginx configuration
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /api/ {
    proxy_cache_valid 200 5m;
    proxy_cache_key $scheme$proxy_host$request_uri;
}
```

## 🚨 Backup Strategy

### Database Backup
```bash
# Create backup script
cat > backup-db.sh << EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
mongodump --uri="your_mongodb_uri" --out="/backups/\$DATE"
tar -czf "/backups/backup_\$DATE.tar.gz" "/backups/\$DATE"
rm -rf "/backups/\$DATE"

# Keep only last 7 days of backups
find /backups -name "backup_*.tar.gz" -mtime +7 -delete
EOF

chmod +x backup-db.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup-db.sh
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd garden-backend && npm ci
        cd ../garden-frontend && npm ci
    
    - name: Run tests
      run: |
        cd garden-backend && npm test
        cd ../garden-frontend && npm test
    
    - name: Build frontend
      run: cd garden-frontend && npm run build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd /path/to/community-garden-management
          git pull origin main
          cd garden-backend && npm ci --production
          pm2 restart garden-backend
```

## 📞 Support and Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Check network connectivity
   - Verify credentials
   - Ensure IP whitelist includes server IP

2. **PM2 Process Issues**
   ```bash
   pm2 logs garden-backend --lines 100
   pm2 restart garden-backend
   ```

3. **Nginx Configuration Issues**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

4. **SSL Certificate Issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

For additional support, check the main README.md or create an issue in the repository.

---

**Happy Deploying! 🚀🌱**
