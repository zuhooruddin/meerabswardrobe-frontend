/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutline, ModeEditOutline } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  MenuItem,
  Typography,
  Radio,
  Divider,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Card1 from "components/Card1";
import { FlexBetween, FlexBox } from "components/flex-box";
import LazyImage from "components/LazyImage";
import { H6, Paragraph } from "components/Typography";
import { months, years } from "data/months-years";
import { format } from "date-fns";
import { Formik,Field, } from "formik";
import { useEffect, useState } from "react";
import * as React from 'react';
import * as yup from "yup";
import EditAddressForm from "./EditAddressForm";
import NewAddressForm from "./NewAddressForm"; 
import { useAppContext } from "contexts/AppContext";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {useSession} from 'next-auth/react';
import useSWR from 'swr';
import { toast } from 'react-toastify';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Heading = ({ number, title }) => {


  return (
    <FlexBox gap={1.5} alignItems="center" mb={3.5}>
      <Avatar
        sx={{
          width: 32,
          height: 32,
          color: "primary.text",
          backgroundColor: "primary.main",
        }}
      >
        {number}
      </Avatar>
      <Typography fontSize="20px">{title}</Typography>
    </FlexBox>
  );
};
const validateEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (!email) {
    return "Email is required";
  }
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  return null; 
};


const products = [
  {
    product: 1,
    name: "Stripe Product",
    price: 400,
    quantity: 3,
  },
  {
    product: 2,
    name: "Stripe Product2",
    price: 40,
    quantity: 2,
  },
  {
    product: 3,
    name: "Stripe Product23",
    price: 4000,
    quantity: 1,
  },
];

const CheckoutForm2 = (props) => {



  const { handleFormSubmit,paymentMethod,setPaymentMethod,couponData,setCouponData,isCouponValid,setIsCouponValid,setAddress } = props;



  const handlePhoneChange = (event) => {
    const phoneValue = event.target.value;
    setValues((prevValues) => ({
      ...prevValues,
      phone: phoneValue,
    }));
  };
  
  const [hasVoucher, setHasVoucher] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [dateList, setDateList] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selected, setSelected] = useState(false);
  const [deleteAction, setDeleteAction] = useState(false);
  const { state } = useAppContext();
  const cartList = state.cart;


  const getTotalPrice = () => {
    return cartList.reduce((accum, item) => accum + item.price  * item.qty, 0);
  };


  

  const handleFieldValueChange = (value, fieldName, setFieldValue, cityName) => () => {
    if (!deleteAction) {
      setFieldValue(fieldName, value);
      setFieldValue('city', cityName);
  
      setAddress(cityName);
    }
  };
  

  const toggleHasVoucher = () => setHasVoucher((has) => !has);

  useEffect(() => {
    console.log("mhy",addressData)
    
    setAddress(addressData&&addressData&&addressData[0]?addressData[0].city:'')
  }, [addressData]);


  useEffect(() => {
    const addressExists = addressData.some((item) => item.address === newAddress.address);

    if (newAddress !== "") if (!addressExists) setAddressData([newAddress, ...addressData]);
    else setAddressData([]);
   
  }, [newAddress]);

  const deleteAddress = (ind) => {
    addressData.splice(ind, 1);

    
    setAddressData(addressData);
  
  };

  


  const editHandler = (value,ind) => {
    const data = addressData[ind];
    setSelected(data);
    openEditForm ? setOpenEditForm(false) : setOpenEditForm(true);
  };
    

 
  const handlePaymentMethodChange = ({ target: { name } }) => {
    setPaymentMethod(name);
  };

  // const stripePromise = loadStripe(
  //   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  // );
  // const handleCheckout = async () => {
  //   const stripe = await getStripePromise();
  //   const response = await fetch("/api/create-checkout-session/", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     cache: "no-cache",
  //     body: JSON.stringify(products),
  //   });

  //   const data = await response.json();
  //   if (data.session) {
  //     stripe?.redirectToCheckout({ sessionId: data.session.id });
  //   }
  // };

  



  const [open, setOpen] = useState(false);
  const [alertMessage,setAlertMessage] = useState("");
  const [alertSeverity,setAlertSeverity] = useState("");


  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const { data: session,status} = useSession();
  const initialValues = {
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: session?.user?.phone || '',
    phone2: '',
    voucher: '',
  };
  
  const [data, setdata] = useState(false);
  const [orderData,setOrderData] = useState([]);
  const [cityData,setcityData] = useState([]);

  const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE+'getCustomerShipping'
  const fetcher = (...args) =>   fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization":'Bearer '+session.accessToken
    },
    body: JSON.stringify({"id":session.user.id})
  }).then(res => res.json())
  .then((customerOrders) => {
    setOrderData(customerOrders)
  }).catch((err) => {
   
});
const { orders, error} =  useSWR(url, fetcher);
const [values, setValues] = useState(initialValues);


