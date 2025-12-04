import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Button,
  Divider,
} from '@mui/material'
import { Receipt, LocationOn, Home, CalendarToday, Refresh, FilterList } from '@mui/icons-material'
import { IconButton, MenuItem, TextField } from '@mui/material'
import { fetchMyBookings } from '../store/slices/bookingSlice'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { bookings, loading } = useSelector((state) => state.booking)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    dispatch(fetchMyBookings())
  }, [dispatch])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await dispatch(fetchMyBookings()).unwrap()
      toast.success('Bookings refreshed')
    } catch (error) {
      toast.error('Failed to refresh bookings')
    } finally {
      setRefreshing(false)
    }
  }

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter((booking) => statusFilter === 'all' || booking.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.bookingDate) - new Date(a.bookingDate)
      } else {
        return new Date(a.bookingDate) - new Date(b.bookingDate)
      }
    })

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      payment_pending: 'warning',
      payment_partial: 'info',
      approved: 'success',
      rejected: 'error',
      completed: 'success',
      cancelled: 'error',
    }
    return colors[status] || 'default'
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              My Bookings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and manage your plot bookings
            </Typography>
          </Box>
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            sx={{ bgcolor: 'background.paper' }}
          >
            <Refresh sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </IconButton>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Status Filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="all">All Bookings</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="payment_pending">Payment Pending</MenuItem>
                <MenuItem value="payment_partial">Partial Payment</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                size="small"
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                <FilterList />
                <Typography variant="body2" color="text.secondary">
                  {filteredBookings.length} Booking{filteredBookings.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {filteredBookings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
            {/* Illustration Circle */}
            <Box
              sx={{
                width: 200,
                height: 200,
                margin: '0 auto 24px',
                bgcolor: '#E8D5F5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Receipt sx={{ fontSize: 80, color: 'primary.main' }} />
            </Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              No Bookings Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {statusFilter === 'all' 
                ? "You haven't made any bookings yet"
                : `No ${statusFilter} bookings found`}
            </Typography>
            <Button 
              variant="contained"
              onClick={() => navigate('/colonies')}
            >
              Browse Colonies
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredBookings.map((booking) => (
              <Grid item xs={12} key={booking._id}>
                <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                  <CardContent onClick={() => navigate(`/plots/${booking.plotId?._id}`)}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Booking #{booking.bookingNumber}
                        </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                          <CalendarToday fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {format(new Date(booking.bookingDate), 'dd MMM yyyy, hh:mm a')}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={booking.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(booking.status)}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Home color="primary" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Plot Details
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {booking.plotId?.plotNo}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {booking.plotId?.areaGaj} Gaj • {booking.plotId?.facing} Facing
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <LocationOn color="primary" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Colony
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {booking.plotId?.colonyId?.name}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography variant="caption" color="text.secondary">
                          Total Amount
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          ₹{booking.totalAmount?.toLocaleString()}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography variant="caption" color="text.secondary">
                          Paid Amount
                        </Typography>
                        <Typography variant="h6" fontWeight={600} color="success.main">
                          ₹{booking.paidAmount?.toLocaleString()}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography variant="caption" color="text.secondary">
                          Pending Amount
                        </Typography>
                        <Typography variant="h6" fontWeight={600} color="error.main">
                          ₹{booking.pendingAmount?.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>

                    {booking.notes && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="caption" color="text.secondary">
                          Notes
                        </Typography>
                        <Typography variant="body2">
                          {booking.notes}
                        </Typography>
                      </>
                    )}
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/plots/${booking.plotId?._id}`)
                        }}
                      >
                        View Plot
                      </Button>
                      {booking.status === 'payment_pending' && (
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            toast.info('Payment feature coming soon')
                          }}
                        >
                          Make Payment
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default MyBookings
