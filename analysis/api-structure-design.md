# Tablesalt AI - API Structure Design

## Core API Architecture

\`\`\`
/api/v1/
├── auth/                    # Authentication & Authorization
├── restaurant/              # Restaurant profile & settings  
├── setup/                   # Setup process management
├── dashboard/               # Dashboard data aggregation
├── menu/                    # Menu management & AI tools
├── customers/               # Customer management & intelligence
├── orders/                  # Order data & analytics
├── reviews/                 # Review management & AI insights
├── marketing/               # Marketing campaigns & content
├── integrations/            # Third-party integrations
├── analytics/               # Cross-platform analytics
├── ai/                      # AI services & recommendations
└── notifications/           # System notifications
\`\`\`

## Detailed API Endpoints

### 1. Authentication & Authorization (`/api/v1/auth/`)
\`\`\`
POST   /login                # User login
POST   /logout               # User logout
POST   /refresh              # Refresh access token
GET    /profile              # Get user profile
PUT    /profile              # Update user profile
POST   /forgot-password      # Password reset request
POST   /reset-password       # Password reset confirmation
\`\`\`

### 2. Restaurant Management (`/api/v1/restaurant/`)
\`\`\`
GET    /profile              # Get restaurant profile
PUT    /profile              # Update restaurant profile
GET    /settings             # Get restaurant settings
PUT    /settings             # Update restaurant settings
GET    /locations            # Get restaurant locations
POST   /locations            # Add new location
PUT    /locations/{id}       # Update location
DELETE /locations/{id}       # Delete location
GET    /hours                # Get operating hours
PUT    /hours                # Update operating hours
\`\`\`

### 3. Setup Process (`/api/v1/setup/`)
\`\`\`
GET    /progress             # Overall setup completion status
GET    /sections             # All setup sections with status
PUT    /sections/{id}        # Update section completion
GET    /sections/{id}/data   # Get section-specific data
POST   /sections/{id}/data   # Save section data
GET    /priorities           # Get setup priorities
PUT    /priorities           # Update setup priorities
\`\`\`

### 4. Dashboard (`/api/v1/dashboard/`)
\`\`\`
GET    /stats                # Quick performance metrics
GET    /insights             # AI-generated recommendations
GET    /activity             # Recent activity feed
GET    /modules              # Module status and metrics
PUT    /insights/{id}/action # Execute AI insight actions
GET    /widgets              # Dashboard widget configuration
PUT    /widgets              # Update widget configuration
\`\`\`

### 5. Menu Management (`/api/v1/menu/`)
\`\`\`
# Core Menu Operations
GET    /items                # Get menu items (with filtering)
POST   /items                # Create new menu item
GET    /items/{id}           # Get specific menu item
PUT    /items/{id}           # Update menu item
DELETE /items/{id}           # Delete menu item
PUT    /items/{id}/stock     # Update stock status

# Categories
GET    /categories           # Get menu categories
POST   /categories           # Create new category
PUT    /categories/{id}      # Update category
DELETE /categories/{id}      # Delete category

# Menu Publishing
GET    /status               # Get menu publish status
POST   /publish              # Publish menu changes
POST   /unpublish            # Unpublish menu
GET    /changes              # Get pending changes
POST   /changes/undo         # Undo recent changes

# Analytics & Insights
GET    /analytics            # Menu performance analytics
GET    /insights             # AI menu insights
GET    /score                # Menu optimization score

# AI Tools (already built)
GET    /ai/combos            # Get combo suggestions
POST   /ai/combos            # Create combo
GET    /ai/tags              # Get AI tag suggestions
POST   /ai/descriptions      # Generate descriptions
GET    /ai/design-templates  # Get design templates

# Export & Import
POST   /export               # Export menu data
POST   /import               # Import menu data
GET    /qr-code              # Generate QR code

# Integration Push
POST   /push                 # Push to external platforms
GET    /push/status          # Get push status
\`\`\`

### 6. Customer Management (`/api/v1/customers/`)
\`\`\`
GET    /                     # Get customers list (with filtering)
GET    /{id}                 # Get customer details
PUT    /{id}                 # Update customer
DELETE /{id}                 # Delete customer
POST   /{id}/contact         # Contact customer

# Analytics & Segmentation
GET    /stats                # Customer statistics
GET    /segments             # Customer segments
GET    /analytics            # Customer behavior analytics
POST   /segments             # Create custom segment

# Communication
POST   /{id}/email           # Send email to customer
POST   /{id}/sms             # Send SMS to customer
GET    /{id}/history         # Get communication history
\`\`\`

### 7. Orders (`/api/v1/orders/`)
\`\`\`
GET    /                     # Get orders list
GET    /{id}                 # Get order details
PUT    /{id}/status          # Update order status
GET    /analytics            # Order analytics
GET    /stats                # Order statistics
GET    /trends               # Order trends
\`\`\`

### 8. Reviews Management (`/api/v1/reviews/`)
\`\`\`
# Core Reviews
GET    /                     # Get reviews (with filtering)
GET    /{id}                 # Get review details
POST   /{id}/response        # Submit review response
PUT   /{id}/response         # Update review response

# Analytics & Insights
GET    /stats                # Review statistics
GET    /sentiment            # Sentiment analysis
GET    /insights             # AI review insights
GET    /platforms            # Platform breakdown

# Auto-Response System
GET    /auto-response/settings    # Get auto-response config
PUT    /auto-response/settings    # Update auto-response config
GET    /auto-response/queue       # Get pending responses
PUT    /auto-response/{id}/approve # Approve scheduled response

# Improvement Tasks
GET    /improvement-tasks     # Get improvement tasks
PUT    /improvement-tasks/{id} # Update task status
POST   /improvement-tasks     # Create new task
\`\`\`

### 9. Marketing (`/api/v1/marketing/`)
\`\`\`
# Performance Metrics
GET    /metrics              # Overall marketing metrics
GET    /channels             # Channel performance data

# Strategies
GET    /strategies           # Get marketing strategies
POST   /strategies           # Create new strategy
GET    /strategies/{id}      # Get strategy details
PUT    /strategies/{id}      # Update strategy
DELETE /strategies/{id}      # Delete strategy

# Campaigns
GET    /campaigns            # Get campaigns
POST   /campaigns            # Create campaign
GET    /campaigns/{id}       # Get campaign details
PUT    /campaigns/{id}       # Update campaign
DELETE /campaigns/{id}      # Delete campaign
PUT    /campaigns/{id}/status # Start/pause campaign

# Content Management
GET    /content              # Get content calendar
POST   /content              # Create content
PUT    /content/{id}         # Update content
DELETE /content/{id}         # Delete content
POST   /content/{id}/schedule # Schedule content

# Content Creation Tools (to be built)
POST   /content/posts        # Create social media post
POST   /content/reels        # Create reel/video
POST   /content/offers       # Create offer/promotion
POST   /content/emails       # Create email campaign
\`\`\`

### 10. Integrations (`/api/v1/integrations/`)
\`\`\`
GET    /                     # Get all available integrations
GET    /connected            # Get connected integrations
POST   /{id}/connect         # Connect integration
DELETE /{id}/disconnect      # Disconnect integration
GET    /{id}/status          # Get integration status
POST   /{id}/sync            # Trigger manual sync
PUT    /{id}/settings        # Update integration settings
GET    /costs                # Get cost analysis
GET    /health               # Get integration health status
\`\`\`

### 11. Analytics (`/api/v1/analytics/`)
\`\`\`
GET    /overview             # Cross-platform analytics overview
GET    /revenue              # Revenue analytics
GET    /customers            # Customer analytics
GET    /menu                 # Menu performance analytics
GET    /marketing            # Marketing analytics
GET    /reports              # Custom reports
POST   /reports              # Create custom report
GET    /exports              # Get available exports
POST   /exports              # Create data export
\`\`\`

### 12. AI Services (`/api/v1/ai/`)
\`\`\`
POST   /insights             # Generate AI insights
POST   /recommendations      # Get AI recommendations
POST   /content/generate     # Generate content with AI
POST   /optimize/pricing     # AI pricing optimization
POST   /optimize/menu        # AI menu optimization
POST   /predict/demand       # Demand prediction
POST   /analyze/sentiment    # Sentiment analysis
\`\`\`

### 13. Notifications (`/api/v1/notifications/`)
\`\`\`
GET    /                     # Get notifications
PUT    /{id}/read            # Mark as read
PUT    /read-all             # Mark all as read
DELETE /{id}                 # Delete notification
GET    /settings             # Get notification settings
PUT    /settings             # Update notification settings
\`\`\`

## API Design Principles

### 1. Response Format
\`\`\`json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
\`\`\`

### 2. Error Format
\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
\`\`\`

### 3. Common Query Parameters
- `page` - Page number for pagination
- `limit` - Items per page
- `search` - Search query
- `filter` - Filter parameters
- `sort` - Sort field and direction
- `include` - Related data to include

### 4. Authentication
- JWT tokens for authentication
- Role-based access control
- API key authentication for integrations

### 5. Rate Limiting
- 1000 requests per hour for authenticated users
- 100 requests per hour for unauthenticated users
- Higher limits for premium plans

This API structure provides comprehensive coverage for all the UI pages we analyzed while maintaining consistency and scalability.