const urls = process.env.NEXT_PUBLIC_BACKEND_API_BASE+'getallcities'
const fetcher1 = (...args) =>   fetch(urls, {
  method: 'POST',

}).then(res => res.json())
.then((citydatas) => {
  setcityData(citydatas)
}).catch((err) => {
 
});
const { orders:order1, error:error1} =  useSWR(urls, fetcher1);



const handleApplyCoupon = (voucherCode) => {
  fetch(process.env.NEXT_PUBLIC_BACKEND_API_BASE+'checkvoucher', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization":'Bearer '+session.accessToken

    },
    body: JSON.stringify({ couponCode: voucherCode,userid: session.user.id}), 
  })
    .then((response) => response.json())
    .then((data) => {

      if (data.isValid) {
        setValues({
          ...values,
          voucher: '', 
        });
toast.success('Coupon Sucessfully Applied', {
                position: toast.POSITION.TOP_RIGHT
              });
        setIsCouponValid(true);
        setCouponData(data.couponData);


      } else if(data.status==='409') {
        toast.error(data.message, {
          position: toast.POSITION.TOP_RIGHT
        });
        setIsCouponValid(false);
        setCouponData(null);
      }
      else{
        toast.error("Invalid Coupon", {
          position: toast.POSITION.TOP_RIGHT
        });
        setIsCouponValid(false);
        setCouponData(null);
      }
    })
    .catch((error) => {

      console.error('Error checking coupon validity:', error);
    });
};









