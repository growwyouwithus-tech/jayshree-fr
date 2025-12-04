import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Use customer-auth endpoint for user app
      const { data } = await axios.post('/customer-auth/login', credentials)
      // Backend returns { data: { customer, token } }
      const user = data.data.customer
      const token = data.data.token

      // Store tokens
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      return {
        user,
        token,
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      console.error('Login error:', errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Use customer-auth endpoint for user app
      const { data } = await axios.post('/customer-auth/register', userData)
      // Backend returns { data: { customer, token } }
      const user = data.data.customer
      const token = data.data.token

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      return {
        user,
        token,
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      console.error('Registration error:', errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('refreshToken')
})

// Fetch current user profile
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/customer-auth/me')
      const user = data.data
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch profile'
      return rejectWithValue(errorMessage)
    }
  }
)

// Update user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put('/customer-auth/profile', profileData)
      const user = data.data
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile'
      return rejectWithValue(errorMessage)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setAuthFromStorage: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = action.payload.isAuthenticated
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken
        }
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.payload || 'Login failed'
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken
        }
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.payload || 'Registration failed'
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
      })
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setAuthFromStorage } = authSlice.actions
export default authSlice.reducer
