# Smart Agricultural Exchange — Developer Specification & App Flow

## Overview

A minimal, low-friction marketplace that lets farmers publish verified crop listings (geotagged + photo) and brands/government buyers discover and buy directly — with your company handling verification, deal orchestration, updates and trust-building (no exploitative middlemen).

---

## Primary User Roles & Portals

### 1. Farmer Portal (Mobile-First PWA)
- **Platform**: Progressive Web App (PWA)
- **Design**: Ultra-simple UI, local language toggle, offline-capable
- **Features**: Publish crops, get crop advice, view updates

### 2. Brand/Government Buyer Portal (Desktop + Mobile)
- **Platform**: Web application with mobile responsiveness
- **Design**: OLX-like browse, search & filter interface
- **Features**: Connect/chat with farmers, shortlist & finalize deals, automated email updates

### 3. Company Admin/Operations Portal
- **Platform**: Full dashboard web application
- **Features**: Verification, manual review, deals tracking, analytics, logistics coordination, re-evaluation of rejected posts

---

## High-Level User Flows

### 1. Farmer Flow (MVP)

#### Registration & Onboarding
- **Registration**: Phone + OTP verification
- **Data Collection**: Name, village, taluk/district, bank details (optional), language preferences
- **Consent**: Explicit consent for geotagging + photo usage

#### Home Screen
Large icon tiles interface:
- **Get Crop Advice**
- **Post New Crop**
- **My Posts**
- **News & Policies**

#### Post New Crop Process
**Simple Form Fields**:
- Crop type (select or free text)
- Variety
- Expected sow/harvest dates
- Expected yield (kg/acre)
- Minimum expected price
- Quantity
- Required packaging (bulk/boxed)
- Phone number
- Geotagged photos (3 recommended)
- Optional short video

**Photo Requirements**:
- App checks EXIF for lat/lon & timestamp
- If missing: prompt farmer to allow location capture
- Take new photo via in-app camera if needed
- Submit → automated verification pipeline → flagged for manual review if suspicious → post moves to "Pending Verification"

#### Get Crop Advice
- **Chat-like UI**: Choose crop or type question
- **Option A**: Canned short advice cards for common crops
- **Option B**: Connect to expert chat (text) / basic AI response
- **Offline Fallback**: Keep offline content available

#### My Posts Management
**Status Badges**:
- Draft
- Pending Verification
- Live
- Deal Locked
- Harvesting
- Completed
- Rejected

**Features**:
- Tap for details
- Upload update photos
- Mark harvest date
- Communicate with buyer

#### Notifications
- **SMS + in-app push** for:
  - Post status updates
  - Connection requests
  - Deal finalization
  - Pre-harvest reminders

#### Localization
- **Language Toggle**: Persistent top toggle
- **Languages**: Hindi/Tamil/Telugu + English
- **Implementation**: All text, buttons, error messages localized
- **Accessibility**: Simple icons and audio cues where helpful

### 2. Brand/Government Buyer Flow (MVP)

#### Registration
- **Method**: Email + organization details + verification
- **Dashboard**: Lists available live posts in feed + filters

#### Search & Discovery
**Filters Available**:
- Crop type
- Variety
- District/state radius
- Quantity
- Expected harvest window
- Price range
- Rare/exotic toggle
- Certified/verified toggle

#### Listing View
**Information Displayed**:
- Photos
- Geolocation pin (village name + approximate field boundary)
- Farmer rating (if available)
- Verification status
- Expected harvest date
- Chat button
- "Connect / Make Offer" button

#### Deal Process
1. **Connect**: Opens in-app chat
2. **Make Offer**: Price, quantity, pickup/logistics terms
3. **Acceptance**: If farmer accepts → brand marks "Deal Done"
4. **Post-Deal**: Regular photo updates from farmer, automated reminders

### 3. Company Admin Flow

#### Review Queue
- **Auto-verified posts**: Go live automatically
- **Flagged posts**: Manual review queue with tools:
  - View EXIF map
  - Image authenticity score
  - Crop recognition suggestions
  - Reassign reviewer
  - Send feedback to farmer for re-upload

#### Deals Dashboard
- **View**: All active deals (Deal ID, farmer, buyer, price, status)
- **Drill down**: Update photos, communications, payout status, logistics requests

#### Rejected Posts Management
- View rejection reasons
- Re-evaluate after farmer re-submission

#### Analytics Dashboard
- **Supply Maps**: Heatmap of crops
- **Demand Signals**: Top searched crops by brands
- **Rare Crop Registry**
- **Pending Payments**
- **Crop Yield Forecasts**: Basic forecasting

#### Operations Tools
- Manual verification override
- Send SMS/email
- Dispute resolution module
- Export CSV
- Bulk notifications

---

## Verification Pipeline (Critical)

### 1. Client-Side Pre-Check
- **Requirement**: At least 1 in-app camera photo
- **Geolocation**: Capture EXIF lat/lon; if not possible, capture via GPS permission
- **Storage**: Store both EXIF and GPS data

### 2. Automated Checks
- **EXIF vs Claimed Location**: If mismatch > X km, flag (X configurable)
- **Image Tamper Detection**: Run lightweight ML model or heuristic to detect heavy editing
- **Crop Recognition Model**: Image classifier to sanity-check crop type against farmer's declaration
- **Duplicate Posting Detection**: Check for clones or spam posts
- **Historical Cross-Check**: Use farmer history for trust score calculation