if(session){
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={checkoutSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <Card1
            sx={{
              mb: 3,
            }}
          >
            <Heading number={1} title="Personal Information" />

            <Box mb={3.5}>
              <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
  <TextField
    fullWidth
    inputProps={{ maxLength: 150 }}
    type="text"
    name="name"
    onChange={handleChange}
    label="Full Name"
    value={values.name || session.user.name}
    error={!!touched.name && !!errors.name}
    helperText={touched.name && errors.name}
  />
  
</Grid>


                <Grid item sm={6} xs={12}>
                <Box display="flex" flexDirection="column">
    <Field
      fullWidth
      placeholder="&nbsp;&nbsp;Email"
      validate={validateEmail}
      type="email" 
      name="email"
      onChange={handleChange}
      label="  Email Address"
      value={values.email }
      error={touched.email && errors.email}
      style={touched.email && errors.email ? { 
        height: "36px",
        width: "100%",
        border: "2.3px solid #cd3232", 
        borderRadius: "4px", 
        outline: "none", 
        transition: "border-color 0.3s ease",
        fontSize: "15px",
        color: "grey",
     

      } : {
        height: "36px",
        width: "100%",
        border: "1.3px solid #b9b5b5",
        borderRadius: "4px", 
        outline: "none", 
        transition: "border-color 0.3s ease",
        fontSize: "15px", 
        color: "#2B3445",
        
      }}
      InputProps={{
        style: {
          fontSize: "15px",
          fontStyle:'inherit',
          color: "red" ,
          paddingLeft: "10px" // Add margin-left here

        }
      }}
    />
    {errors.email && touched.email && (
      <div style={{ color: "red" }}>{errors.email}</div> 
    )}
  </Box>
</Grid>




   

                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    name="phone"
                    onChange={handleChange}
                    label="Primary Phone"
                    onKeyPress={(event) => {
                      const keyCode = event.keyCode || event.which;
                      const keyValue = String.fromCharCode(keyCode);
                      const isValidKey =
                        /[0-9+\-]/.test(keyValue) || keyCode === 8 || keyCode === 9;
                      if (!isValidKey) {
                        event.preventDefault();
                      }
                    }}
                    value={values.phone}
                    inputProps={{ maxLength: 150 }}
                    error={!!touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    name="phone2"
                    onKeyPress={(event) => {
                      const keyCode = event.keyCode || event.which;
                      const keyValue = String.fromCharCode(keyCode);
                      const isValidKey =
                        /[0-9+\-]/.test(keyValue) || keyCode === 8 || keyCode === 9;
                      if (!isValidKey) {
                        event.preventDefault();
                      }
                    }}
                    onChange={handleChange}
                    label="Secondary Phone"
                    inputProps={{ maxLength: 150 }}
                    value={values.phone2}
                    error={!!touched.phone2 && !!errors.phone2}
                    helperText={touched.phone2 && errors.phone2}
                  />
                </Grid>
              </Grid>
            </Box>
          </Card1>

          <Card1
            sx={{
              mb: 3,
            }}
          >
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
                {alertMessage}
              </Alert>
            </Snackbar>

            <FlexBetween>
              <Heading number={2} title="Delivery Address" />

              <NewAddressForm setNewAddress={setNewAddress} setFieldValue={setFieldValue} citydata={cityData&&cityData.length>0?cityData:''} />
            </FlexBetween>

            <Typography mb={1.5}>Delivery Address</Typography>
            <Grid container spacing={3}>
              {orderData.length>0?
              orderData.map((item, ind) => (
                <Grid item md={4} sm={6} xs={12} key={ind}>
                  <Card
                    sx={{
                      padding: 2,
                      boxShadow: "none",
                      cursor: "pointer",
                      border: "1px solid",
                      position: "relative",
                      backgroundColor: "grey.100",
                      borderColor:
                        item.address === values.address
                          ? "primary.main"
                          : "transparent",
                    }}
                    onClick={handleFieldValueChange(
                      item.address,
                      "address",
                      setFieldValue,
                      
                      item.area,
                    )}
                  >
                    <FlexBox
                      justifyContent="flex-end"
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                      }}
                    >
                      {selected && (
                        <EditAddressForm
                          selected={selected}
                          data={setdata}
                          addressData={addressData}
                          openEditForm={openEditForm}
                          setOpenEditForm={setOpenEditForm}
                          setAddressData={setAddressData}
                          ind={ind}
                          citydata={cityData&&cityData.length>0?cityData:''}
                        />
                      )}

                    
                    </FlexBox>

                    <H6 mb={0.5}>{item.area}</H6>
                    <Paragraph color="grey.700">{item.country}</Paragraph>
                    {item.address && (
                      <Paragraph color="grey.700">{item.address}</Paragraph>
                    )}
            
                    
                  </Card>
                </Grid>
              )):""}
            </Grid>
            <br />
          <Grid container spacing={3}>
              {
              addressData.map((item, ind) => (
                <Grid item md={4} sm={6} xs={12} key={ind}>
                  <Card
                    sx={{
                      padding: 2,
                      boxShadow: "none",
                      cursor: "pointer",
                      border: "1px solid",
                      position: "relative",
                      backgroundColor: "grey.100",
                      borderColor:
                        item.address === values.address
                          ? "primary.main"
                          : "transparent",
                    }}
                    onClick={handleFieldValueChange(
                      item.address,
                      "address",
                      setFieldValue,
                      item.city,
                    )}
                  >
                    <FlexBox
                      justifyContent="flex-end"
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                      }}
                    >
                      {selected && (
                        <EditAddressForm
                          selected={selected}
                          data={setdata}

                          addressData={addressData}

                          openEditForm={openEditForm}
                          setOpenEditForm={setOpenEditForm}
                          setAddressData={setAddressData}
                          ind={ind}
                          citydata={cityData&&cityData.length>0?cityData:''}
                        />
                      )}

                      <IconButton
                        size="small"
                        sx={{
                          mr: 1,
                        }}
                        onClick={() => editHandler(item.address,ind)}
                      >
                        <ModeEditOutline
                          sx={{
                            fontSize: 20,
                          }}
                        />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteAddress(ind)}
                      >
                        <DeleteOutline
                          sx={{
                            fontSize: 20,
                          }}
                        />
                      </IconButton>
                    </FlexBox>

                    <H6 mb={0.5}>{item.city}</H6>
                    <Paragraph color="grey.700">{item.country}</Paragraph>
                    {item.address && (
                      <Paragraph color="grey.700">{item.address}</Paragraph>
                    )}
            
                    
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card1>

          <Card1
            sx={{
              mb: 3,
            }}
          >
             <Heading number={3} title="Payment Type" />
            <FormControlLabel
              name="cod"
              onChange={handlePaymentMethodChange}
              label={<Paragraph fontWeight={600}>Cash On Delivery</Paragraph>}
              control={
                <Radio
                  checked={paymentMethod === "cod"}
                  color="primary"
                  size="small"
                />
              }
            />
            <Divider
              sx={{
                mb: 3,
                mx: -4,
              }}
            />
            <FormControlLabel
              name="credit-card"
              // disabled={true}
              onChange={handlePaymentMethodChange}
              label={<Paragraph fontWeight={600}>Pay with Credit/Debit Card</Paragraph>}
              control={
                <Radio
                  checked={paymentMethod === "credit-card"}
                  color="primary"
                  size="small"
                />
              }
            />
            <Divider
              sx={{
                mb: 3,
                mx: -4,
              }}
            />

            <Button
              sx={{
                color: "primary.main",
                mt: 3,
                lineHeight: 1,
              }}
              onClick={toggleHasVoucher}
            >
              I have a voucher
            </Button>

            {hasVoucher && (
              <FlexBox mt={3} gap={2} maxWidth="400px">
                <TextField
                  fullWidth
                  name="voucher"
                  value={values.voucher}
                  onChange={handleChange}
                  placeholder="Enter voucher code here"
                />
  <Button
      variant="contained"
      color="primary"
      type="button"
      onClick={() => {
        handleApplyCoupon(values.voucher);
        handleChange({ target: { name: "voucher", value: "" } });
      }}
      disabled={isCouponValid} >
  Apply
</Button>

              </FlexBox>
            )}

{getTotalPrice().toFixed(2) === '0.00' || cartList.length==0 || state.cart.length === 0 ?<Button
              fullWidth
              type="submit"
              disabled={true}             
              color="primary"
              variant="contained"
              sx={{
                mt: 3,
              }}
            >
              Place Order
            </Button>:(
<Button
              fullWidth
              type="submit"
              // type="button"
              onClick={() =>{ 
                // if(cartList.length!=0){
                  //  (cartList);
                  if(!errors.name && !errors.email && !errors.phone && !errors.phone2){
                    if(values.address){
                    
                      return true
                      }
                      else{
                        setAlertSeverity('warning');
                        setAlertMessage('Invalid Address! Select Address or Create a one to Place Order.');
                        setOpen(true);
                        return false
                      }
                    
                  }
                  else{
                  
                    setAlertSeverity('error');
                    setAlertMessage('Fill all the blank fields.');
                    setOpen(true);
                    return false
                  }
             
                
              }
              }
              color="primary"
              disabled={props.isDisabled}
              variant="contained"
              sx={{
                mt: 3,
              }}
            >
              Place Order
            </Button>
            )}
          </Card1>
        </form>
      )}
    </Formik>
  );
}
else{
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={checkoutSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <Card1
            sx={{
              mb: 3,
            }}
          >
            <Heading number={1} title="Personal Information" />

            <Box mb={3.5}>
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    name="name"
                    inputProps={{ maxLength: 150 }}

                    onChange={handleChange}
                    label="Full Name"
                    value={values.name}
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                <Box display="flex" flexDirection="column">
    <Field
      fullWidth
      placeholder="&nbsp;&nbsp;Email"
      validate={validateEmail}
      type="email" 
      name="email"
      onChange={handleChange}
      label="  Email Address"
      value={values.email}
      error={touched.email && errors.email}
      style={touched.email && errors.email ? { 
        height: "36px",
        width: "100%",
        border: "2.3px solid #cd3232", 
        borderRadius: "4px", 
        outline: "none", 
        transition: "border-color 0.3s ease",
        fontSize: "15px",
        color: "grey"
      } : {
        height: "36px",
        width: "100%",
        border: "1.3px solid #b9b5b5",
        borderRadius: "4px", 
        outline: "none", 
        transition: "border-color 0.3s ease",
        fontSize: "15px", 
        color: "#2B3445"
      }}
      InputProps={{
        style: {
          fontSize: "15px",
          fontStyle:'inherit',
          color: "red" ,
          
        }
      }}
    />
    {errors.email && touched.email && (
      <div style={{ color: "red" }}>{errors.email}</div> 
    )}
  </Box>
</Grid>
                <Grid item sm={6} xs={12}>
                <TextField
  fullWidth
  type="text"
  name="phone"
  onChange={handleChange}
  onKeyPress={(event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    const isValidKey =
      /[0-9+\-]/.test(keyValue) || keyCode === 8 || keyCode === 9;
    if (!isValidKey) {
      event.preventDefault();
    }
  }}
  label="Primary Phone"
  value={values.phone || ''}
  error={!!touched.phone && !!errors.phone}
  helperText={touched.phone && errors.phone}
/>



                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    name="phone2"
                    onChange={handleChange}
                    label="Secondary Phone"
                    inputProps={{ maxLength: 150 }}
                    onKeyPress={(event) => {
                      const keyCode = event.keyCode || event.which;
                      const keyValue = String.fromCharCode(keyCode);
                      const isValidKey =
                        /[0-9+\-]/.test(keyValue) || keyCode === 8 || keyCode === 9;
                      if (!isValidKey) {
                        event.preventDefault();
                      }
                    }}
                    value={values.phone2}
                    error={!!touched.phone2 && !!errors.phone2}
                    helperText={touched.phone2 && errors.phone2}
                  />
                </Grid>
              </Grid>
            </Box>
          </Card1>

          <Card1
            sx={{
              mb: 3,
            }}
          >
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
                {alertMessage}
              </Alert>
            </Snackbar>

            <FlexBetween>
              <Heading number={2} title="Delivery Address" />

              <NewAddressForm setNewAddress={setNewAddress} setFieldValue={setFieldValue} citydata={cityData&&cityData.length>0?cityData:''} />
            </FlexBetween>

            <Typography mb={1.5}>Delivery Address</Typography>
            <Grid container spacing={3}>
              {
              addressData.map((item, ind) => (
                <Grid item md={4} sm={6} xs={12} key={ind}>
                  <Card
                    sx={{
                      padding: 2,
                      boxShadow: "none",
                      cursor: "pointer",
                      border: "1px solid",
                      position: "relative",
                      backgroundColor: "grey.100",
                      borderColor:
                        item.address === values.address
                          ? "primary.main"
                          : "transparent",
                    }}
                    onClick={handleFieldValueChange(
                      item.address,
                      "address",
                      setFieldValue,
                      item.city,
                    )}
                  >
                    <FlexBox
                      justifyContent="flex-end"
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                      }}
                    >
                      {selected && (
                        <EditAddressForm
                          selected={selected}
                          data={setdata}

                          addressData={addressData}

                          openEditForm={openEditForm}
                          setOpenEditForm={setOpenEditForm}
                          setAddressData={setAddressData}
                          ind={ind}
                          citydata={cityData&&cityData.length>0?cityData:''}
                        />
                      )}

                      <IconButton
                        size="small"
                        sx={{
                          mr: 1,
                        }}
                        onClick={() => editHandler(item.address,ind)}
                      >
                        <ModeEditOutline
                          sx={{
                            fontSize: 20,
                          }}
                        />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteAddress(ind)}
                      >
                        <DeleteOutline
                          sx={{
                            fontSize: 20,
                          }}
                        />
                      </IconButton>
                    </FlexBox>

                    <H6 mb={0.5}>{item.city}</H6>
                    <Paragraph color="grey.700">{item.country}</Paragraph>
                    {item.address && (
                      <Paragraph color="grey.700">{item.address}</Paragraph>
                    )}
            
                    
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card1>

          <Card1
            sx={{
              mb: 3,
            }}
          >
             <Heading number={3} title="Payment Type" />
            <FormControlLabel
              name="cod"
              onChange={handlePaymentMethodChange}
              label={<Paragraph fontWeight={600}>Cash On Delivery</Paragraph>}
              control={
                <Radio
                  checked={paymentMethod === "cod"}
                  color="primary"
                  size="small"
                />
              }
            />
            <Divider
              sx={{
                mb: 3,
                mx: -4,
              }}
            />
            <FormControlLabel
              name="credit-card"
              // disabled={true}
              onChange={handlePaymentMethodChange}
              label={<Paragraph fontWeight={600}>Pay with Credit/Debit Card</Paragraph>}
              control={
                <Radio
                  checked={paymentMethod === "credit-card"}
                  color="primary"
                  size="small"
                />
              }
            />
        
            <Divider
              sx={{
                mb: 3,
                mx: -4,
              }}
            />

            <Button
              sx={{
                color: "primary.main",
                mt: 3,
                lineHeight: 1,
              }}
              onClick={toggleHasVoucher}
            >
              I have a voucher
            </Button>

            {hasVoucher && (
              <FlexBox mt={3} gap={2} maxWidth="400px">
               <span>Please Login to use coupon</span>
               
              </FlexBox>
            )}
            {getTotalPrice().toFixed(2) === '0.00' || cartList.length==0 || state.cart.length === 0 ?<Button
              fullWidth
              type="submit"
              disabled={true}
              // type="button"
             
              color="dark"
              variant="contained"
              sx={{
                mt: 3,
              }}
            >
              Place Order
            </Button>:(
<Button
              fullWidth
              type="submit"
              onClick={() =>{ 
                  // setFieldValue("paymentMethod", paymentMethod);
                  
                  if(!errors.name && !errors.email && !errors.phone && !errors.phone2){
                    if(values.address){
                      
                      return true
                      }
                      else{
                    
                        setAlertSeverity('warning');
                        setAlertMessage('Invalid Address! Select Address or Create a one to Place Order.');
                        setOpen(true);
                        return false
                      }
                    
                  }
                  else{
              
                    setAlertSeverity('error');
                    setAlertMessage('Fill all the blank fields.');
                    setOpen(true);
                    return false
                  }
            
                
              }
              }
              color="primary"
              variant="contained"
              disabled={props.isDisabled}
              sx={{
                mt: 3,
              }}
            >
              Place Order
            </Button>
            )}

            
          </Card1>
        </form>
      )}
    </Formik>
  );
}
 
};


const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  email: yup.string().required("required"),
  phone: yup.number().required("required"),
  phone2: yup.number().required("required"),
  address: yup.string().required("required"),
 
  voucher: yup.string(),
});
export default CheckoutForm2;
