# Design Specifications 🎨

This document outlines the exact design specifications matching the provided screenshots.

## Color Palette

### Primary Colors
- **Primary Purple**: `#6200EA`
- **Primary Dark**: `#4a00b8`
- **Primary Light**: `#7c4dff`

### Secondary Colors
- **Secondary Orange**: `#FF6F00`
- **Success Green**: `#4CAF50`
- **Info Blue**: `#03A9F4`
- **Warning Orange**: `#F57C00`

### Neutral Colors
- **Background**: `#F5F5F5`
- **Paper**: `#FFFFFF`
- **Grey 100**: `#F5F5F5`
- **Grey 200**: `#EEEEEE`
- **Grey 300**: `#E0E0E0`

## Typography

### Font Family
- Primary: `Inter`
- Fallback: `Roboto, Helvetica, Arial, sans-serif`

### Font Weights
- Regular: 400
- Medium: 500
- Semi-Bold: 600
- Bold: 700

## Component Specifications

### 1. Property Details Card

**Layout:**
```
┌─────────────────────────────────┐
│ Grey Header (bgcolor: grey.300) │
│ < Property Name                  │
├─────────────────────────────────┤
│                                  │
│     [House Icon - 80px]          │
│     Grey Background              │
│     Height: 200px                │
│                                  │
├─────────────────────────────────┤
│ Padding: 24px                    │
│                                  │
│ Title (h5, 600 weight)           │
│ 📍 Location (body2, grey)        │
│                                  │
│ [Chip] [Chip] [Chip]             │
│ (outlined, rounded, grey border) │
│                                  │
│ Description                      │
│ Body text...                     │
│                                  │
│ [✓ Apply Property Button]        │
│ (Purple #6200EA, rounded 12px)   │
│ (Full width, py: 12px)           │
└─────────────────────────────────┘
```

**Specifications:**
- Card Border Radius: `12px`
- Padding: `24px`
- Image Height: `200px`
- Button Height: `48px`
- Chip Border Radius: `8px`

### 2. Plot Details Card

**Layout:**
```
┌─────────────────────────────────┐
│ Purple Header (#6200EA)          │
│ < Colony Name • Plots            │
├─────────────────────────────────┤
│ [AVAILABLE]        [# #25]       │
│ (Green, rotated)   (Dark badge)  │
│                                  │
│     [Map Icon - 80px]            │
│     Grey Background              │
│                                  │
│ [📏 Dimensions: 25 × 65 ft]      │
│ (Dark overlay, bottom-left)      │
├─────────────────────────────────┤
│ [Price/Yard] [Total Price]       │
│ (Toggle buttons, blue/purple)    │
├─────────────────────────────────┤
│ 📐 Size: 180.56                  │
│                                  │
│ Length (ft): 25.00               │
│ Width (ft): 65.00                │
│                                  │
│ [📞 Contact] [✓ Book Now]        │
│ (Outlined)   (Filled grey)       │
└─────────────────────────────────┘
```

**Specifications:**
- Available Badge:
  - Background: `#4CAF50`
  - Transform: `rotate(-15deg)`
  - Position: `top: 16px, left: 16px`
  - Font Weight: 700
  - Height: `32px`

- Plot Number Badge:
  - Background: `rgba(0,0,0,0.5)`
  - Position: `top: 16px, right: 16px`
  - Font Weight: 600

- Dimensions Overlay:
  - Background: `rgba(0,0,0,0.7)`
  - Position: `bottom: 16px, left: 16px`
  - Color: white
  - Font Weight: 600

- Price Toggle:
  - Background: `#03A9F4`
  - Selected (Price/Yard): `#0288D1`
  - Selected (Total): `#7C4DFF`
  - Border Radius: `12px`
  - Full Width

- Action Buttons:
  - Border Radius: `12px`
  - Padding: `12px 0`
  - Font Weight: 600

### 3. My Bookings Page

**Layout:**
```
┌─────────────────────────────────┐
│ Purple Header                    │
│ My Bookings              [↻]     │
├─────────────────────────────────┤
│ [Pending ▼]  [Oldest ▼]          │
│ (Filter dropdowns)               │
├─────────────────────────────────┤
│                                  │
│     [Illustration]               │
│     (200x200, purple circle)     │
│                                  │
│     No Data                      │
│     You can see your...          │
│                                  │
│     [↻ Retry]                    │
└─────────────────────────────────┘
```

**Specifications:**
- Header Background: `#6200EA`
- Filter Background: `#FFFFFF`
- Filter Padding: `16px`
- Illustration Circle: `200px`, `#F3E5F5`
- Empty State Text: `h6`, 600 weight

### 4. Profile Page

**Layout:**
```
┌─────────────────────────────────┐
│ Purple Header                    │
│                                  │
│      [Avatar - 100px]            │
│      Name (h5, 700)              │
│      Email (body2)               │
│                                  │
├─────────────────────────────────┤
│ [🟣] Profile              >      │
│ ────────────────────────────     │
│ [🔵] Language    English  >      │
│ ────────────────────────────     │
│ [🟣] Terms & Conditions   >      │
│ ────────────────────────────     │
│ [🔵] About Us             >      │
│ ────────────────────────────     │
│ [🟠] Logout               >      │
└─────────────────────────────────┘
```

**Specifications:**
- Avatar:
  - Size: `100px`
  - Border: `4px solid rgba(255,255,255,0.3)`
  - Background: white
  - Color: primary

- Icon Backgrounds:
  - Profile: `#E1BEE7` (light purple)
  - Language: `#B3E5FC` (light blue)
  - Terms: `#D1C4E9` (light purple)
  - About: `#B3E5FC` (light blue)
  - Logout: `#FFE0B2` (light orange)

- List Items:
  - Padding: `16px`
  - Border Bottom: `1px solid #E0E0E0`

### 5. Bottom Navigation

**Specifications:**
- Position: Fixed bottom
- Background: White
- Height: `56px`
- Box Shadow: `0 -2px 8px rgba(0,0,0,0.1)`
- Active Color: `#6200EA`
- Inactive Color: `#757575`

**Items:**
1. Home (🏠)
2. My Bookings (🛒)
3. Profile (👤)

## Responsive Breakpoints

- **Mobile**: `< 600px`
- **Tablet**: `600px - 960px`
- **Desktop**: `> 960px`

## Animations

### Hover Effects
- **Cards**: `transform: translateY(-8px)`, `transition: 0.3s`
- **Buttons**: `transform: translateY(-2px)`, `transition: 0.3s`

### Loading States
- **Spinner**: Material-UI CircularProgress
- **Color**: Primary purple

## Spacing System

- **xs**: `4px`
- **sm**: `8px`
- **md**: `16px`
- **lg**: `24px`
- **xl**: `32px`

## Border Radius

- **Small**: `8px`
- **Medium**: `12px`
- **Large**: `16px`
- **XL**: `24px`

## Shadows

- **Card**: `0 2px 8px rgba(0,0,0,0.08)`
- **Card Hover**: `0 4px 16px rgba(0,0,0,0.12)`
- **Elevated**: `0 8px 24px rgba(0,0,0,0.15)`

## Icons

- **Size Small**: `18px`
- **Size Medium**: `24px`
- **Size Large**: `32px`
- **Size XL**: `48px`

## Implementation Notes

1. All measurements are in pixels unless specified
2. Use Material-UI's `sx` prop for styling
3. Maintain consistent spacing using theme spacing units
4. Use theme colors instead of hardcoded values where possible
5. Ensure all interactive elements have hover states
6. Test on mobile devices for touch targets (minimum 44x44px)
7. Maintain WCAG AA contrast ratios for accessibility
