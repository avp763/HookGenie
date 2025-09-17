# HookGenie Deployment Guide

## Vercel Deployment

### 1. Environment Variables Setup
In your Vercel dashboard, add the following environment variable:
- `GEMINI_API_KEY`: Your Google Gemini API key

### 2. Deploy Commands
```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Deploy to Vercel
vercel

# Or for production deployment
vercel --prod
```

### 3. Custom Domain (Optional)
After deployment, you can add a custom domain in the Vercel dashboard under:
Project Settings → Domains

### 4. Environment Variable Configuration
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add: `GEMINI_API_KEY` with your actual Google Gemini API key
4. Redeploy the project for changes to take effect

### 5. Performance Optimizations
The app is configured with:
- Next.js 15.5.3 with Turbopack for fast builds
- Image optimization for the genie lamp SVG
- Static generation where possible
- Optimized bundle size

### 6. Mobile Optimization
- Responsive design with mobile-first approach
- Touch-friendly interfaces (44px minimum touch targets)
- Optimized font sizes and spacing for mobile
- Proper viewport meta tags

### 7. SEO & Social Sharing
- Complete meta tags for social sharing
- Open Graph and Twitter Cards configured
- Favicon and app icons set up
- Structured data for search engines

## Production Checklist
- [ ] Environment variables configured
- [ ] Custom domain set up (optional)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Analytics configured (optional)
- [ ] Error monitoring set up (optional)

## Performance Features
- Glass morphism design with backdrop filters
- Smooth animations and transitions
- Optimized loading states
- Progressive enhancement
- Mobile-optimized touch targets