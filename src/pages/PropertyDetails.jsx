import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
  ImageList,
  ImageListItem,
  Divider,
} from '@mui/material'
import {
  ArrowBack,
  LocationOn,
  Home,
  CheckCircle,
  Map as MapIcon,
  Landscape,
  PhotoLibrary,
} from '@mui/icons-material'
import { fetchPropertyById } from '../store/slices/propertySlice'
import { fetchPlots } from '../store/slices/plotSlice'

const PropertyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { selectedProperty, loading } = useSelector((state) => state.property)
  const { plots, loading: plotsLoading } = useSelector((state) => state.plot)
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [showMap, setShowMap] = useState(false)

  // Get API URL for images
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL.replace('/api/v1', '')}${path}`
  }

  useEffect(() => {
    dispatch(fetchPropertyById(id))
    dispatch(fetchPlots(id)) // Fetch plots for this property
  }, [dispatch, id])

  if (loading || !selectedProperty) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Get all property images
  const propertyImages = [
    selectedProperty.media?.mainPicture,
    ...(selectedProperty.media?.moreImages || [])
  ].filter(Boolean)

  const mapImage = selectedProperty.media?.mapImage

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          p: { xs: 2, md: 3 },
          boxShadow: '0 4px 20px rgba(65, 152, 10, 0.2)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 } }}>
            <ArrowBack 
              onClick={() => navigate('/properties')} 
              sx={{ 
                cursor: 'pointer', 
                fontSize: { xs: 24, md: 28 },
                '&:hover': { opacity: 0.8 }
              }} 
            />
            <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
              {selectedProperty.name || 'Property Details'}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 0, md: 3 }, py: { xs: 0, md: 4 } }}>
        <Grid container spacing={{ xs: 0, md: 4 }}>
          {/* Left Column - Images and Map */}
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                borderRadius: { xs: 0, md: 3 },
                boxShadow: { xs: 'none', md: '0 8px 32px rgba(0, 0, 0, 0.1)' },
                overflow: 'hidden',
                mb: { xs: 0, md: 3 },
              }}
            >
              {/* Main Image/Map Toggle */}
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    height: { xs: 250, md: 450 },
                    backgroundImage: showMap && mapImage
                      ? `url(${getImageUrl(mapImage)})`
                      : propertyImages.length > 0
                      ? `url(${getImageUrl(propertyImages[selectedImage])})`
                      : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    bgcolor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {!showMap && propertyImages.length === 0 && (
                    <Home sx={{ fontSize: { xs: 80, md: 120 }, color: '#888' }} />
                  )}
                  {showMap && !mapImage && (
                    <MapIcon sx={{ fontSize: { xs: 80, md: 120 }, color: '#888' }} />
                  )}
                </Box>

                {/* Toggle Buttons */}
                <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                  {propertyImages.length > 0 && (
                    <Chip
                      icon={<PhotoLibrary />}
                      label="Photos"
                      onClick={() => setShowMap(false)}
                      sx={{
                        bgcolor: !showMap ? 'primary.main' : 'rgba(255, 255, 255, 0.9)',
                        color: !showMap ? 'white' : 'text.primary',
                        fontWeight: 600,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: !showMap ? 'primary.dark' : 'white' },
                      }}
                    />
                  )}
                  {mapImage && (
                    <Chip
                      icon={<MapIcon />}
                      label="Map"
                      onClick={() => setShowMap(true)}
                      sx={{
                        bgcolor: showMap ? 'primary.main' : 'rgba(255, 255, 255, 0.9)',
                        color: showMap ? 'white' : 'text.primary',
                        fontWeight: 600,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: showMap ? 'primary.dark' : 'white' },
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* Image Gallery Thumbnails */}
              {!showMap && propertyImages.length > 1 && (
                <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <ImageList cols={isMobile ? 4 : 6} gap={8} sx={{ m: 0 }}>
                    {propertyImages.map((img, idx) => (
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
                          alt={`Property ${idx + 1}`}
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
                borderRadius: { xs: 0, md: 3 },
                boxShadow: { xs: 'none', md: '0 8px 32px rgba(0, 0, 0, 0.1)' },
                bgcolor: 'white',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography variant="h5" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '1.4rem', md: '1.75rem' }, mb: 2 }}>
                  {selectedProperty.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <LocationOn 
                    sx={{ 
                      color: 'primary.main', 
                      fontSize: { xs: 20, md: 24 },
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.dark' }
                    }} 
                    onClick={() => {
                      // Check if property has coordinates
                      if (selectedProperty.coordinates?.latitude && selectedProperty.coordinates?.longitude) {
                        const url = `https://maps.google.com/?q=${selectedProperty.coordinates.latitude},${selectedProperty.coordinates.longitude}`;
                        window.open(url, '_blank');
                      } else if (selectedProperty.address) {
                        // Fallback to address search
                        const url = `https://maps.google.com/?q=${encodeURIComponent(selectedProperty.address)}`;
                        window.open(url, '_blank');
                      } else {
                        // Fallback to city search
                        const url = `https://maps.google.com/?q=${encodeURIComponent(selectedProperty.city?.name || 'Location')}`;
                        window.open(url, '_blank');
                      }
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666', 
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.main', textDecoration: 'underline' }
                    }}
                    onClick={() => {
                      // Same logic as location icon
                      if (selectedProperty.coordinates?.latitude && selectedProperty.coordinates?.longitude) {
                        const url = `https://maps.google.com/?q=${selectedProperty.coordinates.latitude},${selectedProperty.coordinates.longitude}`;
                        window.open(url, '_blank');
                      } else if (selectedProperty.address) {
                        const url = `https://maps.google.com/?q=${encodeURIComponent(selectedProperty.address)}`;
                        window.open(url, '_blank');
                      } else {
                        const url = `https://maps.google.com/?q=${encodeURIComponent(selectedProperty.city?.name || 'Location')}`;
                        window.open(url, '_blank');
                      }
                    }}
                  >
                    {selectedProperty.address || `${selectedProperty.city?.name || 'Location'}`}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  {/* Show all categories from categories array */}
                  {(selectedProperty.categories && selectedProperty.categories.length > 0 
                    ? selectedProperty.categories 
                    : [selectedProperty.category || 'Residential']
                  ).map((cat, idx) => (
                    <Chip
                      key={idx}
                      label={cat}
                      size="small"
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                      }}
                    />
                  ))}
                  {selectedProperty.facilities?.slice(0, 2).map((facility, idx) => (
                    <Chip
                      key={idx}
                      label={facility}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                      }}
                    />
                  ))}
                  <Chip
                    label={`${plots?.length || 0} Plots`}
                    size="small"
                    sx={{ 
                      bgcolor: 'secondary.main',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                    }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, mb: 1.5 }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: { xs: '0.875rem', md: '1rem' }, mb: 3, lineHeight: 1.7 }}>
                  {selectedProperty.description || selectedProperty.tagline || 'Premium property with modern amenities and excellent location.'}
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Plots Section */}
                {plots && plots.length > 0 && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, mb: 2 }}>
                      Available Plots ({plots.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: { md: 400 }, overflowY: 'auto' }}>
                      {plots.map((plot) => (
                        <Paper
                          key={plot._id}
                          onClick={() => navigate(`/plots/${plot._id}`)}
                          elevation={0}
                          sx={{
                            p: 2,
                            border: '2px solid',
                            borderColor: '#e0e0e0',
                            borderRadius: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            '&:hover': {
                              bgcolor: 'rgba(65, 152, 10, 0.04)',
                              borderColor: 'primary.main',
                              transform: 'translateX(4px)',
                              boxShadow: '0 4px 12px rgba(65, 152, 10, 0.15)',
                            }
                          }}
                        >
                          <Box>
                            <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                              Plot #{plot.plotNumber}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                              {plot.area.toFixed(3)} Sq.Ft • ₹{plot.totalPrice?.toLocaleString()}
                            </Typography>
                          </Box>
                          <Chip
                            label={plot.status}
                            size="small"
                            sx={{
                              bgcolor: plot.status === 'available' ? '#4CAF50' : '#757575',
                              color: 'white',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              fontSize: { xs: '0.7rem', md: '0.75rem' },
                            }}
                          />
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* No Plots Message */}
                {(!plots || plots.length === 0) && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Landscape sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                      No plots available for this property
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default PropertyDetails
