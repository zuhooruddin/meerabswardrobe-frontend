import { Done, ShoppingBag } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FlexBetween, FlexBox } from "components/flex-box";
import UserDashboardHeader from "components/header/UserDashboardHeader";
import Delivery from "components/icons/Delivery";
import PackageBox from "components/icons/PackageBox";
import TruckFilled from "components/icons/TruckFilled";
import CustomerDashboardLayout from "components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "components/layouts/customer-dashboard/Navigations";
import TableRow from "components/TableRow";
import { H5, H6, Paragraph } from "components/Typography";
import { format } from "date-fns";
import { Fragment } from "react";
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {useSession} from 'next-auth/react';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const StyledFlexbox = styled(FlexBetween)(({ theme }) => ({
  flexWrap: "wrap",
  marginTop: "2rem",
  marginBottom: "2rem",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
  "& .line": {
    height: 4,
    minWidth: 50,
    flex: "1 1 0",
    [theme.breakpoints.down("sm")]: {
      flex: "unset",
      height: 50,
      minWidth: 4,
    },
  },
}));

const OrderDetails = () => {
  const router = useRouter();
  const { id } = router.query
  const [isLoading, setIsLoading] = useState(true);

  const { data: session,status} = useSession();
  const [orderData,setOrderData] = useState([]);
  const [orderDatas,setOrderDatas] = useState([]);

  const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE+'getCustomerOrdersDes'
  const fetcher = (...args) =>   fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization":'Bearer '+session.accessToken
    },
    body: JSON.stringify({"id":id})
  }).then(res => res.json())
  .then((customerOrders) => {
    setOrderData(customerOrders);
    setIsLoading(false);
  }).catch((err) => {

});

  const { orders, error} =  useSWR(url, fetcher);

  

  let urls = process.env.NEXT_PUBLIC_BACKEND_API_BASE+'getOrderDetails'

  const fetchers = (...args) =>   fetch(urls, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization":'Bearer '+session.accessToken

      // "Authorization":'Bearer '+session.accessToken
    },
    body: JSON.stringify({"id":id})
  }).then(res => res.json())
  .then((customerOrders) => {
    setOrderDatas(customerOrders);
    setIsLoading(false);
  }).catch((err) => {
   
});

  const { order, errors} =  useSWR(urls, fetchers);
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // height: '100vh',
  };
  function myFunction(p1, p2,p3) {
    const total=parseInt(p2)+parseInt(p3);
    return total.toFixed(2);
  }
  function discount(p1, p2) {
    const total=parseInt(p1)-parseInt(p2);
    return total.toFixed(2)
  }

  const getTotalPrice = () => {
    return orderDatas.reduce((accum,item) =>accum+item.totalBill+item.deliveryCharges-item.discountedBill, 0);

  };
  
  const orderStatus = "shipping";
  const orderStatusList = ["packaging", "shipping", "delivering", "complete"];
  const stepIconList = [PackageBox, TruckFilled, Delivery];
  const statusIndex = orderStatusList.indexOf(orderStatus);
 
  return (

    
    <CustomerDashboardLayout>
      <UserDashboardHeader
        icon={ShoppingBag}
        title="Order Details"
        navigation={<CustomerDashboardNavigation />}
        button={
          <Button
          href="/"
            color="primary"
            sx={{
              bgcolor: "primary.light",
              px: 4,
            }}
          >
            Order Again
          </Button>
        }
      />

      <Card
        sx={{
          p: "2rem 1.5rem",
          mb: "30px",
        }}
      >
        <StyledFlexbox>
          {stepIconList.map((Icon, ind) => (
            <Fragment key={ind}>
              <Box position="relative">
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: ind <= statusIndex ? "primary.main" : "grey.300",
                    color: ind <= statusIndex ? "grey.white" : "primary.main",
                  }}
                >
                  <Icon
                    color="inherit"
                    sx={{
                      fontSize: "32px",
                    }}
                  />
                </Avatar>
                {ind < statusIndex && (
                  <Box position="absolute" right="0" top="0">
                    <Avatar
                      sx={{
                        width: 22,
                        height: 22,
                        bgcolor: "grey.200",
                        color: "success.main",
                      }}
                    >
                      <Done
                        color="inherit"
                        sx={{
                          fontSize: "1rem",
                        }}
                      />
                    </Avatar>
                  </Box>
                )}
              </Box>
              {ind < stepIconList.length - 1 && (
                <Box
                  className="line"
                  bgcolor={ind < statusIndex ? "primary.main" : "grey.300"}
                />
              )}
            </Fragment>
          ))}
        </StyledFlexbox>

      </Card>
      

      <Card
        sx={{
          p: 0,
          mb: "30px",
        }}
      >{
        
        isLoading ? (
          <Box sx={{ display: 'flex' }}  style={containerStyle} >
          <CircularProgress />
        </Box>
        ):
        orderData.length>0? orderData.map((item) => (
        <TableRow  key={item.id}
          sx={{
            
            p: "12px",
            borderRadius: 0,
            boxShadow: "none",
            bgcolor: "grey.200",
          }}
        >
          

         
        </TableRow>
  )):<Box ml={22} mt={10}><H5 color="red">No orders yet</H5></Box>}
        <Box py={1}>
          {
          isLoading ? (
            <Box sx={{ display: 'flex' }}  style={containerStyle} >
            <CircularProgress />
          </Box>
          ):
          orderData.length>0? 
          orderData.map((item) => (
            <FlexBox
              px={2}
              py={1}
              flexWrap="wrap"
              alignItems="center"
              key={item.id}
            >
              <FlexBox flex="2 2 260px" m={0.75} alignItems="center">
                <Avatar
                  src={item.item_type}
                  sx={{
                    height: 64,
                    width: 64,
                  }}
                />
                <Box ml={2.5}>
                  <H6 my="0px">{item.itemName}</H6>
                  <Typography fontSize="14px" color="grey.600">
                    {item.itemIndPrice} x {item.itemQty}
                  </Typography>
                </Box>
              </FlexBox>

            
            </FlexBox>
          )):<Box ml={22} mt={10}><H5 color="red">No orders yet</H5></Box>}
        </Box>
      </Card>
      {
      isLoading ? (
        <Box sx={{ display: 'flex' }}  style={containerStyle}>
        <CircularProgress />
      </Box>
      ):
      orderDatas.length>0?
      orderDatas.map((item) => (
      <Grid container spacing={3} key={item.id}>
        <Grid item lg={6} md={6} xs={12}  >
          <Card
            sx={{
              p: "20px 30px",
            }}
          >
            <H5 mt={0} mb={2}>
              Shipping Address
            </H5>

            <Paragraph fontSize={14} my={0}>
            {item.shippingAddress}
            </Paragraph>
          </Card>
        </Grid>

        <Grid item lg={6} md={6} xs={12}>
          <Card
            sx={{
              p: "20px 30px",
            }}
          >
            <H5 mt={0} mb={2}>
              Total Summary
            </H5>

            <FlexBetween mb={1}>
              <Typography fontSize={14} color="grey.600">
                Subtotal:
              </Typography>
              <H6 my="0px">{item.totalBill}</H6>
            </FlexBetween>

            <FlexBetween mb={1}>
              <Typography fontSize={14} color="grey.600">
                Shipping fee:
              </Typography>
              <H6 my="0px">{item.deliveryCharges}</H6>
            </FlexBetween>

            <FlexBetween mb={1}>
              <Typography fontSize={14} color="grey.600">
                Discount:
              </Typography>
              <H6 my="0px">{discount(item.totalBill,item.discountedBill)}</H6>
            </FlexBetween>

            <Divider
              sx={{
                mb: 1,
              }}
            />
        
            <FlexBetween mb={2}>
              <H6 my="0px">Total</H6>
              <H6 my="0px">Rs. {myFunction(item.totalBill,item.deliveryCharges,item.discountedBill)}</H6>
            </FlexBetween>

            <Typography fontSize={14}>Paid by {item.paymentMethod}</Typography>
          </Card>
        </Grid>
        
      </Grid>
      )):<Box ml={22} mt={10}><H5 color="red">No orders Details</H5></Box>}
    </CustomerDashboardLayout>
  );
};

export default OrderDetails;
