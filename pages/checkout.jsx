import { Container, Grid } from "@mui/material";
import ShopLayout1 from "components/layouts/ShopLayout1";
import SEO from "components/SEO";
import CheckoutForm2 from "pages-sections/checkout/CheckoutForm2";
import CheckoutSummary2 from "pages-sections/checkout/CheckoutSummary2";
import api from "utils/api/market-2";
import { useAppContext } from "contexts/AppContext";
import { useRouter } from 'next/router'
import {useSession} from 'next-auth/react';
import { useState, useEffect } from 'react'
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { useTheme } from "@mui/material/styles";
import axios from 'axios';

import getStripePromise from 'utils/stripe';

const Checkout = () => {
  const { data: session,status} = useSession();
  const [orderData,setOrderData] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const[totalPrice,setTotalPrice]=useState(0)

  const [paymentMethod, setPaymentMethod] = useState("cod");




  const theme = useTheme();

  const router = useRouter()
  const { state } = useAppContext();
  const fetcher = async (url) => await axios.get(url).then((res) => res.data);
  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  // Cache getGeneralSetting for 5 minutes to reduce API calls
  const { data, error } = useSWR(server_ip + 'getGeneralSetting', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // 5 minutes
    shouldRetryOnError: false,
  });

  const cartList = state.cart;

  async function createOrder(values,cartList,totalPrice,deliveryFee,router){


    const onlinetotalprice=totalPrice-deliveryFee



    if(session){
      const userid=session.user.id
    
      const data = await api.addOrder(values,cartList,totalPrice,deliveryFee,userid)
      .then((res) => {
        if(res.status == 200){





          if(paymentMethod!='cod'){
            if(isCouponValid){
              saveVoucher(userid,couponData.id,couponData.code);
  
            }
            handleCheckout(cartList,res.data.addOrder.orderNo,onlinetotalprice,deliveryFee,values.email);
          }
          else{
            if(isCouponValid){
              saveVoucher(userid,couponData.id,couponData.code);
  
            }
            toast.success("Order Added Successfully", {position: toast.POSITION.TOP_RIGHT});
            state.cart.length=null;
            router.push('/order-confirmation');
          }
        

        
       


          }
       
      }).catch((error) => {
          if (error.response) {
          if(error.response.status==400){
            var a =Object.keys(error.response.data)[0]
            toast.error(error.response.data[a].toString(), {position: toast.POSITION.TOP_RIGHT});
          }
          else{
            toast.error('Error Occured while Updating Product '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
          }
          return error.response
        } else if (error.request) {
          toast.error('Network Error', {position: toast.POSITION.TOP_RIGHT});
          return error.request
        } else {
          toast.error('Error Occured', {position: toast.POSITION.TOP_RIGHT});
          return error
        }
      });
      
  

    }
    else{
      const userid=null 
    
      const data = await api.addOrder(values,cartList,totalPrice,deliveryFee,userid).then((res) => {
        if(res.status == 200){
          if(paymentMethod!='cod'){
            handleCheckout(cartList,res.data.addOrder.orderNo,onlinetotalprice,deliveryFee,values.email);
          }
          else{
            toast.success("Order Added Successfully", {position: toast.POSITION.TOP_RIGHT});
            state.cart.length=null;
            router.push('/order-confirmation');
          }
        }
      }).catch((error) => {
          if (error.response) {
          if(error.response.status==400){
            var a =Object.keys(error.response.data)[0]
            toast.error(error.response.data[a].toString(), {position: toast.POSITION.TOP_RIGHT});
          }
          else{
            toast.error('Error Occured while Adding Order '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
          }
          return error.response
        } else if (error.request) {
          toast.error('Network Error', {position: toast.POSITION.TOP_RIGHT});
          return error.request
        } else {
          toast.error('Error Occured', {position: toast.POSITION.TOP_RIGHT});
          return error
        }
      });
      

      
     
    }
   
  
  
  }


  const handleCheckout = async (cartList, orderno, totalPrice, deliveryFee, email) => {
    try {
      // Validate inputs
      if (!cartList || cartList.length === 0) {
        toast.error("Cart is empty", { position: toast.POSITION.TOP_RIGHT });
        return;
      }

      if (!orderno) {
        toast.error("Order number is missing", { position: toast.POSITION.TOP_RIGHT });
        return;
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error("Valid email is required", { position: toast.POSITION.TOP_RIGHT });
        return;
      }

      // Show loading state
      setIsDisabled(true);

      // Prepare cart items with proper pricing
      const formattedCartList = cartList.map(item => ({
        id: item.id || item.itemId,
        name: item.name || 'Product',
        price: item.price || item.salePrice || item.variant_price || 0,
        qty: item.qty || 1,
        image: item.image || '',
        sku: item.sku || '',
        description: item.description || undefined,
        variant: item.variant || undefined,
      }));

      // Create checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          cartList: formattedCartList, 
          orderno, 
          totalPrice, 
          deliveryFee, 
          email 
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to create payment session');
      }

      const body = await response.json();
      
      if (body.url) {
        // Redirect to Stripe checkout
        window.location.href = body.url;
      } else {
        throw new Error('Payment session URL not received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setIsDisabled(false);
      toast.error(
        error.message || 'An error occurred during checkout. Please try again.',
        { position: toast.POSITION.TOP_RIGHT }
      );
    }
  };


  function saveVoucher(userid, voucherid,vouchercode) {
    const vouhcerdata = {
      userid: userid,
      voucherid: voucherid,
      vouchercode:vouchercode,
    };
  
    axios
      .post(process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'savevoucherdata',vouhcerdata, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization":'Bearer '+session.accessToken
        },
      })
      .then((response) => {
        // Voucher saved successfully
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  }
  
  const [address,setAddress]=useState('')
  
  useEffect(() => {
    
  }, [address]);
  const[shippingprice,setShippingPrice]=useState()
  useEffect(() => {
    // Debounce API call to prevent excessive requests
    if (!address || !cartList || cartList.length === 0) {
      return;
    }
    
    const timeoutId = setTimeout(() => {
      const urladdress = process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'calculateweight';
      fetch(urladdress, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          // "Authorization": 'Bearer ' + session.accessToken
        },
        body: JSON.stringify({ "cartList": cartList, "city": address })
      })
        .then(res => res.json())
        .then((customerOrders) => {
          setShippingPrice(customerOrders);
        })
        .catch((err) => {
          console.error("Error fetching shipping price:", err);
        });
    }, 500); // Wait 500ms after user stops typing
    
    return () => clearTimeout(timeoutId);
  }, [address, cartList]);

const[field,setFieldValue]=useState()

  const getDeliveryFee = () => {
    const baseFee = shippingprice && shippingprice ? shippingprice.shippingCharges : 6;
    return totalPrice >= 50 ? 0 : baseFee;
  };

  const handleFormSubmit = (values) => {
    
    
    
    const cartList = state.cart;

    const deliveryFee = getDeliveryFee();
  
    createOrder(values,cartList,totalPrice,deliveryFee,router)
    setIsDisabled(true)
  };
  const [isCouponValid, setIsCouponValid] = useState(false);
  const [couponData, setCouponData] = useState(null);

  
  return (
    <ShopLayout1 topbarBgColor={theme.palette.grey[900]} navCategories={[]}>
      <SEO  title="Checkout" 
            metaTitle = "Checkout - Online Book Store"
      />
      <Container
        sx={{
          my: "1.5rem",
        }}
      >
    
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} xs={12}>
            <CheckoutForm2
            isDisabled= {isDisabled}
            handleFormSubmit={handleFormSubmit} 
            couponData={couponData}
            setCouponData={setCouponData}
            isCouponValid={isCouponValid}
            setIsCouponValid={setIsCouponValid}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            setFieldValue={setFieldValue}
            setAddress={setAddress}


            />
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <CheckoutSummary2
            
            DeliveryFee={getDeliveryFee()}

            couponData={couponData}
            setTotalPrice={setTotalPrice}

            />
          </Grid>
        </Grid>
      </Container>
    </ShopLayout1>
  );
};

export default Checkout;
