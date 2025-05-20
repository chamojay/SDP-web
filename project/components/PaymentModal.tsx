import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Grid
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (paymentDetails: any) => void;
  amount: number;
  isProcessing: boolean;
}

const TEST_CARDS = [
  { type: 'Visa', number: '4242 4242 4242 4242' },
  { type: 'Mastercard', number: '5555 5555 5555 4444' },
  { type: 'American Express', number: '3782 822463 10005' },
];

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  onConfirm,
  amount,
  isProcessing
}) => {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!cardDetails.number.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.number = 'Invalid card number';
    }
    if (!cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiry = 'Invalid expiry date (MM/YY)';
    }
    if (!cardDetails.cvc.match(/^\d{3,4}$/)) {
      newErrors.cvc = 'Invalid CVC';
    }
    if (!cardDetails.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onConfirm({
        method: 'card',
        ...cardDetails
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1a472a', color: 'white' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <CreditCardIcon />
          <Typography>Payment Details</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Amount to Pay: LKR {amount.toFixed(2)}
          </Typography>

          <Alert severity="info" sx={{ mb: 2 }}>
            Demo Test Cards Available:
            {TEST_CARDS.map((card, index) => (
              <Box key={index} sx={{ mt: 1 }}>
                <Typography variant="body2">
                  {card.type}: {card.number}
                </Typography>
              </Box>
            ))}
            <Typography variant="body2" sx={{ mt: 1 }}>
              Use any future date for expiry and any 3 digits for CVC
            </Typography>
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Card Number"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                error={!!errors.number}
                helperText={errors.number}
                fullWidth
                placeholder="1234 5678 9012 3456"
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Cardholder Name"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Expiry Date"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                error={!!errors.expiry}
                helperText={errors.expiry}
                placeholder="MM/YY"
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="CVC"
                value={cardDetails.cvc}
                onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                error={!!errors.cvc}
                helperText={errors.cvc}
                type="password"
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={isProcessing}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isProcessing}
          variant="contained"
          sx={{ bgcolor: '#1a472a' }}
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;