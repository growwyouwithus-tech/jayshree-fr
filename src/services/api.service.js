import axios from '../api/axios'

// Property Services (Replaces Colony Services)
export const propertyService = {
  // Get all properties with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.city) params.append('city', filters.city)
    if (filters.minPrice) params.append('minPrice', filters.minPrice)
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('search', filters.search)
    
    const { data } = await axios.get(`/properties/public?${params.toString()}`)
    return data.data?.properties || []
  },

  // Get property by ID
  getById: async (id) => {
    const { data } = await axios.get(`/properties/public/${id}`)
    return data.data?.property || null
  },

  // Get featured properties
  getFeatured: async () => {
    const { data } = await axios.get('/properties/public?status=active')
    return data.data?.properties || []
  },

  // Search properties
  search: async (searchTerm) => {
    const { data } = await axios.get(`/properties/public?search=${searchTerm}`)
    return data.data?.properties || []
  }
}

// Keep colonyService for backward compatibility (redirects to propertyService)
export const colonyService = propertyService

// Plot Services
export const plotService = {
  // Get plots by property
  getByProperty: async (propertyId) => {
    const { data } = await axios.get(`/plots/property/${propertyId}`)
    return data.data?.plots || []
  },

  // Keep old method for backward compatibility
  getByColony: async (colonyId) => {
    return plotService.getByProperty(colonyId)
  },

  // Get plot by ID
  getById: async (id) => {
    const { data } = await axios.get(`/plots/${id}`)
    return data.data?.plot || null
  },

  // Get available plots
  getAvailable: async (colonyId) => {
    const { data } = await axios.get(`/plots?colony=${colonyId}&status=available`)
    return data.data.plots
  }
}

// Booking Services
export const bookingService = {
  // Create booking
  create: async (bookingData) => {
    const { data } = await axios.post('/bookings', bookingData)
    return data.data.booking
  },

  // Get user bookings
  getMyBookings: async () => {
    const { data } = await axios.get('/bookings/my-bookings')
    return data.data.bookings
  },

  // Get booking by ID
  getById: async (id) => {
    const { data } = await axios.get(`/bookings/${id}`)
    return data.data.booking
  },

  // Cancel booking
  cancel: async (id) => {
    const { data } = await axios.patch(`/bookings/${id}/cancel`)
    return data.data.booking
  }
}

// User Services
export const userService = {
  // Get profile
  getProfile: async () => {
    const { data } = await axios.get('/users/profile')
    return data.data.user
  },

  // Update profile
  updateProfile: async (profileData) => {
    const { data } = await axios.patch('/users/profile', profileData)
    return data.data.user
  },

  // Change password
  changePassword: async (passwordData) => {
    const { data } = await axios.patch('/users/change-password', passwordData)
    return data
  },

  // Upload avatar
  uploadAvatar: async (formData) => {
    const { data } = await axios.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data.data.user
  }
}

// City Services
export const cityService = {
  // Get all cities
  getAll: async () => {
    const { data } = await axios.get('/cities')
    return data.data.cities
  },

  // Get city by ID
  getById: async (id) => {
    const { data } = await axios.get(`/cities/${id}`)
    return data.data.city
  }
}

// Wishlist Services (using localStorage for now, can be backend later)
export const wishlistService = {
  // Get wishlist
  get: () => {
    const wishlist = localStorage.getItem('wishlist')
    return wishlist ? JSON.parse(wishlist) : []
  },

  // Add to wishlist
  add: (colonyId) => {
    const wishlist = wishlistService.get()
    if (!wishlist.includes(colonyId)) {
      wishlist.push(colonyId)
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }
    return wishlist
  },

  // Remove from wishlist
  remove: (colonyId) => {
    const wishlist = wishlistService.get()
    const filtered = wishlist.filter(id => id !== colonyId)
    localStorage.setItem('wishlist', JSON.stringify(filtered))
    return filtered
  },

  // Check if in wishlist
  has: (colonyId) => {
    const wishlist = wishlistService.get()
    return wishlist.includes(colonyId)
  },

  // Clear wishlist
  clear: () => {
    localStorage.removeItem('wishlist')
    return []
  }
}

// Compare Services (using localStorage)
export const compareService = {
  // Get compare list
  get: () => {
    const compare = localStorage.getItem('compare')
    return compare ? JSON.parse(compare) : []
  },

  // Add to compare (max 3)
  add: (colonyId) => {
    const compare = compareService.get()
    if (compare.length >= 3) {
      throw new Error('Maximum 3 properties can be compared')
    }
    if (!compare.includes(colonyId)) {
      compare.push(colonyId)
      localStorage.setItem('compare', JSON.stringify(compare))
    }
    return compare
  },

  // Remove from compare
  remove: (colonyId) => {
    const compare = compareService.get()
    const filtered = compare.filter(id => id !== colonyId)
    localStorage.setItem('compare', JSON.stringify(filtered))
    return filtered
  },

  // Check if in compare
  has: (colonyId) => {
    const compare = compareService.get()
    return compare.includes(colonyId)
  },

  // Clear compare
  clear: () => {
    localStorage.removeItem('compare')
    return []
  }
}

// Notification Services
export const notificationService = {
  // Get notifications
  getAll: async () => {
    const { data } = await axios.get('/notifications')
    return data.data.notifications
  },

  // Mark as read
  markAsRead: async (id) => {
    const { data } = await axios.patch(`/notifications/${id}/read`)
    return data.data.notification
  },

  // Mark all as read
  markAllAsRead: async () => {
    const { data } = await axios.patch('/notifications/mark-all-read')
    return data
  },

  // Delete notification
  delete: async (id) => {
    const { data } = await axios.delete(`/notifications/${id}`)
    return data
  }
}

// Settings Services
export const settingsService = {
  // Get app settings
  getSettings: async () => {
    const { data } = await axios.get('/settings')
    return data.data.settings
  },

  // Get company info
  getCompanyInfo: async () => {
    const { data } = await axios.get('/settings/company')
    return data.data.company
  }
}

export default {
  colony: colonyService,
  plot: plotService,
  booking: bookingService,
  user: userService,
  city: cityService,
  wishlist: wishlistService,
  compare: compareService,
  notification: notificationService,
  settings: settingsService
}
