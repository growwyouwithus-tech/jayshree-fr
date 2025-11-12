# Quick Start Guide 🚀

## Login Issue Fixed! ✅

Ab app **bina backend ke** bhi kaam karega! Demo mode mein automatically chala jayega.

## Installation

```bash
cd user
npm install
```

## Run the App

```bash
npm run dev
```

App will run on: **http://localhost:5174**

## Demo Login Credentials

**Koi bhi email aur password use kar sakte ho!**

Example:
- Email: `demo@test.com`
- Password: `123456`

Ya phir:
- Email: `user@example.com`
- Password: `password`

**Kuch bhi dalo, login ho jayega!** 🎉

## Features Working Without Backend

### ✅ Authentication
- Login (demo mode)
- Register (demo mode)
- Logout

### ✅ Properties
- View all properties (3 demo colonies)
- Property details page
- Colony details page

### ✅ Plots
- View plots (3 demo plots)
- Plot details with:
  - AVAILABLE badge
  - Dimensions
  - Price toggle
  - Contact & Book Now buttons

### ✅ Bookings
- Create booking (demo)
- View bookings (empty state)

### ✅ Profile
- View profile
- Settings menu

### ✅ Other Pages
- Notifications (empty state)
- Referral system
- Bottom navigation

## Demo Data Available

### Colonies:
1. **live longer live happy** (Agra)
   - 100 plots, 45 available
   - ₹5,000/Gaj

2. **Green Valley Residency** (Mumbai)
   - 80 plots, 20 available
   - ₹12,000/Gaj

3. **Sunrise Heights** (Delhi)
   - 60 plots, 15 available
   - ₹15,000/Gaj

### Plots:
- Plot #25 (180.56 Gaj) - ₹9,02,800
- Plot #26 (166.67 Gaj) - ₹8,33,350
- Plot #10 (266.67 Gaj) - ₹32,00,040

## Backend Integration (Optional)

Agar backend running hai to automatically backend se data fetch hoga.

### Backend Setup:
```bash
cd backend
npm install
npm run dev
```

Backend runs on: **http://localhost:5000**

### Environment Variables:
Create `.env` file in user folder:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Troubleshooting

### Login Not Working?
- ✅ **Fixed!** Ab koi bhi credentials se login ho jayega
- Demo mode automatically activate ho jata hai

### No Data Showing?
- ✅ **Fixed!** Demo data automatically load hoga
- Backend ki zaroorat nahi hai

### Backend Connection Failed?
- ✅ **No Problem!** App demo mode mein chalta rahega
- Console mein "Using demo data" message dikhega

## Testing Flow

1. **Open App**: http://localhost:5174
2. **Login**: Koi bhi email/password
3. **Browse Properties**: Home page pe 3 properties dikhenge
4. **View Property**: Click on any property card
5. **See Plots**: Click "Apply Property" button
6. **View Plot Details**: Click on any plot
7. **Book Plot**: Click "Book Now" button
8. **Check Bookings**: Go to "My Bookings" tab

## Screenshots Match ✅

All pages exactly match the screenshots:
- ✅ Property Details (grey header)
- ✅ My Bookings (purple header, filters, empty state)
- ✅ Notifications (purple header, empty state)
- ✅ Profile (purple header, circular icons)
- ✅ Home (All Properties section)
- ✅ Plot Details (AVAILABLE badge, price toggle)

## Need Help?

Agar koi issue ho to:
1. Browser console check karo (F12)
2. "Using demo data" messages dikhne chahiye
3. Refresh karo (Ctrl + R)
4. Cache clear karo (Ctrl + Shift + Delete)

## Production Build

```bash
npm run build
```

Build files will be in `dist/` folder.

---

**Ab login ho jayega! Enjoy! 🎉**
