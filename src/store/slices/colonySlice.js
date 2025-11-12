import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'
import { demoColonies } from '../../data/demoData'

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
      const { auth } = getState()
      const config = {}
      
      // Add auth header if user is authenticated
      if (auth.token) {
        config.headers = {
          'Authorization': `Bearer ${auth.token}`
        }
      }
      
      const { data } = await axios.get('/colonies', config)
      console.log('✅ Fetched real colonies from backend:', data.data.colonies.length)
      return data.data.colonies
    } catch (error) {
      // Return demo data if backend fails or user not authenticated
      console.log('Using demo colonies data:', error.response?.status === 401 ? 'Authentication required' : error.message)
      return demoColonies
    }
  }
)

export const fetchColonyById = createAsyncThunk(
  'colony/fetchColonyById',
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
      
      const { data } = await axios.get(`/colonies/${id}`, config)
      console.log('✅ Fetched real colony from backend:', data.data.colony.name)
      return data.data.colony
    } catch (error) {
      // Return demo data if backend fails
      console.log('Using demo colony data:', error.response?.status === 401 ? 'Authentication required' : error.message)
      const colony = demoColonies.find(c => c._id === id)
      return colony || demoColonies[0]
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
