import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Icon, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ShopLayout1 from 'components/layouts/ShopLayout1';
import SEO from 'components/SEO';

function Success() {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [orderno,setOrderno]=useState()


  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;


  const theme = useTheme();

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const sessionId = params.get('session_id');
  //   const orderno = params.get('orderno');
  //   setOrderno(orderno)

  //   if (sessionId) {
  //     fetch(`/api/get-payment-details?session_id=${sessionId}`)
  //       .then((response) => response.json())
  //       .then   ((data) => {




  //         setPaymentDetails(data);
          





  //       });
  //   }
  // }, []);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const orderno = params.get('orderno');
    setOrderno(orderno);
  
    if (sessionId) {
      fetch(`/api/get-payment-details?session_id=${sessionId}`)
        .then((response) => response.json())
        .then((data) => {
          setPaymentDetails(data);
  
          const updatedata = {
           
            
            orderno: orderno,
            paymentid:data.id,
            paymentstatus:data.payment_status,
            invoice:data.invoice,




          };
  
          fetch(server_ip+'updatepayment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedata),
          })
            .then((response) => response.json())
            .then((responseData) => {
              console.log('Response from second API:', responseData);
            })
            .catch((error) => {
              console.error('Error sending data to second API:', error);
            });
        })
        .catch((error) => {
          console.error('Error fetching payment details:', error);
        });
    }
  }, []);
  
  console.log("Pay",paymentDetails)

  return (
    <ShopLayout1 topbarBgColor={theme.palette.grey[900]}>
      <Box
        textAlign="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800 }}> 
          {paymentDetails ? (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f5f5f5', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
  <Icon sx={{ fontSize: 100, color: 'green' }}>check_circle</Icon>
  <Typography variant="h4" style={{ color: 'green', fontWeight: 'bold', marginTop: '1rem', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
    Payment Successful
  </Typography>
  <Typography variant="body1" style={{ fontSize: '1.25rem', marginTop: '2rem', color: '#555', fontStyle: 'italic' }}>
    Thank you for your payment!
  </Typography>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', border: '1px solid #ccc', borderRadius: '5px', padding: '1rem', backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
  <Typography variant="body2" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'left' }}>
    <strong>Customer Name:</strong> {paymentDetails.customer_details.name}
  </Typography>
  <Typography variant="body2" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'left' }}>
    <strong>Customer Email:</strong> {paymentDetails.customer_details.email}
  </Typography>
  <Typography variant="body2" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'left' }}>
    <strong>Order Number:</strong> {orderno}
  </Typography>
  <Typography variant="body2" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'left' }}>
    <strong>Invoice ID:</strong> {paymentDetails.invoice}
  </Typography>
  <Typography variant="body2" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'left' }}>
    <strong>Amount Paid:</strong> {paymentDetails.amount_total} 
  </Typography>

</div>


</div>


 
     
          ) : (
            <div>
              <CircularProgress />
              <Typography variant="body1">Loading payment details...</Typography>
            </div>
          )}
          {/* Offer next steps or contact information */}
        </Paper>
      </Box>
    </ShopLayout1>
  );
}

export default Success;
