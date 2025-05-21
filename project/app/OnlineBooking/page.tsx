'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Typography, 
  TextField,
  Grid,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Autocomplete,
  Card,
  CardMedia,
  CardContent,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { reservationService } from '@/app/services/reservationService';
import { packageTypeService } from '@/app/services/packageTypeService';
import { currencyService } from '../services/currencyService';
import { Room, PackageType } from '@/types/reservationtypes';
import { format } from 'date-fns';
import PaymentModal from '@/components/PaymentModal';

const steps = ['Select Dates', 'Choose Room', 'Reservation Details', 'Review Invoice', 'Guest Details', 'Payment'];

const CheckInComponent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [nationality, setNationality] = useState<'Local' | 'Foreigner'>('Local');
  const [customerData, setCustomerData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
    Country: 'Sri Lanka',
    Nic: '',
    Passport: ''
  });
  const [reservationData, setReservationData] = useState({
    PackageID: '',
    Adults: 1, // Initialize with default value
    Children: 0,
    SpecialRequests: '',
    ArrivalTime: '14:00',
    DepartureTime: '12:00'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ 
    open: boolean; 
    message: string; 
    severity: 'success' | 'error' 
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const roomVisuals: Record<string, { image: string; description: string }> = {
    '101': { 
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32',
      description: 'Cozy single room with modern amenities and a beautiful view.'
    },
    '102': { 
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      description: 'Spacious double room with a private balcony.'
    },
    '103': { 
      image: 'https://images.unsplash.com/photo-1578683014728-c73504a258f9',
      description: 'Luxurious suite with premium furnishings.'
    }
  };

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
    'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
    'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei',
    'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile',
    'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo',
    'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor',
    'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea',
    'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland',
    'France', 'Gabon', 'Gambia', 'Georgia', 'Germany',
    'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
    'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
    'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan',
    'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
    'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho',
    'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali',
    'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
    'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
    'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
    'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger',
    'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
    'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea',
    'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis',
    'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
    'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone',
    'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
    'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka',
    'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo',
    'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
    'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
    'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
    'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  const getMinCheckInDate = (): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0];
  };

  const getMinCheckOutDate = (checkInDate: string): string => {
    if (!checkInDate) return '';
    const nextDay = new Date(checkInDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
  };

  const validationRules = {
    // Only letters and spaces
    name: /^[A-Za-z\s]+$/,
    // Standard email format
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    // Only numbers and standard phone formatting characters
    phone: /^[0-9+\-\s]+$/,
    // Only letters, numbers, and spaces for passport
    passport: /^[A-Z0-9\s]+$/,
    // Only numbers and 'V' for NIC
    nic: /^[0-9]+[Vv]?$/,
    // Only letters and basic punctuation for special requests
    specialRequests: /^[A-Za-z0-9\s.,!?()-]+$/
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (activeStep === 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkInDate = checkIn ? new Date(checkIn) : null;
      const checkOutDate = checkOut ? new Date(checkOut) : null;

      if (!checkIn) {
        newErrors.checkIn = 'Check-in date is required';
      } else if (checkInDate && checkInDate < today) {
        newErrors.checkIn = 'Check-in date cannot be in the past';
      }

      if (!checkOut) {
        newErrors.checkOut = 'Check-out date is required';
      } else if (checkInDate && checkOutDate && checkOutDate <= checkInDate) {
        newErrors.checkOut = 'Check-out date must be after check-in date';
      }
    } else if (activeStep === 4) {
      // Updated guest information validation
      if (!customerData.FirstName.trim()) {
        newErrors.FirstName = 'First name is required';
      } else if (!validationRules.name.test(customerData.FirstName)) {
        newErrors.FirstName = 'First name can only contain letters';
      }

      if (!customerData.LastName.trim()) {
        newErrors.LastName = 'Last name is required';
      } else if (!validationRules.name.test(customerData.LastName)) {
        newErrors.LastName = 'Last name can only contain letters';
      }

      if (!customerData.Email.trim()) {
        newErrors.Email = 'Email is required';
      } else if (!validationRules.email.test(customerData.Email)) {
        newErrors.Email = 'Invalid email format';
      }

      if (!customerData.Phone.trim()) {
        newErrors.Phone = 'Phone number is required';
      } else if (!validationRules.phone.test(customerData.Phone)) {
        newErrors.Phone = 'Phone number can only contain numbers and + - characters';
      }

      if (nationality === 'Local') {
        if (!customerData.Nic.trim()) {
          newErrors.Nic = 'NIC is required';
        } else if (!validationRules.nic.test(customerData.Nic)) {
          newErrors.Nic = 'NIC can only contain numbers and V';
        }
      } else {
        if (!customerData.Passport.trim()) {
          newErrors.Passport = 'Passport number is required';
        } else if (!validationRules.passport.test(customerData.Passport)) {
          newErrors.Passport = 'Invalid passport format';
        }
      }
    } else if (activeStep === 2) {
      // Reservation details validation
      if (reservationData.Adults < 1) {
        newErrors.adults = 'At least one adult is required';
      }
      if (reservationData.Children < 0) {
        newErrors.children = 'Number of children cannot be negative';
      }
      if (selectedRoom && (reservationData.Adults + reservationData.Children) > selectedRoom.MaxPeople) {
        newErrors.adults = `Total guests cannot exceed ${selectedRoom.MaxPeople}`;
      }
      if (reservationData.SpecialRequests && !validationRules.specialRequests.test(reservationData.SpecialRequests)) {
        newErrors.SpecialRequests = 'Special requests can only contain letters, numbers, and basic punctuation';
      }
      if (!reservationData.ArrivalTime) {
        newErrors.ArrivalTime = 'Arrival time is required';
      }
      if (!reservationData.DepartureTime) {
        newErrors.DepartureTime = 'Departure time is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setCustomerData({
      ...customerData,
      Country: nationality === 'Local' ? 'Sri Lanka' : customerData.Country || '',
      Nic: nationality === 'Local' ? customerData.Nic : '',
      Passport: nationality === 'Foreigner' ? customerData.Passport : ''
    });
  }, [nationality]);

  const handleSearchRooms = async () => {
    if (!validateStep()) return;
    setLoading(true);
    try {
      const availableRooms = await reservationService.checkAvailability(
        format(checkIn!, 'yyyy-MM-dd'),
        format(checkOut!, 'yyyy-MM-dd')
      );
      setRooms(availableRooms as Room[]);
      setActiveStep(1);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch available rooms. Please try again.',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (nationality === 'Foreigner') {
        try {
          const rate = await currencyService.getUSDToLKRRate();
          setExchangeRate(rate);
        } catch (error) {
          console.error('Error fetching exchange rate:', error);
          setSnackbar({
            open: true,
            message: 'Failed to fetch exchange rate. Please try again.',
            severity: 'error'
          });
        }
      }
    };

    fetchExchangeRate();
  }, [nationality]);

  const calculateTotalAmount = () => {
    if (!selectedRoom) return null;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const numberOfNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
    const pricePerNight = nationality === 'Local' ? selectedRoom.LocalPrice : selectedRoom.ForeignPrice;
    const baseRoomPrice = pricePerNight * numberOfNights;

    const selectedPackage = packageTypes.find(pkg => pkg.PackageID === reservationData.PackageID);
    const packageMultiplier = selectedPackage?.PriceMultiplier || 1;
    const adjustedRoomPrice = baseRoomPrice * packageMultiplier;

    const serviceCharge = adjustedRoomPrice * 0.10;
    const vat = adjustedRoomPrice * 0.18;
    const totalPrice = adjustedRoomPrice + serviceCharge + vat;

    // Convert to LKR if foreigner
    const totalPriceLKR = nationality === 'Foreigner' && exchangeRate 
      ? totalPrice * exchangeRate 
      : totalPrice;

    return {
      baseRoomPrice,
      adjustedRoomPrice,
      serviceCharge,
      vat,
      totalPrice,
      totalPriceLKR,
      numberOfNights,
      currency: nationality === 'Local' ? 'LKR' : 'USD',
      currencyLKR: 'LKR',
      packageName: selectedPackage?.Name || 'Room Only',
      exchangeRate: exchangeRate || 1
    };
  };

  const handleSubmitReservation = async () => {
    if (!validateStep()) {
      setSnackbar({
        open: true,
        message: 'Please correct the errors in the form before submitting.',
        severity: 'error'
      });
      return;
    }
    setLoading(true);
    try {
      if (!selectedRoom || !checkIn || !checkOut) {
        throw new Error('Missing required reservation data');
      }
      const invoice = calculateTotalAmount();
      if (!invoice) {
        throw new Error('Unable to calculate total amount');
      }

      const reservationPayload = {
        roomNumber: selectedRoom.RoomNumber,
        customer: customerData,
        reservationData: {
          CheckInDate: format(checkIn, 'yyyy-MM-dd'),
          CheckOutDate: format(checkOut, 'yyyy-MM-dd'),
          TotalAmount: invoice.totalPriceLKR, // Using LKR amount
          PackageID: reservationData.PackageID,
          Adults: reservationData.Adults,
          Children: reservationData.Children,
          SpecialRequests: reservationData.SpecialRequests,
          ArrivalTime: reservationData.ArrivalTime,
          DepartureTime: reservationData.DepartureTime,
          Currency: 'LKR', // Always store in LKR
          OriginalCurrency: nationality === 'Local' ? 'LKR' : 'USD',
          OriginalAmount: invoice.totalPrice, // Store original amount before conversion
          ExchangeRate: invoice.exchangeRate // Store exchange rate used
        }
      };

      console.log('Submitting reservation:', reservationPayload);

      const response = await reservationService.createWebReservation(
        reservationPayload.roomNumber,
        reservationPayload.customer,
        reservationPayload.reservationData
      );

      console.log('Reservation response:', response);

      setSnackbar({
        open: true,
        message: 'Reservation created successfully!',
        severity: 'success'
      });
      setActiveStep(6);
    } catch (error: any) {
      console.error('Error creating reservation:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      setSnackbar({
        open: true,
        message: `Failed to create reservation: ${errorMessage}`,
        severity: 'error'
      });
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    } else {
      setSnackbar({
        open: true,
        message: 'Please correct the errors before proceeding.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchPackageTypes = async () => {
      try {
        setPackagesLoading(true);
        const types = await packageTypeService.getAllPackageTypes();
        console.log('Fetched package types:', types);
        setPackageTypes(types);
        // Set default package ID
        if (types && types.length > 0) {
          setReservationData(prev => ({
            ...prev,
            PackageID: types[0].PackageID
          }));
        }
      } catch (error) {
        console.error('Error fetching package types:', error);
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchPackageTypes();
  }, []);

  const invoice = calculateTotalAmount();

  return (
    <Box sx={{ 
      maxWidth: 900, 
      margin: 'auto', 
      p: 4, 
      bgcolor: '#1a472a',
      borderRadius: 2,
      color: '#ffffff'
    }}>
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel 
        sx={{ 
          mb: 4, 
          '& .MuiStepLabel-label': { color: '#ffffff' },
          '& .MuiStepIcon-root': { color: '#4caf50' },
          '& .MuiStepConnector-line': { borderColor: '#4caf50' }
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            Select Your Stay Dates
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Check-in Date"
              value={checkIn}
              onChange={(date: Date | null) => setCheckIn(date)}
              minDate={new Date()}
              maxDate={new Date('2025-12-31')}
              slotProps={{
                textField: {
                  error: !!errors.checkIn,
                  helperText: errors.checkIn,
                  sx: {
                    bgcolor: '#ffffff',
                    borderRadius: 1
                  }
                }
              }}
            />
            <DatePicker
              label="Check-out Date"
              value={checkOut}
              onChange={(date: Date | null) => setCheckOut(date)}
              minDate={checkIn ? new Date(checkIn.getTime() + 24 * 60 * 60 * 1000) : new Date()}
              maxDate={new Date('2025-12-31')}
              slotProps={{
                textField: {
                  error: !!errors.checkOut,
                  helperText: errors.checkOut,
                  sx: {
                    bgcolor: '#ffffff',
                    borderRadius: 1
                  }
                }
              }}
            />
          </LocalizationProvider>
          <FormControl>
            <FormLabel sx={{ color: '#ffffff', mb: 1 }}>Nationality</FormLabel>
            <RadioGroup
              row
              value={nationality}
              onChange={(e) => setNationality(e.target.value as 'Local' | 'Foreigner')}
            >
              <FormControlLabel 
                value="Local" 
                control={<Radio sx={{ color: '#4caf50' }} />} 
                label="Local" 
                sx={{ color: '#ffffff' }}
              />
              <FormControlLabel 
                value="Foreigner" 
                control={<Radio sx={{ color: '#4caf50' }} />} 
                label="Foreigner" 
                sx={{ color: '#ffffff' }}
              />
            </RadioGroup>
          </FormControl>
          <Button 
            variant="contained" 
            onClick={handleSearchRooms}
            disabled={loading}
            sx={{ 
              bgcolor: '#4caf50', 
              color: '#ffffff', 
              '&:hover': { bgcolor: '#81c784' },
              py: 1.5
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Search Rooms'}
          </Button>
        </Box>
      )}

      {activeStep === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ color: '#ffffff' }}>
            Select Your Room
          </Typography>
          {errors.room && (
            <Typography color="error" sx={{ mb: 2 }}>{errors.room}</Typography>
          )}
          <Grid container spacing={3}>
            {rooms.map((room) => (
              <Grid item xs={12} sm={6} key={room.RoomNumber}>
                <Card
                  onClick={() => setSelectedRoom(room)}
                  sx={{ 
                    bgcolor: '#ffffff',
                    border: selectedRoom?.RoomNumber === room.RoomNumber ? '3px solid #4caf50' : '1px solid #ddd',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.02)' }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={room.Image || roomVisuals[room.RoomNumber]?.image || '/default-room.jpg'}
                    alt={`Room ${room.RoomNumber}`}
                  />
                  <CardContent>
                    <Typography variant="h6">Room {room.RoomNumber}</Typography>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                      {room.TypeName || room.Type}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Max Occupancy: {room.MaxPeople} Persons
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {room.Description || roomVisuals[room.RoomNumber]?.description || 'Comfortable room with modern amenities.'}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      Price: {nationality === 'Local' ? 
                        `LKR ${room.LocalPrice?.toLocaleString()}` : 
                        `USD ${room.ForeignPrice?.toLocaleString()}`}/night
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => setActiveStep(0)}
              sx={{ 
                color: '#ffffff', 
                borderColor: '#ffffff',
                '&:hover': { borderColor: '#81c784', bgcolor: '#2e7d32' }
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!selectedRoom}
              sx={{ 
                bgcolor: '#4caf50', 
                color: '#ffffff', 
                '&:hover': { bgcolor: '#81c784' }
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}

      {activeStep === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h5" sx={{ color: '#ffffff' }}>
            Reservation Details
          </Typography>
          <FormControl fullWidth error={!!errors.PackageID}>
            <InputLabel>Package Type</InputLabel>
            <Select
              value={reservationData.PackageID}
              onChange={(e) => {
                console.log('Selected package:', e.target.value);
                setReservationData({
                  ...reservationData,
                  PackageID: e.target.value
                });
              }}
              label="Package Type"
            >
              {packagesLoading ? (
                <MenuItem disabled>Loading packages...</MenuItem>
              ) : packageTypes.length > 0 ? (
                packageTypes.map((pkg) => (
                  <MenuItem key={pkg.PackageID} value={pkg.PackageID}>
                    {pkg.Name} ({((pkg.PriceMultiplier * 100) - 100).toFixed(0)}% extra)
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No package types available</MenuItem>
              )}
            </Select>
            {errors.PackageID && (
              <FormHelperText>{errors.PackageID}</FormHelperText>
            )}
          </FormControl>
          <TextField
            label="Adults"
            type="number"
            value={reservationData.Adults}
            onChange={(e) => setReservationData({
              ...reservationData,
              Adults: e.target.value ? parseInt(e.target.value) : 1
            })}
            error={!!errors.adults}
            helperText={errors.adults}
            inputProps={{ min: 1 }}
            sx={{ bgcolor: '#ffffff', borderRadius: 1 }}
          />
          <TextField
            label="Children"
            type="number"
            value={reservationData.Children}
            onChange={(e) => setReservationData({
              ...reservationData,
              Children: e.target.value ? parseInt(e.target.value) : 0
            })}
            error={!!errors.children}
            helperText={errors.children}
            inputProps={{ min: 0 }}
            sx={{ bgcolor: '#ffffff', borderRadius: 1 }}
          />
          <TextField
            label="Special Requests"
            multiline
            rows={4}
            value={reservationData.SpecialRequests}
            onChange={(e) => setReservationData({ ...reservationData, SpecialRequests: e.target.value })}
            sx={{ bgcolor: '#ffffff', borderRadius: 1 }}
          />
          <TextField
            label="Arrival Time"
            type="time"
            value={reservationData.ArrivalTime}
            onChange={(e) => setReservationData({ ...reservationData, ArrivalTime: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ bgcolor: '#ffffff', borderRadius: 1 }}
          />
          <TextField
            label="Departure Time"
            type="time"
            value={reservationData.DepartureTime}
            onChange={(e) => setReservationData({ ...reservationData, DepartureTime: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ bgcolor: '#ffffff', borderRadius: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => setActiveStep(1)}
              sx={{ 
                color: '#ffffff', 
                borderColor: '#ffffff',
                '&:hover': { borderColor: '#81c784', bgcolor: '#2e7d32' }
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ 
                bgcolor: '#4caf50', 
                color: '#ffffff', 
                '&:hover': { bgcolor: '#81c784' }
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}

      {activeStep === 3 && invoice && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h5" sx={{ color: '#ffffff' }}>
            Invoice Summary
          </Typography>
          <TableContainer component={Paper} sx={{ bgcolor: '#ffffff' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    Base Room Price ({invoice.currency} {nationality === 'Local' ? selectedRoom?.LocalPrice : selectedRoom?.ForeignPrice}/night x {invoice.numberOfNights} nights)
                  </TableCell>
                  <TableCell align="right">{invoice.currency} {invoice.baseRoomPrice.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Package Adjustment ({reservationData.PackageID})</TableCell>
                  <TableCell align="right">{invoice.currency} {(invoice.adjustedRoomPrice - invoice.baseRoomPrice).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Service Charge (10%)</TableCell>
                  <TableCell align="right">{invoice.currency} {invoice.serviceCharge.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>VAT (18%)</TableCell>
                  <TableCell align="right">{invoice.currency} {invoice.vat.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Total Price</strong></TableCell>
                  <TableCell align="right"><strong>{invoice.currency} {invoice.totalPrice.toFixed(2)}</strong></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => setActiveStep(2)}
              sx={{ 
                color: '#ffffff', 
                borderColor: '#ffffff',
                '&:hover': { borderColor: '#81c784', bgcolor: '#2e7d32' }
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ 
                bgcolor: '#4caf50', 
                color: '#ffffff', 
                '&:hover': { bgcolor: '#81c784' }
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}

      {activeStep === 4 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h5" sx={{ color: '#ffffff' }}>
            Guest Information
          </Typography>
          <TextField
            label="First Name"
            value={customerData.FirstName}
            onChange={(e) => setCustomerData({ ...customerData, FirstName: e.target.value })}
            error={!!errors.FirstName}
            helperText={errors.FirstName}
            sx={{ bgcolor: '#ffffff', borderRadius: 1 }}
          />
          <TextField
            label="Last Name"
            value={customerData.LastName}
            onChange={(e) => setCustomerData({ ...customerData, LastName: e.target.value })}
            error={!!errors.LastName}
            helperText={errors.LastName}
            sx={{ bgcolor: '#ffffff', borderRadius: 1 }}
          />
          <TextField
            label="Email"
            type="email"
            value={customerData.Email}
            onChange={(e) => setCustomerData({ ...customerData, Email: e.target.value })}
            error={!!errors.Email}
            helperText={errors.Email}
            sx={{ bgcolor: '#ffffff', borderRadius: 1 }}
          />
          <TextField
            label="Phone"
            value={customerData.Phone}
            onChange={(e) => setCustomerData({ ...customerData, Phone: e.target.value })}
            error={!!errors.Phone}
            helperText={errors.Phone}
            sx={{ bgcolor: '#ffffff', borderRadius: 1 }}
          />
          <Autocomplete
            options={countries}
            value={customerData.Country}
            onChange={(event, newValue) => {
              setCustomerData({ ...customerData, Country: newValue || '' });
            }}
            disabled={nationality === 'Local'}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Country" 
                error={!!errors.Country}
                helperText={errors.Country}
                sx={{ bgcolor: '#ffffff', borderRadius: 1 }}
              />
            )}
          />
          {nationality === 'Local' ? (
            <TextField
              label="NIC"
              value={customerData.Nic}
              onChange={(e) => setCustomerData({ ...customerData, Nic: e.target.value })}
              error={!!errors.Nic}
              helperText={errors.Nic}
              sx={{ bgcolor: '#ffffff', borderRadius: 1 }}
            />
          ) : (
            <TextField
              label="Passport Number"
              value={customerData.Passport}
              onChange={(e) => setCustomerData({ ...customerData, Passport: e.target.value })}
              error={!!errors.Passport}
              helperText={errors.Passport}
              sx={{ bgcolor: '#ffffff', borderRadius: 1 }}
            />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => setActiveStep(3)}
              sx={{ 
                color: '#ffffff', 
                borderColor: '#ffffff',
                '&:hover': { borderColor: '#81c784', bgcolor: '#2e7d32' }
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ 
                bgcolor: '#4caf50', 
                color: '#ffffff', 
                '&:hover': { bgcolor: '#81c784' }
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}

      {activeStep === 5 && (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#ffffff' }}>
            Complete Your Reservation
          </Typography>
          <Typography sx={{ color: '#ffffff', mb: 3 }}>
            Please review your details and proceed to payment to finalize your booking.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setIsPaymentModalOpen(true)}
            disabled={loading}
            sx={{ 
              bgcolor: '#4caf50', 
              color: '#ffffff', 
              '&:hover': { bgcolor: '#81c784' },
              py: 1.5,
              px: 4
            }}
          >
            Proceed to Payment
          </Button>

          <PaymentModal
            open={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onConfirm={async (paymentDetails) => {
              try {
                setLoading(true);
                // Process payment details
                console.log('Payment details:', paymentDetails);
                
                // Submit reservation
                await handleSubmitReservation();
                
                // Close payment modal
                setIsPaymentModalOpen(false);
                
                // Show success message
                setSnackbar({
                  open: true,
                  message: 'Payment successful! Your reservation is confirmed.',
                  severity: 'success'
                });
                
                // Move to final step
                setActiveStep(6);
              } catch (error: any) {
                setSnackbar({
                  open: true,
                  message: error.message || 'Payment failed. Please try again.',
                  severity: 'error'
                });
              } finally {
                setLoading(false);
              }
            }}
            amount={calculateTotalAmount()?.totalPriceLKR || 0}
            isProcessing={loading}
          />
        </Box>
      )}

      {activeStep === 6 && (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#ffffff' }}>
            Reservation Confirmed
          </Typography>
          <Typography sx={{ color: '#ffffff', mb: 3 }}>
            Thank you for your booking! A confirmation email has been sent to {customerData.Email}.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              // Reset form and go back to first step
              setActiveStep(0);
              setCustomerData({
                FirstName: '',
                LastName: '',
                Email: '',
                Phone: '',
                Country: 'Sri Lanka',
                Nic: '',
                Passport: ''
              });
              setIsPaymentModalOpen(false);
            }}
            sx={{ 
              bgcolor: '#4caf50', 
              color: '#ffffff', 
              '&:hover': { bgcolor: '#81c784' },
              py: 1.5,
              px: 4
            }}
          >
            Make Another Reservation
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CheckInComponent;