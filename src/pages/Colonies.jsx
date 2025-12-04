import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  TextField,
  MenuItem,
  CircularProgress,
  Button,
  InputAdornment,
  Skeleton,
  IconButton,
  Slider,
  Collapse,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Search, LocationOn, ArrowForward, FilterList, Refresh, TuneOutlined } from '@mui/icons-material'
import { fetchProperties } from '../store/slices/propertySlice'
import toast from 'react-hot-toast'

const Colonies = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { properties, loading } = useSelector((state) => state.property)
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [refreshing, setRefreshing] = useState(false)

  // Get API URL for images
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_URL.replace('/api/v1', '')}${path}`
  }

  useEffect(() => {
    dispatch(fetchProperties())
  }, [dispatch, isAuthenticated])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await dispatch(fetchProperties()).unwrap()
      toast.success('Data refreshed')
    } catch (error) {
      toast.error('Failed to refresh')
    } finally {
      setRefreshing(false)
    }
  }

  // Debug logging
  useEffect(() => {
    console.log('🏘️ Properties Page: Data updated:', {
      count: Array.isArray(properties) ? properties.length : 0,
      isAuthenticated,
      properties: Array.isArray(properties) ? properties.map(p => ({ 
        name: p.name, 
        images: p.media?.moreImages?.length || 0,
        price: p.basePricePerGaj 
      })) : []
    })
  }, [properties, isAuthenticated])

  // Ensure properties is always an array
  const propertiesArray = Array.isArray(properties) ? properties : []

  const filteredProperties = propertiesArray
    .filter((property) => {
      const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter
      const matchesPrice = !property.basePricePerGaj || (property.basePricePerGaj >= priceRange[0] && property.basePricePerGaj <= priceRange[1])
      return matchesSearch && matchesStatus && matchesPrice
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'price_low') return (a.basePricePerGaj || 0) - (b.basePricePerGaj || 0)
      if (sortBy === 'price_high') return (b.basePricePerGaj || 0) - (a.basePricePerGaj || 0)
      if (sortBy === 'available') return (b.totalLandAreaGaj || 0) - (a.totalLandAreaGaj || 0)
      if (sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt)
      return 0
    })

  // Skeleton loader component
  const ColonySkeleton = () => (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <Skeleton variant="rectangular" height={180} />
        <CardContent>
          <Skeleton variant="text" height={32} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 1 }} />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  )

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Browse Properties
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explore our premium properties across prime locations
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
        <Card sx={{ mb: 4, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="ready_to_sell">Ready to Sell</MenuItem>
                <MenuItem value="selling">Selling</MenuItem>
                <MenuItem value="under_development">Under Development</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name (A-Z)</MenuItem>
                <MenuItem value="price_low">Price (Low to High)</MenuItem>
                <MenuItem value="price_high">Price (High to Low)</MenuItem>
                <MenuItem value="available">Most Available</MenuItem>
                <MenuItem value="latest">Latest Added</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<TuneOutlined />}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                Filters
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                <FilterList />
                <Typography variant="body2" color="text.secondary">
                  {filteredProperties.length} Results
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {/* Advanced Filters */}
          <Collapse in={showAdvancedFilters}>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Price Range (₹/Gaj)
              </Typography>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={50000}
                step={500}
                marks={[
                  { value: 0, label: '₹0' },
                  { value: 10000, label: '₹10K' },
                  { value: 25000, label: '₹25K' },
                  { value: 50000, label: '₹50K' },
                ]}
              />
            </Box>
          </Collapse>
        </Card>

        {/* Colony Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ColonySkeleton key={i} />
            ))}
          </Grid>
        ) : filteredProperties.length === 0 ? (
          <Card sx={{ p: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No properties found matching your criteria
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredProperties.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                  onClick={() => navigate(`/properties/${property._id}`)}
                >
                  <CardMedia
                    component="img"
                    height={isMobile ? "180" : "200"}
                    image={getImageUrl(property.media?.mainPicture) || getImageUrl(property.media?.moreImages?.[0]) || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'}
                    alt={property.name}
                    sx={{ 
                      objectFit: 'cover',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.3s ease'
                      }
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
                      {property.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {property.address || property.city?.name || 'Location'}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {property.description || property.tagline || 'Premium property with modern amenities'}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip
                        label={`₹${property.basePricePerGaj?.toLocaleString()}/Gaj`}
                        size="small"
                        color="primary"
                        variant="filled"
                      />
                      {property.totalLandAreaGaj > 0 && (
                        <Chip
                          label={`${property.totalLandAreaGaj?.toLocaleString()} Gaj`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                      {property.amenities?.slice(0, 3).map((amenity, idx) => (
                        <Chip
                          key={idx}
                          label={amenity}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {property.amenities?.length > 3 && (
                        <Chip
                          label={`+${property.amenities.length - 3}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>

                    <Button
                      variant="outlined"
                      fullWidth
                      endIcon={<ArrowForward />}
                      size="small"
                    >
                      View Details
                    </Button>
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

export default Colonies
