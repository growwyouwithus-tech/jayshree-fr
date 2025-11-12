# Jayshree Properties - Customer App 📱

Customer-facing React application for browsing properties, viewing plots, and making bookings. Built with modern UI/UX matching mobile app design patterns.

![Purple Theme](https://img.shields.io/badge/Theme-Purple%20%236200EA-blueviolet)
![React](https://img.shields.io/badge/React-18-blue)
![Material--UI](https://img.shields.io/badge/Material--UI-5-blue)

## ✨ Features

### 🏠 Browse & Explore
- **Home Page** - Purple gradient hero with featured properties
- **Property Listing** - Grid layout with filters and sorting
- **Property Details** - Card-based design with "Apply Property" button
- **Colony Details** - Full colony information with available plots
- **Plot Details** - Interactive plot card with:
  - "AVAILABLE" badge (green, rotated)
  - Plot number badge
  - Dimensions overlay
  - Price toggle (Price/Yard vs Total Price)
  - Contact & Book Now buttons

### 👤 User Features
- **Authentication** - Modern login and registration
- **My Bookings** - Track bookings with status filters
- **Profile** - List-style menu with colorful icons
- **Notifications** - Empty state with illustration
- **Referral System** - Share and earn rewards

### 🎨 UI/UX Design
- **Purple Theme** (#6200EA) - Consistent branding
- **Bottom Navigation** - Home, My Bookings, Profile (mobile)
- **Purple Headers** - All pages with white text
- **Modern Cards** - Rounded corners, shadows, hover effects
- **Responsive** - Mobile-first design
- **Smooth Animations** - Transitions and hover states

## Tech Stack

- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Material-UI (MUI)** - Component library
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Date-fns** - Date formatting
- **Vite** - Build tool

## Getting Started

### Prerequisites
- Node.js 16+ installed
- Backend server running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

3. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:5174`

### Build for Production

```bash
npm run build
```

## Project Structure

```
user/
├── src/
│   ├── api/              # API configuration
│   │   └── axios.js      # Axios instance with interceptors
│   ├── components/       # Reusable components
│   │   ├── layouts/      # Layout components
│   │   ├── Navbar.jsx    # Navigation bar
│   │   └── Footer.jsx    # Footer component
│   ├── pages/            # Page components
│   │   ├── Home.jsx      # Landing page
│   │   ├── Colonies.jsx  # Colony listing (Flipkart-style)
│   │   ├── ColonyDetails.jsx
│   │   ├── PlotDetails.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── MyBookings.jsx
│   │   ├── Profile.jsx
│   │   └── Referral.jsx
│   ├── store/            # Redux store
│   │   ├── slices/       # Redux slices
│   │   └── index.js      # Store configuration
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Key Features Explained

### Property Details Page (Matching Screenshot)
Exactly like the mobile app design:
```
┌─────────────────────────┐
│  < live longer live happy│  ← Grey header
├─────────────────────────┤
│   [House Icon]          │  ← Grey placeholder
├─────────────────────────┤
│ live longer live happy  │
│ 📍 vikas nagar > Awas   │
│ [Residential][Clubhouse]│
│ [Completed: 1]          │
│                         │
│ Description             │
│ serklj hgkhkjfjksdkjhg  │
│                         │
│ ✓ Apply Property        │  ← Purple button
└─────────────────────────┘
```

### Plot Details Page (Matching Screenshot)
```
┌─────────────────────────┐
│  < Colony • Plots       │  ← Purple header
├─────────────────────────┤
│ [AVAILABLE]  [# #25]    │  ← Badges
│   [Map Icon]            │
│ 📏 Dimensions: 25×65 ft │  ← Overlay
├─────────────────────────┤
│ [Price/Yard][Total Price]│ ← Toggle
├─────────────────────────┤
│ 📐 Size: 180.56         │
│ Length: 25.00  Width: 65│
│ [📞 Contact][✓ Book Now]│
└─────────────────────────┘
```

### My Bookings Page
- Purple header with refresh icon
- Filter dropdowns (Status, Sort)
- Empty state with illustration
- "No Data" message with retry button

### Profile Page
- Purple header with avatar
- List menu with colorful icon backgrounds:
  - 👤 Profile (purple)
  - 🌐 Language (blue)
  - 🔒 Terms & Conditions (purple)
  - ℹ️ About Us (blue)
  - 🚪 Logout (orange)

### Booking Flow
1. Browse properties on home page
2. Click property card → Property Details
3. Click "Apply Property" → Colony Details
4. View available plots
5. Click plot → Plot Details
6. Toggle price view
7. Click "Book Now"
8. Enter booking amount
9. Confirm booking
10. Track in "My Bookings"

## API Integration

The app connects to the backend API for:
- User authentication (login/register)
- Fetching colonies and plots
- Creating bookings
- Managing user profile

All API calls are handled through Redux Toolkit's `createAsyncThunk`.

## Styling

- Material-UI theme customization
- Primary color: `#7c4dff` (Purple)
- Secondary color: `#ff6f00` (Orange)
- Smooth transitions and hover effects
- Custom scrollbar styling

## Future Enhancements

- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Advanced search filters
- [ ] Plot comparison feature
- [ ] Wishlist functionality
- [ ] Virtual tour integration
- [ ] Chat support
- [ ] Mobile app (React Native)

## Support

For issues or questions, contact: info@jayshreeproperties.com
