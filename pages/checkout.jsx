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
  const { data, error } = useSWR(server_ip + 'getGeneralSetting', fetcher);

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
    
      const data = await api.addOrder(values,cartList,totalPrice,userid,deliveryFee ).then((res) => {
        if(res.status == 200){
          if(paymentMethod!='cod'){
            console.log('payment with credit card');
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


  const handleCheckout = async (cartList,orderno,totalPrice,deliveryFee,email) => {

    // console.log("Order No",orderno)


    const stripe = await getStripePromise();
    try {
      const response = await fetch("/api/create-checkout-session/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
        body: JSON.stringify({ cartList, orderno,totalPrice,deliveryFee,email })
      });
  
      if (response.ok) {
      
        
      const body = await response.json()
      window.location.href = body.url
       } else {
         console.log('Request failed');
        }
      }catch (error) {
        console.log('Error occurred during the request', error);
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
        console.log('Data saved successfully:', response.data);
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
    if (address && address) {
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
    }
  }, [address]);



const[field,setFieldValue]=useState()

  const handleFormSubmit = (values) => {
    
    
    
    const cartList = state.cart;

    const deliveryFee = shippingprice&&shippingprice? shippingprice.shippingCharges:300;
  
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
            
            DeliveryFee={shippingprice&&shippingprice? shippingprice.shippingCharges:0}

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
