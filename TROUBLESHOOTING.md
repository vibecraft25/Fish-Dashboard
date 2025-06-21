# Next.js 404 Error Troubleshooting Guide

## Current Status

All required files exist in the correct locations:
- ✅ `/app/page.tsx` - Main page component
- ✅ `/app/api/species/map-data/route.ts` - Map data API endpoint
- ✅ `/app/api/species/filter-options/route.ts` - Filter options API endpoint
- ✅ `/app/api/stats/route.ts` - Statistics API endpoint
- ✅ `/app/layout.tsx` - Root layout

## Common Causes of 404 Errors

### 1. Development Server Issues
The most common cause when files exist but return 404.

**Solution:**
```bash
# Stop the current server (Ctrl+C in the terminal running npm run dev)
# Then run:
./fix-404-errors.sh
```

### 2. Port Conflicts
Another service might be using port 3000.

**Check:**
```bash
lsof -i :3000
```

**Solution:**
```bash
# Kill the process using port 3000
kill -9 <PID>
# Or run on a different port
npm run dev -- -p 3001
```

### 3. Database Connection Issues
API routes depend on database connectivity.

**Check:**
```bash
# Ensure PostgreSQL is running
docker-compose up -d

# Check database connection
npx prisma db push
```

### 4. Next.js Version Issues
You're using Next.js 15.0.3 with App Router.

**Verify setup:**
```bash
# Check Next.js version
npm list next

# Ensure all dependencies are installed
npm install

# Generate Prisma client
npx prisma generate
```

## Quick Fix Steps

1. **Stop all running servers:**
   ```bash
   # Find all Next.js processes
   ps aux | grep next
   # Kill them
   pkill -f next
   ```

2. **Clean and rebuild:**
   ```bash
   rm -rf .next node_modules/.cache
   npm run build
   ```

3. **Start fresh:**
   ```bash
   npm run dev
   ```

4. **Verify routes are accessible:**
   - Home: http://localhost:3000/
   - Map Data API: http://localhost:3000/api/species/map-data
   - Filter Options API: http://localhost:3000/api/species/filter-options
   - Stats API: http://localhost:3000/api/stats

## API Route Testing

Test API routes directly:
```bash
# Test map-data endpoint
curl http://localhost:3000/api/species/map-data

# Test with filters
curl "http://localhost:3000/api/species/map-data?family=Serranidae&country=KR"
```

## Environment Variables

Ensure `.env` file contains:
```
DATABASE_URL="postgresql://username:password@localhost:5432/fishbase"
```

## Still Having Issues?

1. Check the terminal for specific error messages
2. Look at browser console for client-side errors
3. Verify all TypeScript files compile: `npm run type-check`
4. Check Next.js logs in the terminal running `npm run dev`