# Environment Setup Guide

## 🚨 Hardcoded URL Issue - FIXED ✅

The frontend hardcoded URL issue has been resolved. Here's what was fixed:

### Files Modified:
1. **`API/TenantApiService.js`** - Removed hardcoded port `:8000` and domain logic
2. **`next.config.js`** - Replaced hardcoded `localhost:8000` with environment variable
3. **`lib/config.js`** - Created centralized configuration management

## 🔧 Environment Variables Setup

### Required Environment Variables:

Create a `.env.local` file in your project root with:

```bash
# Development Configuration (for tenant-specific development)
NEXT_PUBLIC_TENANT_API_PORT=8000
NEXT_PUBLIC_CENTRAL_DOMAIN=app.localhost
NODE_ENV=development

# Production Configuration (uncomment for production)
# NEXT_PUBLIC_API_URL=https://binbothub.com/backend
# NEXT_PUBLIC_TENANT_API_PORT=443
# NEXT_PUBLIC_CENTRAL_DOMAIN=binbothub.com
# NODE_ENV=production
```

### Development vs Production:

**Development** (tenant-specific):
- Calls go to: `http://hadishokor.app.localhost:8000/login`
- Uses tenant name from subdomain with app.localhost domain

**Production** (tenant-specific with backend routing):
- Calls go to: `https://hadishokor.binbothub.com/backend/login`
- Uses tenant subdomain with /backend path for proper routing
- Each tenant gets their own subdomain but shares the backend API

## 📁 Configuration Structure

### `lib/config.js`
- Centralized environment variable management
- Helper functions for API URL construction
- Environment-specific logic handling

### `API/TenantApiService.js`
- Now uses centralized configuration
- No more hardcoded URLs or ports
- Clean, maintainable API service

### `next.config.js`
- Dynamic API destination based on environment
- Fallback to production URL if no environment variable

## 🚀 Deployment

### Docker Build:
```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://binbothub.com/backend \
  --build-arg NEXT_PUBLIC_CENTRAL_DOMAIN=binbothub.com \
  -t your-app .
```

### Environment Variable Priority:
1. `NEXT_PUBLIC_API_URL` (highest priority)
2. Fallback to `https://binbothub.com/backend` (production default)

## ✅ Verification

After deployment, verify:
1. API calls go to `https://binbothub.com/backend/*`
2. No more `localhost:8000` references
3. Environment variables are properly loaded

## 🔍 Debugging

Add this to your component to debug environment variables:

```javascript
useEffect(() => {
  console.log('Environment Variables:');
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
}, []);
```

## 📝 Notes

- All environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- The backend is accessible at `/backend` path, not directly at the root
- All API calls now use HTTPS in production
- Test from external devices, not from the server itself

## 🚨 **Important: Backend Routing Fix**

### **The Problem:**
- **Before**: API calls went to `https://hadishokor.binbothub.com/login`
- **Result**: Frontend returned HTML instead of JSON (routing issue)
- **Error**: "Unexpected token '<'" (trying to parse HTML as JSON)

### **The Solution:**
- **After**: API calls go to `https://hadishokor.binbothub.com/backend/login`
- **Result**: Proper routing to Laravel backend
- **Benefit**: JSON responses instead of HTML

### **Why This Happened:**
Your Caddyfile routes:
- `/backend/*` → Laravel backend (API endpoints)
- `/*` → Next.js frontend (HTML pages)

The tenant service was missing the `/backend` path, so calls hit the frontend instead of the backend.
