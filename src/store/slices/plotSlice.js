import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'
import { demoPlots } from '../../data/demoData'

const initialState = {
  plots: [],
  selectedPlot: null,
  loading: false,
  error: null,
}

export const fetchPlots = createAsyncThunk(
  'plot/fetchPlots',
  async (colonyId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState()
      const config = {}
      
      // Add auth header if user is authenticated
      if (auth.token) {
        config.headers = {
          'Authorization': `Bearer ${auth.token}`
        }
      }
      
      const url = colonyId ? `/plots?colonyId=${colonyId}` : '/plots'
      const { data } = await axios.get(url, config)
      console.log('✅ Fetched real plots from backend:', data.data.plots.length)
      return data.data.plots
    } catch (error) {
      // Return demo data if backend fails
      console.log('Using demo plots data:', error.response?.status === 401 ? 'Authentication required' : error.message)
      if (colonyId) {
        return demoPlots.filter(p => p.colonyId._id === colonyId)
      }
      return demoPlots
    }
  }
)

export const fetchPlotById = createAsyncThunk(
  'plot/fetchPlotById',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState()
      const config = {}
      
      // Add auth header if user is authenticated
      if (auth.token) {
        config.headers = {
          'Authorization': `Bearer ${auth.token}`
        }
      }
      
      const { data } = await axios.get(`/plots/${id}`, config)
      console.log('✅ Fetched real plot from backend:', data.data.plot.plotNo)
      return data.data.plot
    } catch (error) {
      // Return demo data if backend fails
      console.log('Using demo plot data:', error.response?.status === 401 ? 'Authentication required' : error.message)
      const plot = demoPlots.find(p => p._id === id)
      return plot || demoPlots[0]
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
