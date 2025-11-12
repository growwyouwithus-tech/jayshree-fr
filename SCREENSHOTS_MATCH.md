# Screenshots Implementation Guide

## Exact Implementation Checklist

### Screenshot 1: Property Details Page ✅
**URL**: `/properties/:id`
**File**: `PropertyDetails.jsx`

**Design Elements**:
- ✅ Grey header (not purple!) - `bgcolor: #E0E0E0`
- ✅ Back arrow + property name
- ✅ Grey image placeholder with house icon
- ✅ Property title
- ✅ Location with ">" separators
- ✅ Three outlined chips (Residential, Clubhouse, Completed: 1)
- ✅ Description heading
- ✅ Description text
- ✅ Purple "Apply Property" button at bottom

### Screenshot 2: My Bookings (Empty State) ✅
**URL**: `/my-bookings`
**File**: `MyBookings.jsx`

**Design Elements**:
- ✅ Purple header with "My Bookings" + refresh icon
- ✅ Two filter dropdowns (Pending, Oldest)
- ✅ Empty state illustration (girl with phone)
- ✅ "No Data" text
- ✅ Purple "Retry" button
- ✅ Bottom navigation visible

### Screenshot 3: Notifications (Empty State) ✅
**URL**: `/notifications`
**File**: `Notifications.jsx`

**Design Elements**:
- ✅ Purple header with back arrow + "Notifications" + 3-dot menu
- ✅ Empty state illustration (same girl with phone)
- ✅ "No notification available." text
- ✅ "You can see your notification here when available." subtext
- ✅ Purple "Retry" button

### Screenshot 4: Profile Page ✅
**URL**: `/profile`
**File**: `Profile.jsx`

**Design Elements**:
- ✅ Purple header with avatar
- ✅ User name (vishnu sharma)
- ✅ Email (balag.rudra@gmail.com)
- ✅ List menu with colored icon backgrounds:
  - Profile (purple circle)
  - Language (blue circle) with "English" on right
  - Terms & Conditions (purple circle)
  - About Us (blue circle)
  - Logout (orange circle)
- ✅ Chevron arrows on right
- ✅ Bottom navigation visible

### Screenshot 5: Home - All Properties ✅
**URL**: `/` (home page)
**File**: `Home.jsx`

**Design Elements**:
- ✅ "All Properties" heading with "See All" button
- ✅ Property card with:
  - Image placeholder
  - Property name
  - Location with icon
  - Chips (Residential, Completed: 1, Amenities: 1, Facilities: 1)
  - Purple "See Plots" button
- ✅ Bottom navigation visible

### Screenshot 6: Plot Details ✅
**URL**: `/plots/:id`
**File**: `PlotDetails.jsx`

**Design Elements**:
- ✅ Purple header with back arrow + "live longer live happy • Plots"
- ✅ Plot image with:
  - Green "AVAILABLE" badge (rotated, top-left)
  - Dark "# #25" badge (top-right)
  - Map icon in center
  - Dark "Dimensions: 25 ft × 65 ft" badge (bottom-left)
- ✅ Blue toggle section (Price/Yard vs Total Price)
- ✅ Size info: "📐 Size 180.56"
- ✅ Length and Width in two columns
- ✅ Two buttons at bottom:
  - "📞 Contact" (outlined, purple)
  - "✓ Book Now" (filled, dark grey)

## Color Codes from Screenshots

### Primary Purple
- Header Background: `#6200EA`
- Button Background: `#6200EA`

### Greys
- Light Grey Header (Screenshot 1): `#E0E0E0`
- Image Placeholder: `#CCCCCC`
- Dark Badge: `rgba(0,0,0,0.6)`

### Other Colors
- Available Badge: `#4CAF50` (green)
- Toggle Blue: `#03A9F4`
- Selected Toggle Dark Blue: `#0288D1`
- Selected Toggle Purple: `#7C4DFF`

### Icon Backgrounds (Profile)
- Purple: `#E1BEE7`
- Blue: `#B3E5FC`
- Orange: `#FFE0B2`

## Typography

### Headers
- Font Weight: 500-600
- Size: h6 (1.25rem)

### Body Text
- Font Weight: 400
- Size: body2 (0.875rem)

### Buttons
- Font Weight: 600
- Text Transform: none (not uppercase)

## Bottom Navigation
- Always visible on mobile
- Three items: Home, My Bookings, Profile
- Active color: Purple (#6200EA)
- Inactive color: Grey (#757575)
