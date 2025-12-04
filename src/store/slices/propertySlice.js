import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

const initialState = {
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,
}

export const fetchProperties = createAsyncThunk(
  'property/fetchProperties',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/properties/public')
      console.log('📦 Properties API Response:', data)
      
      // Handle different response structures
      if (data.data?.properties && Array.isArray(data.data.properties)) {
        return data.data.properties
      }
      if (Array.isArray(data.data)) {
        return data.data
      }
      if (Array.isArray(data)) {
        return data
      }
      
      console.warn('⚠️ Unexpected properties data structure:', data)
      return []
    } catch (error) {
      console.error('❌ Fetch properties error:', error)
      // Return empty array on error
      return []
    }
  }
)

export const fetchPropertyById = createAsyncThunk(
  'property/fetchPropertyById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/properties/public/${id}`)
      console.log('📦 Property Details API Response:', data)
      
      // Handle different response structures
      if (data.data?.property) {
        return data.data.property
      }
      if (data.data) {
        return data.data
      }
      
      console.warn('⚠️ Unexpected property data structure:', data)
      return null
    } catch (error) {
      console.error('❌ Fetch property error:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch property')
    }
  }
)

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false
        state.properties = action.payload
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedProperty = action.payload
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setSelectedProperty } = propertySlice.actions
export default propertySlice.reducer
