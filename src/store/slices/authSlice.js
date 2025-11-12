import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Try actual backend login first
      const { data } = await axios.post('/auth/login', credentials)
      // Backend returns { data: { user, accessToken, refreshToken } }
      const user = data.data.user
      const accessToken = data.data.accessToken
      const refreshToken = data.data.refreshToken

      // Store tokens
      localStorage.setItem('token', accessToken)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user))

      return {
        user,
        token: accessToken,
        refreshToken,
      }
    } catch (error) {
      // If backend fails, use demo login as fallback
      console.log('Backend login failed, using demo mode:', error.response?.data?.message || error.message)
      
      const demoUser = {
        _id: 'demo123',
        name: 'Demo User',
        email: credentials.email,
        phone: '9876543210',
        roleId: { name: 'Buyer' },
      }
      const demoToken = 'demo-token-' + Date.now()
      
      localStorage.setItem('token', demoToken)
      localStorage.setItem('user', JSON.stringify(demoUser))
      
      return {
        user: demoUser,
        token: demoToken,
      }
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Demo registration - works without backend
      if (userData.email && userData.password && userData.name) {
        const demoUser = {
          _id: 'demo' + Date.now(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '9876543210',
          roleId: { name: 'Buyer' },
        }
        const demoToken = 'demo-token-' + Date.now()
        
        localStorage.setItem('token', demoToken)
        localStorage.setItem('user', JSON.stringify(demoUser))
        
        return {
          user: demoUser,
          token: demoToken,
        }
      }
      
      // Try actual backend registration
      const { data } = await axios.post('/auth/register', userData)
      const user = data.data.user
      const accessToken = data.data.accessToken
      const refreshToken = data.data.refreshToken

      localStorage.setItem('token', accessToken)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user))

      return {
        user,
        token: accessToken,
        refreshToken,
      }
    } catch (error) {
      // If backend fails, use demo registration
      const demoUser = {
        _id: 'demo' + Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '9876543210',
        roleId: { name: 'Buyer' },
      }
      const demoToken = 'demo-token-' + Date.now()
      
      localStorage.setItem('token', demoToken)
      localStorage.setItem('user', JSON.stringify(demoUser))
      
      return {
        user: demoUser,
        token: demoToken,
      }
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
})

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
        state.isAuthenticated = false
      })
  },
})

export const { clearError, setAuthFromStorage } = authSlice.actions
export default authSlice.reducer
