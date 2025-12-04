import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Grid,
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList,
  Close,
  LocationOn,
  ArrowForward,
  ExpandMore,
  TrendingUp,
} from '@mui/icons-material'
import { colonyService, cityService } from '../services/api.service'
import toast from 'react-hot-toast'

const Search = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [colonies, setColonies] = useState([])
  const [filteredColonies, setFilteredColonies] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Filters
  const [filters, setFilters] = useState({
    city: '',
    minPrice: 0,
    maxPrice: 100000,
    status: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, filters, colonies])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [coloniesData, citiesData] = await Promise.all([
        colonyService.getAll(),
        cityService.getAll()
      ])
      setColonies(coloniesData || [])
      setFilteredColonies(coloniesData || [])
      setCities(citiesData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
      // Set empty arrays on error to prevent undefined errors
      setColonies([])
      setFilteredColonies([])
      setCities([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...colonies]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(colony =>
        colony.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        colony.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        colony.location?.address?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(colony => 
        colony.location?.city === filters.city
      )
    }

    // Price filter
    filtered = filtered.filter(colony => {
      const price = colony.basePricePerGaj || 0
      return price >= filters.minPrice && price <= filters.maxPrice
    })

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(colony => colony.status === filters.status)
    }

    setFilteredColonies(filtered)
  }

  const handleClearFilters = () => {
    setFilters({
      city: '',
      minPrice: 0,
      maxPrice: 100000,
      status: '',
    })
    setSearchTerm('')
  }

  const handlePropertyClick = (colony) => {
    navigate(`/colonies/${colony._id}`)
  }

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pb: 2 }}>
      <Container maxWidth="sm" sx={{ pt: 2 }}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search by name, city, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'primary.main' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <Close />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { border: 'none' },
            },
          }}
        />

        {/* Filters */}
        <Accordion sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList sx={{ color: 'primary.main' }} />
              <Typography fontWeight={600}>Filters</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* City Filter */}
              <FormControl fullWidth size="small">
                <InputLabel>City</InputLabel>
                <Select
                  value={filters.city}
                  label="City"
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                >
                  <MenuItem value="">All Cities</MenuItem>
                  {cities && cities.length > 0 ? (
                    cities.map((city) => (
                      <MenuItem key={city._id} value={city.name}>
                        {city.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No cities available</MenuItem>
                  )}
                </Select>
              </FormControl>

              {/* Price Range */}
              <Box>
                <Typography variant="body2" gutterBottom>
                  Price Range (₹/gaj): {filters.minPrice.toLocaleString()} - {filters.maxPrice.toLocaleString()}
                </Typography>
                <Slider
                  value={[filters.minPrice, filters.maxPrice]}
                  onChange={(e, newValue) => 
                    setFilters({ ...filters, minPrice: newValue[0], maxPrice: newValue[1] })
                  }
                  valueLabelDisplay="auto"
                  min={0}
                  max={100000}
                  step={1000}
                  sx={{ color: 'primary.main' }}
                />
              </Box>

              {/* Status Filter */}
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="ready_to_sell">Ready to Sell</MenuItem>
                  <MenuItem value="under_development">Under Development</MenuItem>
                  <MenuItem value="sold_out">Sold Out</MenuItem>
                </Select>
              </FormControl>

              {/* Clear Filters */}
              <Button
                variant="outlined"
                fullWidth
                onClick={handleClearFilters}
                sx={{ borderColor: 'primary.main', color: 'primary.main' }}
              >
                Clear All Filters
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Results Count */}
        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {filteredColonies.length} properties found
          </Typography>
        </Box>

        {/* Results */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredColonies.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No properties found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredColonies.map((colony) => (
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
                  />
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
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body1" fontWeight={600} gutterBottom noWrap>
                    {colony.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                    <LocationOn sx={{ fontSize: 16, color: '#666' }} />
                    <Typography variant="caption" sx={{ color: '#666' }} noWrap>
                      {colony.location?.city}, {colony.location?.state}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700} sx={{ color: 'primary.main' }}>
                        ₹{colony.basePricePerGaj?.toLocaleString()}/gaj
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {colony.availablePlots || 0} plots available
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<ArrowForward />}
                      sx={{
                        bgcolor: 'primary.main',
                        textTransform: 'none',
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Search
