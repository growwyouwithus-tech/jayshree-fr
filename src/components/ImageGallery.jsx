import { useState } from 'react'
import { Box, Dialog, IconButton, Card, CardMedia } from '@mui/material'
import { Close, ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Zoom } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/zoom'

const ImageGallery = ({ images, title }) => {
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleOpen = (index) => {
    setSelectedIndex(index)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (!images || images.length === 0) {
    return null
  }

  return (
    <>
      {/* Main Image */}
      <Card sx={{ mb: 3, cursor: 'pointer' }} onClick={() => handleOpen(0)}>
        <CardMedia
          component="img"
          height="400"
          image={images[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'}
          alt={title}
          sx={{ objectFit: 'cover' }}
        />
      </Card>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <Box sx={{ mb: 3 }}>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={2}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <CardMedia
                  component="img"
                  height="120"
                  image={image.url}
                  alt={image.caption || `${title} - Image ${index + 1}`}
                  sx={{
                    objectFit: 'cover',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  onClick={() => handleOpen(index)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}

      {/* Fullscreen Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0, 0, 0, 0.95)',
            boxShadow: 'none',
          },
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <Close />
        </IconButton>

        <Box sx={{ position: 'relative', height: '90vh' }}>
          <Swiper
            modules={[Navigation, Pagination, Zoom]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            pagination={{ clickable: true }}
            zoom={true}
            initialSlide={selectedIndex}
            style={{ height: '100%' }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="swiper-zoom-container">
                  <img
                    src={image.url}
                    alt={image.caption || `${title} - Image ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <IconButton
            className="swiper-button-prev-custom"
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              zIndex: 10,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <ChevronLeft fontSize="large" />
          </IconButton>
          <IconButton
            className="swiper-button-next-custom"
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              zIndex: 10,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <ChevronRight fontSize="large" />
          </IconButton>
        </Box>
      </Dialog>
    </>
  )
}

export default ImageGallery
