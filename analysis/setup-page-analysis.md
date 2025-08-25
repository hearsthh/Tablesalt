# Setup Page Analysis

## Overview
The setup page (`/setup/page.tsx`) is a comprehensive onboarding flow that guides restaurant owners through configuring their restaurant data and integrations.

## Page Structure

### 1. Header Section
- **Back Navigation**: Link to dashboard
- **Title**: "Restaurant Setup"
- **Subtitle**: "Complete your profile to unlock AI features"

### 2. Progress Overview Card
- **Overall Progress**: Calculated percentage across all sections
- **Progress Bar**: Visual representation of completion
- **Section Counter**: "X of Y sections completed"

### 3. Setup Sections (Main Content)
The page displays 7 main setup sections:

#### A. Restaurant Information
- **Priority**: High
- **Estimated Time**: 10 min
- **Fields**: 24 total, 18 completed
- **Status**: in-progress
- **Features**:
  - Field completion tracking
  - Progress bar per section
  - Status indicators (completed/in-progress/pending)

#### B. Menu & Pricing
- **Priority**: High
- **Estimated Time**: 15 min
- **Status**: pending
- **Features**:
  - Menu upload functionality
  - Price categorization
  - Item management

#### C. POS Integration
- **Priority**: High
- **Estimated Time**: 5 min
- **Status**: pending
- **Connected Integrations**:
  - Square POS (connected, 8,247 orders)
  - Toast POS (connected, 12,450 orders)
  - Petpooja (not connected)
- **Analytics Display**:
  - Total orders: 12,847
  - Total revenue: ₹284,750
  - Average order value: ₹22.15
  - Order type breakdown (dine-in 45%, takeaway 35%, delivery 20%)
  - Peak hours analysis
  - Top selling items
  - Payment method distribution

#### D. Delivery Platforms
- **Priority**: Medium
- **Estimated Time**: 8 min
- **Connected Integrations**:
  - Uber Eats (connected, 2,156 orders)
  - DoorDash (not connected)
  - Zomato (connected, 3,847 orders)
  - Swiggy (not connected)

#### E. Reviews Integration
- **Priority**: Medium
- **Estimated Time**: 5 min
- **Connected Integrations**:
  - Google My Business (connected, 1,247 reviews)
  - Yelp (connected, 456 reviews)
  - TripAdvisor (not connected)
  - Zomato Reviews (connected, 892 reviews)

#### F. Reservations System
- **Priority**: Low
- **Estimated Time**: 7 min
- **Connected Integrations**:
  - OpenTable (connected, 234 reservations)
  - Resy (not connected)

#### G. Customer Database
- **Priority**: Low
- **Estimated Time**: 6 min
- **Status**: pending

### 4. Quick Actions Card
- **Import from existing system**: Bulk data import
- **Schedule setup call**: Support assistance

## Data Requirements

### Setup Section Data Structure
\`\`\`typescript
interface SetupSection {
  id: string
  title: string
  description: string
  icon: React.ComponentType
  priority: "high" | "medium" | "low"
  estimatedTime: string
  fields: number
  completed: number
  status: "completed" | "in-progress" | "pending"
  integrations?: Integration[]
  analytics?: SectionAnalytics
}

interface Integration {
  name: string
  connected: boolean
  lastSync: string | null
  dataCount: string | null
}

interface SectionAnalytics {
  totalOrders?: number
  totalRevenue?: number
  avgOrderValue?: number
  orderTypes?: OrderTypeBreakdown
  peakHours?: PeakHoursData
  topItems?: TopItem[]
  paymentMethods?: PaymentMethodData
}
\`\`\`

## API Endpoints Needed

### 1. Setup Progress API
- `GET /api/setup/progress` - Get overall setup progress
- `GET /api/setup/sections` - Get all setup sections with status
- `PUT /api/setup/sections/{sectionId}` - Update section completion status

### 2. Integration Management API
- `GET /api/integrations` - Get all available integrations
- `GET /api/integrations/{sectionId}` - Get integrations for specific section
- `POST /api/integrations/{integrationId}/connect` - Connect integration
- `DELETE /api/integrations/{integrationId}/disconnect` - Disconnect integration
- `GET /api/integrations/{integrationId}/sync` - Trigger data sync

### 3. Analytics Data API
- `GET /api/analytics/pos` - Get POS analytics data
- `GET /api/analytics/delivery` - Get delivery platform analytics
- `GET /api/analytics/reviews` - Get reviews analytics
- `GET /api/analytics/reservations` - Get reservations analytics

### 4. Section-Specific APIs
- `GET /api/setup/restaurant-info` - Get restaurant information
- `PUT /api/setup/restaurant-info` - Update restaurant information
- `GET /api/setup/menu` - Get menu data
- `PUT /api/setup/menu` - Update menu data

## User Interactions

### 1. Navigation
- **Back to Dashboard**: Navigate to main dashboard
- **Section Navigation**: Click "Start/Continue/Review" buttons to go to specific setup sections

### 2. Progress Tracking
- **Visual Progress**: Progress bars show completion percentage
- **Status Updates**: Real-time updates when sections are completed

### 3. Integration Management
- **Connection Status**: Visual indicators for connected/disconnected integrations
- **Data Sync**: Last sync timestamps and data counts
- **Analytics Display**: Rich analytics data for connected integrations

### 4. Quick Actions
- **Bulk Import**: Access to data import functionality
- **Support**: Schedule assistance calls

## State Management Needs

### 1. Setup Progress State
- Overall completion percentage
- Individual section progress
- Section status tracking

### 2. Integration State
- Connection status for each integration
- Sync status and timestamps
- Data counts and analytics

### 3. Analytics State
- POS data (orders, revenue, trends)
- Delivery platform data
- Reviews and ratings data
- Reservation data

## Form Validation Requirements

### 1. Section Completion Validation
- Required fields per section
- Data format validation
- Integration connection validation

### 2. Progress Calculation
- Field completion counting
- Weighted progress calculation
- Status determination logic

## Performance Considerations

### 1. Data Loading
- Lazy loading of analytics data
- Caching of integration status
- Progressive loading of section data

### 2. Real-time Updates
- WebSocket connections for sync status
- Polling for integration updates
- Optimistic UI updates

## Security Requirements

### 1. Integration Authentication
- OAuth flows for third-party integrations
- API key management
- Token refresh handling

### 2. Data Access Control
- User-specific setup data
- Integration permission validation
- Analytics data security
