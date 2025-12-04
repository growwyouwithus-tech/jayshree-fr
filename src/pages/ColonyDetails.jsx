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
  CardMedia,
  Chip,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material'
import {
  LocationOn,
  CheckCircle,
  ArrowBack,
  Home,
  Landscape,
  AttachMoney,
  Favorite,
  FavoriteBorder,
  CompareArrows,
  Share,
} from '@mui/icons-material'
import { fetchColonyById } from '../store/slices/colonySlice'
import { fetchPlots } from '../store/slices/plotSlice'
import { wishlistService, compareService } from '../services/api.service'
import toast from 'react-hot-toast'
import ImageGallery from '../components/ImageGallery'
import GoogleMapEmbed from '../components/GoogleMapEmbed'

const ColonyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { selectedColony, loading: colonyLoading } = useSelector((state) => state.colony)
  const { plots, loading: plotsLoading } = useSelector((state) => state.plot)
  const { isAuthenticated } = useSelector((state) => state.auth)
  
  const [isFavorite, setIsFavorite] = useState(false)
  const [isInCompare, setIsInCompare] = useState(false)

  useEffect(() => {
    dispatch(fetchColonyById(id))
    dispatch(fetchPlots(id))
    
    // Check if in wishlist and compare
    setIsFavorite(wishlistService.has(id))
    setIsInCompare(compareService.has(id))
  }, [dispatch, id, isAuthenticated]) // Re-fetch when auth changes

  // Debug logging
  useEffect(() => {
    console.log('🏘️ PropertyDetails: Data updated:', {
      colonyId: id,
      isAuthenticated,
      colony: selectedColony ? {
        name: selectedColony.name,
        images: selectedColony.mapImages?.length || 0,
        plots: plots.length
      } : null
    })
  }, [selectedColony, plots, isAuthenticated, id])

  if (colonyLoading || !selectedColony) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  const availablePlots = plots.filter((p) => p.status === 'available')

  const handleToggleFavorite = () => {
    if (isFavorite) {
      wishlistService.remove(id)
      setIsFavorite(false)
      toast.success('Removed from favorites')
    } else {
      wishlistService.add(id)
      setIsFavorite(true)
      toast.success('Added to favorites')
    }
  }

  const handleToggleCompare = () => {
    if (isInCompare) {
      compareService.remove(id)
      setIsInCompare(false)
      toast.success('Removed from comparison')
    } else {
      try {
        compareService.add(id)
        setIsInCompare(true)
        toast.success('Added to comparison')
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedColony.name,
        text: `Check out ${selectedColony.name} on Jayshri Properties`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header with Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/colonies')}
          >
            Back to Colonies
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={handleToggleFavorite}
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'background.paper' }
              }}
            >
              {isFavorite ? <Favorite sx={{ color: '#f44336' }} /> : <FavoriteBorder />}
            </IconButton>
            <IconButton 
              onClick={handleToggleCompare}
              sx={{ 
                bgcolor: isInCompare ? 'primary.main' : 'background.paper',
                color: isInCompare ? 'white' : 'inherit',
                boxShadow: 1,
                '&:hover': { bgcolor: isInCompare ? 'primary.main' : 'background.paper' }
              }}
            >
              <CompareArrows />
            </IconButton>
            <IconButton 
              onClick={handleShare}
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'background.paper' }
              }}
            >
              <Share />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Images and Details */}
          <Grid item xs={12} md={8}>
            {/* Image Gallery with Swiper */}
            <ImageGallery 
              images={selectedColony.mapImages || []} 
              title={selectedColony.name}
            />

            {/* Property Info */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {selectedColony.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocationOn color="action" />
                  <Typography variant="body1" color="text.secondary">
                    {selectedColony.location?.address}, {selectedColony.location?.city}, {selectedColony.location?.state} - {selectedColony.location?.pincode}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  <Chip
                    label={`₹${selectedColony.basePricePerGaj?.toLocaleString()}/Gaj`}
                    color="primary"
                  />
                  <Chip
                    label={`${selectedColony.totalPlots} Total Plots`}
                    variant="outlined"
                  />
                  <Chip
                    label={`${selectedColony.availablePlots} Available`}
                    color="success"
                  />
                  <Chip
                    label={selectedColony.status?.replace('_', ' ').toUpperCase()}
                    color="info"
                    variant="outlined"
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {selectedColony.description || 'Premium residential property with modern amenities and excellent connectivity.'}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Amenities
                </Typography>
                <Grid container spacing={1}>
                  {selectedColony.amenities?.map((amenity, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle fontSize="small" color="success" />
                        <Typography variant="body2">{amenity}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {selectedColony.facilities && selectedColony.facilities.length > 0 && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Facilities
                    </Typography>
                    <Grid container spacing={1}>
                      {selectedColony.facilities.map((facility, idx) => (
                        <Grid item xs={12} sm={6} key={idx}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircle fontSize="small" color="primary" />
                            <Typography variant="body2">{facility}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Google Maps */}
            <GoogleMapEmbed 
              location={selectedColony.location} 
              name={selectedColony.name}
            />
          </Grid>

          {/* Right Column - Quick Info */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 80 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Quick Info
                </Typography>

                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Home color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Total Area"
                      secondary={`${selectedColony.totalLandAreaGaj?.toFixed(2)} Gaj`}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Landscape color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Total Plots"
                      secondary={`${selectedColony.totalPlots} Plots`}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <AttachMoney color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Base Price"
                      secondary={`₹${selectedColony.basePricePerGaj?.toLocaleString()}/Gaj`}
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {availablePlots.length} plots available for booking
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                  disabled={availablePlots.length === 0}
                >
                  View Available Plots
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Available Plots Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Available Plots
          </Typography>

          {plotsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : availablePlots.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No plots available at the moment
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {availablePlots.map((plot) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={plot._id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
                    }}
                    onClick={() => navigate(`/plots/${plot._id}`)}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {plot.plotNo}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Area: {plot.areaGaj} Gaj
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Facing: {plot.facing}
                        </Typography>
                        {plot.cornerPlot && (
                          <Chip label="Corner Plot" size="small" color="warning" sx={{ mt: 1 }} />
                        )}
                      </Box>

                      <Typography variant="h6" color="primary.main" fontWeight={700}>
                        ₹{plot.totalPrice?.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ₹{plot.pricePerGaj?.toLocaleString()}/Gaj
                      </Typography>

                      <Button variant="outlined" fullWidth sx={{ mt: 2 }} size="small">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default ColonyDetails
