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
  Paper,
  useMediaQuery,
  useTheme,
  ImageList,
  ImageListItem,
} from '@mui/material'
import {
  ArrowBack,
  LocationOn,
  Map,
  AspectRatio,
  Phone,
  CheckCircle,
  Share,
  FavoriteBorder,
  Favorite,
  Straighten,
  SquareFoot,
} from '@mui/icons-material'
import { fetchPlotById } from '../store/slices/plotSlice'
import { createBooking } from '../store/slices/bookingSlice'
import toast from 'react-hot-toast'

const PlotDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { selectedPlot, loading } = useSelector((state) => state.plot)
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [bookingDialog, setBookingDialog] = useState(false)
  const [bookingAmount, setBookingAmount] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  // Get API URL for images
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL.replace('/api/v1', '')}${path}`
  }

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
  
  // Get all plot images
  const plotImages = [
    ...(selectedPlot.plotImages || []),
    ...(selectedPlot.images || [])
  ].filter(Boolean)
  
  // Calculate dimensions and area properly
  const length = selectedPlot.dimensions?.length || selectedPlot.sideMeasurements?.front || 0
  const width = selectedPlot.dimensions?.width || selectedPlot.sideMeasurements?.left || 0
  const areaGaj = selectedPlot.areaGaj || selectedPlot.area || 0
  const areaSqFt = selectedPlot.area || (length * width) || 0
  const pricePerYard = selectedPlot.pricePerYard || selectedPlot.pricePerSqFt || 0
  const totalPrice = selectedPlot.totalPrice || (areaSqFt * pricePerYard) || 0

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Professional Header with Gradient */}
      <Box
        sx={{
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          p: { xs: 2, md: 3 },
          boxShadow: '0 4px 20px rgba(65, 152, 10, 0.2)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
              <ArrowBack
                onClick={() => {
                  if (selectedPlot?.propertyId?._id) {
                    navigate(`/properties/${selectedPlot.propertyId._id}`)
                  } else if (selectedPlot?.colonyId?._id) {
                    navigate(`/properties/${selectedPlot.colonyId._id}`)
                  } else {
                    navigate('/properties')
                  }
                }}
                sx={{ cursor: 'pointer', fontSize: { xs: 24, md: 28 }, '&:hover': { opacity: 0.8 } }}
              />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                  {selectedPlot?.propertyId?.name || selectedPlot?.colonyId?.name || 'Property'}
                </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                  Plot #{selectedPlot?.plotNo || selectedPlot?.plotNumber || 'N/A'}
                </Typography>
              </Box>
            </Box>
            <Button
              onClick={() => setIsFavorite(!isFavorite)}
              sx={{ color: 'white', minWidth: 0, p: 1 }}
            >
              {isFavorite ? <Favorite sx={{ fontSize: { xs: 24, md: 28 } }} /> : <FavoriteBorder sx={{ fontSize: { xs: 24, md: 28 } }} />}
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, py: { xs: 3, md: 4 } }}>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Left Column - Images */}
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Main Plot Image */}
              <Box
                sx={{
                  height: { xs: 280, md: 450 },
                  background: plotImages.length > 0
                    ? `url(${getImageUrl(plotImages[selectedImage])}) center/cover`
                    : 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {plotImages.length === 0 && <Map sx={{ fontSize: { xs: 80, md: 120 }, color: '#bdbdbd', opacity: 0.5 }} />}

                {/* Status Badge */}
                <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                  <Chip
                    label={isAvailable ? 'AVAILABLE' : 'SOLD'}
                    icon={isAvailable ? <CheckCircle sx={{ fontSize: 16, color: 'white !important' }} /> : undefined}
                    sx={{
                      bgcolor: isAvailable ? '#4CAF50' : '#757575',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: { xs: '0.75rem', md: '0.85rem' },
                      height: { xs: 32, md: 36 },
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    }}
                  />
                </Box>

                {/* Share Button */}
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      color: 'primary.main',
                      borderRadius: '50%',
                      minWidth: 0,
                      width: { xs: 40, md: 44 },
                      height: { xs: 40, md: 44 },
                      p: 0,
                      '&:hover': { bgcolor: 'white' },
                    }}
                  >
                    <Share sx={{ fontSize: { xs: 18, md: 20 } }} />
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
                    p: { xs: 1.5, md: 2 },
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ opacity: 0.8, fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                        Length
                      </Typography>
                      <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                        {length || 'N/A'} ft
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ opacity: 0.8, fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                        Width
                      </Typography>
                      <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                        {width || 'N/A'} ft
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              {/* Image Gallery Thumbnails */}
              {plotImages.length > 1 && (
                <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <ImageList cols={isMobile ? 4 : 6} gap={8} sx={{ m: 0 }}>
                    {plotImages.map((img, idx) => (
                      <ImageListItem
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        sx={{
                          cursor: 'pointer',
                          border: selectedImage === idx ? '3px solid' : '2px solid transparent',
                          borderColor: 'primary.main',
                          borderRadius: 1,
                          overflow: 'hidden',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`Plot ${idx + 1}`}
                          loading="lazy"
                          style={{ height: '100%', objectFit: 'cover' }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              )}
            </Card>
          </Grid>

          {/* Right Column - Details */}
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                height: '100%',
              }}
            >

              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                {/* Location Info */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                  <LocationOn sx={{ color: 'primary.main', mt: 0.5, fontSize: { xs: 24, md: 28 } }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                      Property Location
                    </Typography>
                    <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}>
                      {selectedPlot?.propertyId?.name || selectedPlot?.propertyId?.address || selectedPlot?.colonyId?.name || 'Not specified'}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Price Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    Plot Price
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: { xs: 1.5, md: 2 }, bgcolor: 'primary.main', color: 'white', textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5, fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                          Per Sq.Ft
                        </Typography>
                        <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                          ₹{pricePerYard?.toLocaleString() || 'N/A'}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: { xs: 1.5, md: 2 }, bgcolor: 'secondary.main', color: 'white', textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5, fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                          Total Price
                        </Typography>
                        <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                          ₹{totalPrice?.toLocaleString() || 'N/A'}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Specifications */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: { xs: '1rem', md: '1.125rem' } }}>
                    Specifications
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: { xs: 1.5, md: 2 }, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <SquareFoot sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            Area (Gaj)
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700} sx={{ color: 'primary.main', fontSize: { xs: '1rem', md: '1.125rem' } }}>
                          {areaGaj.toFixed(3) || 'N/A'} Gaj
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: { xs: 1.5, md: 2 }, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <AspectRatio sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            Area (Sq.Ft)
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700} sx={{ color: 'primary.main', fontSize: { xs: '1rem', md: '1.125rem' } }}>
                          {areaSqFt.toFixed(3) || 'N/A'} Sq.Ft
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: { xs: 1.5, md: 2 }, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Straighten sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            Facing
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700} sx={{ color: 'secondary.main', fontSize: { xs: '1rem', md: '1.125rem' }, textTransform: 'capitalize' }}>
                          {selectedPlot.facing || 'N/A'}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: { xs: 1.5, md: 2 }, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <CheckCircle sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            Status
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700} sx={{ color: 'secondary.main', fontSize: { xs: '1rem', md: '1.125rem' }, textTransform: 'capitalize' }}>
                          {selectedPlot.status || 'N/A'}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Action Buttons */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Phone />}
                      sx={{
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        borderRadius: 2,
                        py: { xs: 1.25, md: 1.5 },
                        fontWeight: 700,
                        border: '2px solid',
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        '&:hover': {
                          bgcolor: 'rgba(65, 152, 10, 0.05)',
                          borderColor: 'primary.dark',
                        },
                      }}
                    >
                      Contact
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<CheckCircle />}
                      disabled={!isAvailable}
                      onClick={() => setBookingDialog(true)}
                      sx={{
                        bgcolor: 'secondary.main',
                        borderRadius: 2,
                        py: { xs: 1.25, md: 1.5 },
                        fontWeight: 700,
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        '&:hover': { bgcolor: 'secondary.dark' },
                      }}
                    >
                      Book Now
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Booking Dialog */}
      <Dialog 
        open={bookingDialog} 
        onClose={() => setBookingDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.125rem', md: '1.25rem' } }}>
          Book Plot #{selectedPlot.plotNo || selectedPlot.plotNumber}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
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
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
            Total Plot Price: ₹{totalPrice?.toLocaleString()}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setBookingDialog(false)} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
            Cancel
          </Button>
          <Button onClick={handleBooking} variant="contained" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PlotDetails
