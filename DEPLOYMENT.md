# Tablesalt AI - Deployment Guide

This guide will help you deploy your Tablesalt AI restaurant management system to production.

## Prerequisites

- Node.js 18+ installed
- Vercel account (recommended) or other hosting platform
- Supabase account for database and storage
- OpenAI or Groq API key for AI features

## Quick Deploy to Vercel

### 1. Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/tablesalt-ai)

### 2. Manual Deployment

1. **Clone and Install**
   \`\`\`bash
   git clone https://github.com/your-username/tablesalt-ai.git
   cd tablesalt-ai
   npm install
   \`\`\`

2. **Set up Environment Variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your environment variables (see Environment Variables section below).

3. **Deploy to Vercel**
   \`\`\`bash
   npm install -g vercel
   vercel login
   vercel --prod
   \`\`\`

## Environment Variables

### Required Variables

\`\`\`env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services (Required for AI features)
OPENAI_API_KEY=sk-your-openai-key
# OR
GROQ_API_KEY=your-groq-key

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

### Optional Variables

\`\`\`env
# Analytics
VERCEL_ANALYTICS_ID=your_analytics_id

# Error Monitoring
SENTRY_DSN=your_sentry_dsn

# Email (for notifications)
RESEND_API_KEY=your_resend_key
\`\`\`

## Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and keys

### 2. Run Database Migration

**Option A: Using Supabase Dashboard (Recommended)**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/create-comprehensive-schema.sql`
4. Click "Run" to create all tables and indexes
5. Optionally, run `scripts/seed-sample-data.sql` for test data

**Option B: Using Command Line**
\`\`\`bash
# Set environment variables first
npm run db:migrate
\`\`\`

### 3. Database Schema Overview

The comprehensive schema includes:
- **Core Tables**: Organizations, users, restaurants (multi-tenant support)
- **Menu Management**: Categories, items, variants, modifiers, combos
- **Customer Intelligence**: Customer profiles, segments, analytics
- **Order Management**: Orders, items, payment tracking
- **Reviews & Communications**: Review management, email/SMS campaigns
- **Marketing Hub**: Campaigns, strategies, AI-powered insights
- **Integrations**: POS, delivery platforms, social media connections
- **Analytics**: Event tracking, reports, AI insights
- **Notifications**: Real-time user notifications

### 4. Seed Sample Data (Optional)

\`\`\`bash
npm run db:seed
\`\`\`

This creates sample restaurant data including:
- Demo restaurant with menu items
- Sample customers and orders
- Review examples
- Test marketing campaigns

## Production Configuration

### 1. Domain Setup

1. Add your custom domain in Vercel dashboard
2. Update `NEXT_PUBLIC_APP_URL` environment variable
3. Configure DNS records

### 2. Security Configuration

- Enable Supabase RLS (Row Level Security)
- Configure CORS origins
- Set up proper authentication flows
- Enable HTTPS redirects

### 3. Performance Optimization

- Enable Vercel Analytics
- Configure image optimization
- Set up CDN for static assets
- Enable compression

## Monitoring and Maintenance

### 1. Error Monitoring

Set up Sentry for error tracking:

\`\`\`bash
npm install @sentry/nextjs
\`\`\`

### 2. Analytics

Enable Vercel Analytics in your dashboard.

### 3. Database Monitoring

Monitor your Supabase usage and performance in the Supabase dashboard.

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure variables are set in Vercel dashboard
   - Redeploy after adding variables

2. **Database Connection Issues**
   - Check Supabase project status
   - Verify connection strings
   - Check RLS policies

3. **Image Upload Issues**
   - Verify Supabase storage bucket exists
   - Check storage policies
   - Ensure proper CORS configuration

4. **AI Features Not Working**
   - Verify API keys are set
   - Check API quotas and limits
   - Monitor API usage

### Support

For deployment issues:
1. Check Vercel deployment logs
2. Review Supabase logs
3. Check browser console for errors
4. Contact support at support@tablesalt.ai

## Scaling Considerations

### Database Scaling
- Monitor Supabase usage
- Consider upgrading plan for higher limits
- Implement database indexing for performance

### API Rate Limits
- Monitor AI API usage
- Implement caching for AI responses
- Consider upgrading API plans

### Storage Scaling
- Monitor image storage usage
- Implement image compression
- Consider CDN for image delivery

## Security Checklist

- [ ] Environment variables secured
- [ ] Database RLS enabled
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] API rate limiting implemented
- [ ] User authentication secured
- [ ] File upload validation enabled
- [ ] Error messages sanitized

## Performance Checklist

- [ ] Images optimized and compressed
- [ ] Database queries optimized
- [ ] Caching implemented
- [ ] CDN configured
- [ ] Bundle size optimized
- [ ] Core Web Vitals monitored

Your Tablesalt AI system is now ready for production! 🚀