### 3. Manual Review (Company Admin)
- **Review Elements**: Photos, map, farmer phone check
- **Actions Available**:
  - **Approve** → Live
  - **Request More Info** → message to farmer
  - **Reject** → notify farmer with reason

### 4. Trust & Badging System
- **Verified**: Auto + Manual verification
- **Field Verified**: Physical inspection or logistics confirmation
- **Trusted Farmer**: Based on history & ratings

---

## Data Model

### Core Tables/Documents

#### Users (Farmers & Buyers)
```sql
users (
  id UUID PRIMARY KEY,
  role ENUM('farmer','buyer','admin'),
  name TEXT,
  phone TEXT,
  email TEXT,
  password_hash TEXT, -- or auth via OTP / OAuth
  village TEXT,
  district TEXT,
  state TEXT,
  languages JSON, -- ['hi','te','ta']
  bank_details JSON NULL,
  created_at TIMESTAMP
)
```

#### Crop Posts
```sql
crop_posts (
  id UUID PRIMARY KEY,
  farmer_id UUID REFERENCES users,
  crop_type TEXT,
  variety TEXT,
  sow_date DATE,
  expected_harvest_date DATE,
  expected_yield NUMERIC,
  expected_price NUMERIC,
  quantity_unit TEXT, -- kg/quintal/ton
  description TEXT,
  geolocation GEOGRAPHY, -- POINT(lat lon)
  admin_status ENUM('draft','pending','approved','rejected'),
  verification_score FLOAT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### Images
```sql
images (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES crop_posts,
  url TEXT,
  exif JSON, -- {lat, lon, timestamp, device}
  uploaded_at TIMESTAMP
)
```

#### Deals
```sql
deals (
  id UUID PRIMARY KEY,
  post_id UUID,
  buyer_id UUID,
  farmer_id UUID,
  offer_price NUMERIC,
  offer_quantity NUMERIC,
  status ENUM('initiated','accepted','in_progress','completed','disputed'),
  escrow_id TEXT NULL,
  created_at TIMESTAMP,
  last_update TIMESTAMP
)
```

#### Messages
```sql
messages (
  id UUID PRIMARY KEY,
  deal_id UUID,
  sender_id UUID,
  receiver_id UUID,
  text TEXT,
  attachments JSON,
  created_at TIMESTAMP
)
```


## UX & Accessibility Notes (Crucial for Farmer Adoption)

### Design Principles
- **Large fonts**, high contrast, single-column layout
- **Icons + microcopy** in local languages
- **Audio prompts** for key actions
- **One primary CTA** per view to reduce confusion

### Technical Features
- **Offline drafts** and retry for photo uploads
- **Background sync** when online
- **Minimal free text** — use picklists, voice-to-text for free inputs
- **Big touch targets** for mobile interaction

---

## Security & Privacy

### Data Protection
- **Explicit consent** for geolocation & photo usage
- **Clear privacy policy** in local languages
- **Encrypt sensitive data** at rest (bank details)
- **TLS** for all transport

### Fraud Prevention
- **Rate-limit actions** & add fraud detection
- **Multiple posts from same phone/device** monitoring
- **Role-based access control** (RBAC) — admin privileges separated
- **Audit logs** for verification actions and deal changes

---

## Scalability & Operational Considerations

### Performance
- **PostGIS** for radius/routing queries; index geolocation
- **Thumbnails and low-res derivatives** for fast listing
- **Full-res images** only on demand
- **Background workers** for image verification and notifications (Celery / BullMQ)

### Infrastructure
- **CDN and S3** to scale image serving
- **Batch export** for government reporting (CSV/Excel)
- **Database design** to allow sharding by region if needed

---

## Implementation Roadmap

### Phase A (Core / Hackathon)
- OTP auth
- Farmer post creation
- Image upload + EXIF capture
- Automated verification checks
- Admin approval workflow
- Buyer search functionality
- Chat system
- Deal finalization
- Notifications (SMS & email)

### Phase B (Polish)
- Localization for 3 languages
- Offline PWA sync
- Thumbnails/CDN optimization
- Basic analytics dashboard
- Bank/escrow integration

### Phase C (Scale & Trust)
- ML-based crop recognition
- Fraud detection improvements
- Logistics integration
- Immutable traceability
- Rating system implementation

---

## Testing & QA Checklist

### Flow Tests
- Create post → approval → buyer connects → deal finalized
- End-to-end user journey validation

### Edge Cases
- Missing EXIF data handling
- Low bandwidth scenarios
- Multiple re-submit flows
- Rejected & re-upload workflows

### Security Tests
- Authentication bypass attempts
- Role escalation prevention
- SQL injection simulation

### Performance Tests
- Load tests for image upload + search
- Concurrent user handling

### Usability Tests
- **Minimum requirement**: Test with at least 3 farmers
- **Ideal**: Include one rural user
- **Focus**: Validate UI clarity and labels
- **Languages**: Test in all supported local languages

---

## Success Metrics

### Farmer Adoption
- Registration completion rate
- Post creation success rate
- Time to first successful post
- User retention rates

### Marketplace Health
- Verification accuracy
- Deal completion rate
- Average time from post to deal
- Fraud detection effectiveness

### Business Metrics
- Number of active farmers
- Number of active buyers
- Total transaction volume
- Customer satisfaction scores

---

*This specification serves as the foundation for building a trustworthy, scalable agricultural marketplace that serves farmers and buyers effectively while maintaining high standards of verification and user experience.*
