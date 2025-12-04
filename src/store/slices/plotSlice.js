import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

const initialState = {
  plots: [],
  selectedPlot: null,
  loading: false,
  error: null,
}

export const fetchPlots = createAsyncThunk(
  'plot/fetchPlots',
  async (propertyId, { rejectWithValue }) => {
    try {
      const url = propertyId ? `/plots/property/${propertyId}` : '/plots'
      const { data } = await axios.get(url)
      console.log('📦 Plots API Response:', data)
      
      // Handle different response structures
      if (data.data?.plots && Array.isArray(data.data.plots)) {
        return data.data.plots
      }
      if (Array.isArray(data.data)) {
        return data.data
      }
      
      console.warn('⚠️ Unexpected plots data structure:', data)
      return []
    } catch (error) {
      console.error('❌ Fetch plots error:', error)
      return []
    }
  }
)

export const fetchPlotById = createAsyncThunk(
  'plot/fetchPlotById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/plots/${id}`)
      console.log('📦 Plot Details API Response:', data)
      
      if (data.data?.plot) {
        return data.data.plot
      }
      if (data.data) {
        return data.data
      }
      
      return null
    } catch (error) {
      console.error('❌ Fetch plot error:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plot')
    }
  }
)

const plotSlice = createSlice({
  name: 'plot',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedPlot: (state, action) => {
      state.selectedPlot = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlots.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPlots.fulfilled, (state, action) => {
        state.loading = false
        state.plots = action.payload
      })
      .addCase(fetchPlots.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchPlotById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPlotById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedPlot = action.payload
      })
      .addCase(fetchPlotById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setSelectedPlot } = plotSlice.actions
export default plotSlice.reducer
const IS_PROD = import.meta.env.MODE === 'production'
