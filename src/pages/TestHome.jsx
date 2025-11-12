import { Box, Typography, Button } from '@mui/material'
import { Home as HomeIcon } from '@mui/icons-material'

const TestHome = () => {
  return (
    <Box sx={{ p: 3, bgcolor: '#F5F5F5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Test Home Page
      </Typography>
      <Typography variant="body1" gutterBottom>
        If you can see this, the app is working!
      </Typography>
      <Button variant="contained" startIcon={<HomeIcon />}>
        Test Button
      </Button>
    </Box>
  )
}

export default TestHome
