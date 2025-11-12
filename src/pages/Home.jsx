import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material'
import {
  TrendingUp,
  Verified,
  LocalOffer,
  ArrowForward,
  LocationOn,
  Home as HomeIcon,
} from '@mui/icons-material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { fetchColonies } from '../store/slices/colonySlice'

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { colonies, loading } = useSelector((state) => state.colony)
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchColonies())
  }, [dispatch, isAuthenticated]) // Re-fetch when auth status changes

  // Debug logging
  useEffect(() => {
    console.log('🏠 Home: Colonies data updated:', {
      count: colonies.length,
      isAuthenticated,
      colonies: colonies.map(c => ({ name: c.name, images: c.mapImages?.length || 0 }))
    })
  }, [colonies, isAuthenticated])

  const featuredColonies = colonies.slice(0, 6) // Show more properties in slider

  const handlePropertyClick = (colony) => {
    navigate(`/colonies/${colony._id}`)
  }

  const handleRefreshData = () => {
    console.log('🔄 Manually refreshing colonies data...')
    dispatch(fetchColonies())
  }

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Auto-Scroll Property Slider */}
      <Box sx={{ height: 250, position: 'relative' }}>
        {loading ? (
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: '#f0f0f0'
          }}>
            <CircularProgress />
          </Box>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            style={{ height: '100%' }}
          >
            {featuredColonies.map((colony, index) => (
              <SwiperSlide key={colony._id || index}>
                <Box
                  onClick={() => handlePropertyClick(colony)}
                  sx={{
                    height: '100%',
                    backgroundImage: `url(${colony.mapImages?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
                    }
                  }}
                >
                  {/* Property Info Overlay */}
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: 20, 
                    left: 20, 
                    right: 20, 
                    zIndex: 1,
                    color: 'white'
                  }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                      {colony.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">
                        {colony.location?.city}, {colony.location?.state}
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      ₹{colony.basePricePerGaj?.toLocaleString()}/gaj
                    </Typography>
                  </Box>
                  
                  {/* Location Icon */}
                  <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
                    <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}>
                      <LocationOn sx={{ color: '#6200EA' }} />
                    </IconButton>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>


      {/* Debug Info Section */}
      <Box sx={{ bgcolor: '#f0f0f0', px: 2, py: 1, borderBottom: '1px solid #ddd' }}>
        <Typography variant="caption" sx={{ color: '#666' }}>
          Debug: {colonies.length} colonies loaded | Auth: {isAuthenticated ? '✅' : '❌'} | 
          <Button size="small" onClick={handleRefreshData} sx={{ ml: 1, minWidth: 'auto', p: 0.5 }}>
            🔄 Refresh
          </Button>
        </Typography>
      </Box>

      {/* All Properties Section - Mobile */}
      <Box sx={{ bgcolor: 'white', px: 2, py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.1rem' }}>
            All Properties ({colonies.length} total)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={() => navigate('/test-connection')}
              variant="outlined"
              size="small"
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                fontSize: '0.8rem',
                color: '#FF5722',
                borderColor: '#FF5722'
              }}
            >
              Test API
            </Button>
            <Button
              onClick={() => navigate('/colonies')}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#6200EA'
              }}
            >
              See All
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {featuredColonies.map((colony) => (
              <Card
                key={colony._id}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease'
                  }
                }}
                onClick={() => handlePropertyClick(colony)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={colony.mapImages?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'}
                    alt={colony.name}
                    sx={{
                      objectFit: 'cover',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.3s ease'
                      }
                    }}
                  />
                  {/* Status Badge */}
                  <Chip
                    label={colony.status === 'ready_to_sell' ? 'Ready to Sell' : 'Available'}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: '#4CAF50',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body1" fontWeight={600} gutterBottom noWrap>
                    {colony.name || 'live longer live happy'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                    <LocationOn sx={{ fontSize: 16, color: '#666' }} />
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.8rem' }} noWrap>
                      {colony.location?.address || 'Premium Location'} {'>'} {colony.location?.city || 'City'} {'>'} {colony.location?.state || 'State'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1.5 }}>
                    <Chip
                      label="Residential"
                      size="small"
                      variant="outlined"
                      sx={{ 
                        height: 24, 
                        fontSize: '0.7rem',
                        borderRadius: 5,
                        borderColor: '#999'
                      }}
                    />
                    <Chip
                      label={`Completed: ${colony.soldPlots || 1}`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        height: 24, 
                        fontSize: '0.7rem',
                        borderRadius: 5,
                        borderColor: '#999'
                      }}
                    />
                    <Chip
                      label={`Amenities: ${colony.amenities?.length || 1}`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        height: 24, 
                        fontSize: '0.7rem',
                        borderRadius: 5,
                        borderColor: '#999'
                      }}
                    />
                    <Chip
                      label={`Facilities: ${colony.facilities?.length || 1}`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        height: 24, 
                        fontSize: '0.7rem',
                        borderRadius: 5,
                        borderColor: '#999'
                      }}
                    />
                  </Box>
                  
                  {/* Price Information */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#6200EA', fontSize: '1rem' }}>
                        ₹{colony.basePricePerGaj?.toLocaleString() || '5,000'}/gaj
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {colony.availablePlots || 0} plots available
                      </Typography>
                    </Box>
                    <Chip
                      icon={<TrendingUp sx={{ fontSize: 14 }} />}
                      label="Hot Deal"
                      size="small"
                      sx={{
                        bgcolor: '#FF5722',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowForward sx={{ fontSize: 18 }} />}
                    sx={{
                      bgcolor: '#6200EA',
                      borderRadius: 2,
                      py: 1,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#5200CA',
                      }
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Home
