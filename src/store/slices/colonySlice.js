import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

const initialState = {
  colonies: [],
  selectedColony: null,
  loading: false,
  error: null,
}

export const fetchColonies = createAsyncThunk(
  'colony/fetchColonies',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.get('/colonies')
      console.log('📦 Colonies API Response:', data)
      
      // Handle different response structures
      if (data.data?.colonies && Array.isArray(data.data.colonies)) {
        return data.data.colonies
      }
      if (Array.isArray(data.data)) {
        return data.data
      }
      if (Array.isArray(data)) {
        return data
      }
      
      console.warn('⚠️ Unexpected colonies data structure:', data)
      return []
    } catch (error) {
      console.error('❌ Fetch colonies error:', error)
      // Return empty array on error
      return []
    }
  }
)

export const fetchColonyById = createAsyncThunk(
  'colony/fetchColonyById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/colonies/${id}`)
      return data.data || data.data.colony || null
    } catch (error) {
      console.error('Fetch colony error:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch colony')
    }
  }
)

const colonySlice = createSlice({
  name: 'colony',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedColony: (state, action) => {
      state.selectedColony = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColonies.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchColonies.fulfilled, (state, action) => {
        state.loading = false
        state.colonies = action.payload
      })
      .addCase(fetchColonies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchColonyById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchColonyById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedColony = action.payload
      })
      .addCase(fetchColonyById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setSelectedColony } = colonySlice.actions
export default colonySlice.reducer
const IS_PROD = import.meta.env.MODE === 'production'
