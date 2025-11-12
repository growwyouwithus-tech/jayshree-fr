// Demo data for testing without backend

export const demoColonies = [
  {
    _id: 'colony1',
    name: 'live longer live happy',
    description: 'serklj hgkhkjfjksdkjhg',
    location: {
      city: 'Agra',
      state: 'Uttar Pradesh',
      address: 'vikas nagar, Awas Vikas',
      coordinates: { lat: 27.1767, lng: 78.0081 }
    },
    basePricePerGaj: 5000,
    totalPlots: 100,
    availablePlots: 45,
    bookedPlots: 30,
    soldPlots: 25,
    totalLandAreaGaj: 5000,
    amenities: ['Water Supply', 'Electricity', 'Street Lights'],
    facilities: ['Park', 'Temple'],
    status: 'ready_to_sell',
    layoutUrl: '',
    mapImages: [
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', caption: 'Demo Colony View' },
      { url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop', caption: 'Demo Amenities' }
    ],
  },
  {
    _id: 'colony2',
    name: 'Green Valley Residency',
    description: 'Premium residential colony with modern amenities',
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Andheri West',
      coordinates: { lat: 19.1136, lng: 72.8697 }
    },
    basePricePerGaj: 12000,
    totalPlots: 80,
    availablePlots: 20,
    bookedPlots: 40,
    soldPlots: 20,
    totalLandAreaGaj: 4000,
    amenities: ['Water Supply', 'Electricity', 'Security', 'Playground'],
    facilities: ['Community Hall', 'Shopping Complex'],
    status: 'selling',
    layoutUrl: '',
    mapImages: [
      { url: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&h=600&fit=crop', caption: 'Green Valley View' },
      { url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop', caption: 'Modern Amenities' }
    ],
  },
  {
    _id: 'colony3',
    name: 'Sunrise Heights',
    description: 'Luxury plots with excellent connectivity',
    location: {
      city: 'Delhi',
      state: 'Delhi',
      address: 'Dwarka Sector 12',
      coordinates: { lat: 28.5921, lng: 77.0460 }
    },
    basePricePerGaj: 15000,
    totalPlots: 60,
    availablePlots: 15,
    bookedPlots: 25,
    soldPlots: 20,
    totalLandAreaGaj: 3000,
    amenities: ['Water Supply', 'Electricity', 'Sewage', 'Park'],
    facilities: ['School Nearby', 'Hospital Nearby'],
    status: 'ready_to_sell',
    layoutUrl: '',
    mapImages: [
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', caption: 'Sunrise Heights View' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop', caption: 'Luxury Features' }
    ],
  },
]

export const demoPlots = [
  {
    _id: 'plot1',
    colonyId: { _id: 'colony1', name: 'live longer live happy' },
    plotNo: '25',
    plotType: 'Residential',
    sideMeasurements: {
      front: 25,
      back: 25,
      left: 65,
      right: 65,
    },
    adjacentTo: {
      front: 'Road 1',
      back: 'Plot 26',
      left: 'Plot 24',
      right: 'Park',
    },
    areaGaj: 180.56,
    areaSqFt: 1625,
    pricePerGaj: 5000,
    totalPrice: 902800,
    facing: 'North',
    cornerPlot: false,
    roadFacing: true,
    status: 'available',
    coordinates: [[0, 0]],
    features: ['Corner Plot', 'Park View'],
  },
  {
    _id: 'plot2',
    colonyId: { _id: 'colony1', name: 'live longer live happy' },
    plotNo: '26',
    plotType: 'Residential',
    sideMeasurements: {
      front: 30,
      back: 30,
      left: 50,
      right: 50,
    },
    adjacentTo: {
      front: 'Road 1',
      back: 'Plot 27',
      left: 'Plot 25',
      right: 'Plot 28',
    },
    areaGaj: 166.67,
    areaSqFt: 1500,
    pricePerGaj: 5000,
    totalPrice: 833350,
    facing: 'East',
    cornerPlot: false,
    roadFacing: true,
    status: 'available',
    coordinates: [[0, 0]],
    features: ['Road Facing'],
  },
  {
    _id: 'plot3',
    colonyId: { _id: 'colony2', name: 'Green Valley Residency' },
    plotNo: '10',
    plotType: 'Residential',
    sideMeasurements: {
      front: 40,
      back: 40,
      left: 60,
      right: 60,
    },
    adjacentTo: {
      front: 'Main Road',
      back: 'Plot 11',
      left: 'Plot 9',
      right: 'Park',
    },
    areaGaj: 266.67,
    areaSqFt: 2400,
    pricePerGaj: 12000,
    totalPrice: 3200040,
    facing: 'South',
    cornerPlot: true,
    roadFacing: true,
    status: 'available',
    coordinates: [[0, 0]],
    features: ['Corner Plot', 'Park View', 'Main Road Facing'],
  },
]

export const demoBookings = []
