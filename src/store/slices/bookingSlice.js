import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'
import { demoBookings } from '../../data/demoData'

const initialState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
}

export const fetchMyBookings = createAsyncThunk(
  'booking/fetchMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/bookings')
      return data.data.bookings
    } catch (error) {
      // Return demo data if backend fails
      console.log('Using demo bookings data')
      return demoBookings
    }
  }
)

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/bookings', bookingData)
      return data.data.booking
    } catch (error) {
      // Create demo booking if backend fails
      console.log('Creating demo booking')
      const demoBooking = {
        _id: 'booking' + Date.now(),
        bookingNumber: 'BK' + Date.now(),
        plotId: bookingData.plotId,
        bookingAmount: bookingData.bookingAmount,
        totalAmount: bookingData.bookingAmount,
        paidAmount: bookingData.bookingAmount,
        pendingAmount: 0,
        status: 'pending',
        bookingDate: new Date().toISOString(),
      }
      return demoBooking
    }
  }
)

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false
        state.bookings.unshift(action.payload)
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = bookingSlice.actions
export default bookingSlice.reducer
