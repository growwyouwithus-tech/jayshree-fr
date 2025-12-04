import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Header from '../Header'
import BottomNav from '../BottomNav'

const MainLayout = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      maxWidth: '100vw',
      overflow: 'hidden'
    }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', pb: 7 }}>
        <Outlet />
      </Box>
      <BottomNav />
    </Box>
  )
}

export default MainLayout
