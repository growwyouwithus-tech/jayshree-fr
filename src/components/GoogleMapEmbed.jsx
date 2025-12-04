import { Box, Card, CardContent, Typography, Button } from '@mui/material'
import { Directions, OpenInNew } from '@mui/icons-material'

const GoogleMapEmbed = ({ location, name }) => {
  if (!location) return null

  // Generate Google Maps URLs
  const { latitude, longitude, address, city, state } = location
  
  // Embed URL for iframe
  const embedUrl = latitude && longitude
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${latitude},${longitude}&zoom=15`
    : `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(`${address}, ${city}, ${state}`)}`

  // Direct link to open in Google Maps
  const mapsUrl = latitude && longitude
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${city}, ${state}`)}`

  // Directions URL
  const directionsUrl = latitude && longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${address}, ${city}, ${state}`)}`

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Location
        </Typography>
        
        {/* Map Embed */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 300,
            borderRadius: 2,
            overflow: 'hidden',
            mb: 2,
          }}
        >
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={embedUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${name}`}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Directions />}
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ flex: 1 }}
          >
            Get Directions
          </Button>
          <Button
            variant="outlined"
            startIcon={<OpenInNew />}
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ flex: 1 }}
          >
            Open in Maps
          </Button>
        </Box>

        {/* Address Display */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Address:</strong> {address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>City:</strong> {city}, {state} - {location.pincode}
          </Typography>
          {latitude && longitude && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              <strong>Coordinates:</strong> {latitude}, {longitude}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default GoogleMapEmbed
