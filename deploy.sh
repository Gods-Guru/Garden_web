#!/bin/bash

# 🌱 Community Garden Management System - Production Deployment Script
# This script builds and deploys the application for production

set -e  # Exit on any error

echo "🌱 Community Garden Management System - Production Deployment"
echo "=============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    print_info "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_status "All requirements met"
}

# Clean previous builds
clean_builds() {
    print_info "Cleaning previous builds..."
    
    if [ -d "garden-frontend/dist" ]; then
        rm -rf garden-frontend/dist
        print_status "Cleaned frontend build directory"
    fi
    
    if [ -d "garden-backend/dist" ]; then
        rm -rf garden-backend/dist
        print_status "Cleaned backend build directory"
    fi
}

# Build backend
build_backend() {
    print_info "Building backend..."
    
    cd garden-backend
    
    # Install production dependencies
    print_info "Installing backend dependencies..."
    npm ci --production
    
    # Run any build scripts if they exist
    if npm run | grep -q "build"; then
        npm run build
    fi
    
    print_status "Backend build completed"
    cd ..
}

# Build frontend
build_frontend() {
    print_info "Building frontend..."
    
    cd garden-frontend
    
    # Install dependencies
    print_info "Installing frontend dependencies..."
    npm ci
    
    # Build for production
    print_info "Building frontend for production..."
    npm run build:prod
    
    # Check if build was successful
    if [ ! -d "dist" ]; then
        print_error "Frontend build failed - dist directory not found"
        exit 1
    fi
    
    print_status "Frontend build completed"
    cd ..
}

# Run tests if available
run_tests() {
    print_info "Running tests..."
    
    # Backend tests
    if [ -f "garden-backend/package.json" ] && npm run --prefix garden-backend | grep -q "test"; then
        print_info "Running backend tests..."
        cd garden-backend
        npm test
        cd ..
        print_status "Backend tests passed"
    fi
    
    # Frontend tests
    if [ -f "garden-frontend/package.json" ] && npm run --prefix garden-frontend | grep -q "test"; then
        print_info "Running frontend tests..."
        cd garden-frontend
        npm test -- --run
        cd ..
        print_status "Frontend tests passed"
    fi
}

# Create deployment package
create_deployment_package() {
    print_info "Creating deployment package..."
    
    # Create deployment directory
    DEPLOY_DIR="garden-management-production-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$DEPLOY_DIR"
    
    # Copy backend files
    print_info "Packaging backend..."
    cp -r garden-backend "$DEPLOY_DIR/"
    
    # Copy frontend build
    print_info "Packaging frontend..."
    mkdir -p "$DEPLOY_DIR/garden-frontend"
    cp -r garden-frontend/dist "$DEPLOY_DIR/garden-frontend/"
    
    # Copy configuration files
    cp ecosystem.config.js "$DEPLOY_DIR/" 2>/dev/null || true
    cp nginx.conf "$DEPLOY_DIR/" 2>/dev/null || true
    cp docker-compose.yml "$DEPLOY_DIR/" 2>/dev/null || true
    cp PRODUCTION_READY.md "$DEPLOY_DIR/"
    
    # Create deployment info
    cat > "$DEPLOY_DIR/deployment-info.txt" << EOF
Community Garden Management System - Production Build
=====================================================

Build Date: $(date)
Node.js Version: $(node -v)
npm Version: $(npm -v)

Deployment Instructions:
1. Upload this package to your server
2. Follow instructions in PRODUCTION_READY.md
3. Configure environment variables
4. Start with PM2 or Docker

For support, refer to the documentation.
EOF
    
    # Create archive
    tar -czf "${DEPLOY_DIR}.tar.gz" "$DEPLOY_DIR"
    rm -rf "$DEPLOY_DIR"
    
    print_status "Deployment package created: ${DEPLOY_DIR}.tar.gz"
}

# Validate build
validate_build() {
    print_info "Validating build..."
    
    # Check frontend build
    if [ ! -f "garden-frontend/dist/index.html" ]; then
        print_error "Frontend build validation failed - index.html not found"
        exit 1
    fi
    
    # Check if main JS and CSS files exist
    if [ ! -d "garden-frontend/dist/assets" ]; then
        print_error "Frontend build validation failed - assets directory not found"
        exit 1
    fi
    
    # Check backend files
    if [ ! -f "garden-backend/server.js" ]; then
        print_error "Backend validation failed - server.js not found"
        exit 1
    fi
    
    if [ ! -f "garden-backend/package.json" ]; then
        print_error "Backend validation failed - package.json not found"
        exit 1
    fi
    
    print_status "Build validation passed"
}

# Main deployment process
main() {
    echo
    print_info "Starting production deployment process..."
    echo
    
    check_requirements
    clean_builds
    build_backend
    build_frontend
    validate_build
    
    # Optional: Run tests
    if [ "$1" = "--with-tests" ]; then
        run_tests
    fi
    
    create_deployment_package
    
    echo
    print_status "🎉 Production deployment completed successfully!"
    echo
    print_info "Next steps:"
    echo "1. Upload the generated .tar.gz file to your server"
    echo "2. Extract and follow PRODUCTION_READY.md instructions"
    echo "3. Configure environment variables"
    echo "4. Start the application with PM2 or Docker"
    echo
    print_status "Your Community Garden Management System is ready for production! 🌱"
}

# Run main function
main "$@"
