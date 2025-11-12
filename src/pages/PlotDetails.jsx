import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Rating,
  LinearProgress,
} from '@mui/material'
import {
  ArrowBack,
  LocationOn,
  Map,
  AspectRatio,
  AttachMoney,
  Phone,
  CheckCircle,
  Tag,
  Share,
  FavoriteBorder,
  Favorite,
  Info,
} from '@mui/icons-material'
import { fetchPlotById } from '../store/slices/plotSlice'
import { createBooking } from '../store/slices/bookingSlice'
import toast from 'react-hot-toast'

const PlotDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { selectedPlot, loading } = useSelector((state) => state.plot)
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [bookingDialog, setBookingDialog] = useState(false)
  const [bookingAmount, setBookingAmount] = useState('')
  const [priceView, setPriceView] = useState('perYard')
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    dispatch(fetchPlotById(id))
  }, [dispatch, id])

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a plot')
      navigate('/login')
      return
    }

    if (!bookingAmount || bookingAmount <= 0) {
      toast.error('Please enter a valid booking amount')
      return
    }

    try {
      await dispatch(createBooking({
        plotId: id,
        bookingAmount: Number(bookingAmount),
      })).unwrap()

      toast.success('Booking request submitted successfully!')
      setBookingDialog(false)
      navigate('/my-bookings')
    } catch (error) {
      toast.error(error || 'Failed to create booking')
    }
  }

  if (loading || !selectedPlot) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  const isAvailable = selectedPlot.status === 'available'

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Professional Header with Gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6200EA 0%, #5200CA 100%)',
          color: 'white',
          p: 2,
          boxShadow: '0 4px 20px rgba(98, 0, 234, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ArrowBack
              onClick={() => navigate(`/colonies/${selectedPlot.colonyId._id}`)}
              sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
            />
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {selectedPlot.colonyId?.name || 'Property'}
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                Plot #{selectedPlot.plotNo}
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={() => setIsFavorite(!isFavorite)}
            sx={{ color: 'white', minWidth: 0, p: 1 }}
          >
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </Button>
        </Box>
      </Box>

      <Container maxWidth="sm" sx={{ px: 2, py: 3 }}>
        {/* Main Content Card */}
        <Card
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            mb: 3,
          }}
        >
          {/* Plot Image Section */}
          <Box
            sx={{
              height: 280,
              background: selectedPlot.image
                ? `url(${selectedPlot.image}) center/cover`
                : 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!selectedPlot.image && <Map sx={{ fontSize: 100, color: '#bdbdbd', opacity: 0.5 }} />}

            {/* Status Badge */}
            <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
              <Chip
                label={isAvailable ? 'AVAILABLE' : 'SOLD'}
                icon={isAvailable ? <CheckCircle sx={{ fontSize: 16, color: 'white !important' }} /> : undefined}
                sx={{
                  bgcolor: isAvailable ? '#4CAF50' : '#757575',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  height: 36,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
              />
            </Box>

            {/* Action Icons */}
            <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  color: 'primary.main',
                  borderRadius: '50%',
                  minWidth: 0,
                  width: 44,
                  height: 44,
                  p: 0,
                  '&:hover': { bgcolor: 'white' },
                }}
              >
                <Share sx={{ fontSize: 20 }} />
              </Button>
            </Box>

            {/* Dimensions Overlay */}
            <Paper
              elevation={3}
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                bgcolor: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                p: 2,
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Length
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {selectedPlot.sideMeasurements?.front} ft
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Width
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {selectedPlot.sideMeasurements?.left} ft
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Location Info */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
              <LocationOn sx={{ color: 'primary.main', mt: 0.5 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Colony Location
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {selectedPlot.colonyId?.name || 'Not specified'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Price Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Plot Price
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'white', textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5 }}>
                      Per Yard
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      ₹{selectedPlot.pricePerYard?.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: 'secondary.main', color: 'white', textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5 }}>
                      Total Price
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      ₹{selectedPlot.totalPrice?.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Specifications */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Specifications
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Area
                    </Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ color: 'primary.main' }}>
                      {selectedPlot.areaGaj} Gaj
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Plot Status
                    </Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ color: 'secondary.main' }}>
                      {isAvailable ? 'Available' : 'Sold'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Phone />}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 700,
                    border: '2px solid',
                    '&:hover': {
                      bgcolor: 'rgba(98, 0, 234, 0.05)',
                      borderColor: 'primary.dark',
                    },
                  }}
                >
                  Contact
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<CheckCircle />}
                  disabled={!isAvailable}
                  onClick={() => setBookingDialog(true)}
                  sx={{
                    bgcolor: 'secondary.main',
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 700,
                    '&:hover': { bgcolor: 'secondary.dark' },
                  }}
                >
                  Book Now
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      {/* Booking Dialog */}
      <Dialog open={bookingDialog} onClose={() => setBookingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book Plot {selectedPlot.plotNo}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Enter your booking amount to proceed. Minimum booking amount is ₹1,00,000.
          </Typography>
          <TextField
            fullWidth
            label="Booking Amount"
            type="number"
            value={bookingAmount}
            onChange={(e) => setBookingAmount(e.target.value)}
            placeholder="100000"
            InputProps={{
              startAdornment: '₹',
            }}
            sx={{ mt: 2 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Total Plot Price: ₹{selectedPlot.totalPrice?.toLocaleString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialog(false)}>Cancel</Button>
          <Button onClick={handleBooking} variant="contained">
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PlotDetails
