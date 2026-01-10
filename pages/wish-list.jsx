import Favorite from "@mui/icons-material/Favorite";
import { Button, Grid, Pagination,Box } from "@mui/material";
import { FlexBox } from "components/flex-box";
import UserDashboardHeader from "components/header/UserDashboardHeader";
import CustomerDashboardLayout from "components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "components/layouts/customer-dashboard/Navigations";
import ProductCard1 from "components/product-cards/ProductCard1";
import SEO from "components/SEO";
import productDatabase from "data/product-database";
import useSWR from 'swr';
import {useSession} from 'next-auth/react';
import { useState } from 'react';
import { H5,H4,H2 } from "components/Typography";
import { signOut } from "next-auth/react"
import { FlexRowCenter } from "components/flex-box";
import Login from "pages-sections/sessions/Login";
import Link from "next/link";
import CircularProgress from '@mui/material/CircularProgress';
import api from "utils/api/market-2";

const WishList = (props) => {
  const { data: session,status} = useSession({required:true});
  const [orderData,setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {ProductReviews } = props;
  const [sorting, setSorting] = useState('Default'); // New state for sorting value


  const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE+'getWishlists'
  const fetcher = (...args) =>   fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization":'Bearer '+session.accessToken
    },
    body: JSON.stringify({"id":session.user.id})
  }).then(res => res.json())
  .then((customerOrders) => {
    setOrderData(customerOrders);
    setIsLoading(false);
  }).catch((err) => {
     (err);
});
const getCurrentScrollPosition = () => {
  return window.pageYOffset;
}
  const { orders, error} =  useSWR(url, fetcher);
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // height: '100vh',
  };
  const imgbaseurl='media/'

  if (session && 'error' in session && session.error== "SessionTimedOut"){

     ("You have been logged out as your session was outdated. Please login again to continue shopping.");
    signOut({redirect: false});
    // route(/login);
    return(
      <FlexRowCenter flexDirection="column" minHeight="100vh">
      
      <Login />
      <Link href='/'>Back to Home</Link>
    </FlexRowCenter>
    ) 
  }
  else if(session){
  return (
    <CustomerDashboardLayout>
      <SEO title="Wishlist" />
      <UserDashboardHeader
        icon={Favorite}
        title="My Wish List"
        navigation={<CustomerDashboardNavigation />}
        // button={
        //   <Button
        //     color="primary"
        //     sx={{
        //       px: 4,
        //       bgcolor: "primary.light",
        //     }}
        //   >
        //     Add All to Cart
        //   </Button>
        // }
      />

      <Grid container spacing={3}>
        { isLoading ? (
          <Box sx={{ display: 'flex' }}  style={containerStyle} ml={55}>
          <CircularProgress />
        </Box>
        ):
        orderData.length>0?
        orderData.map((item) => (
          item.image=item.image,
          <Grid item lg={4} sm={6} xs={12} key={item.id}>
            <ProductCard1 {...item} getCurrentScrollPosition={getCurrentScrollPosition} sorting={sorting}  ProductReviews={ProductReviews &&ProductReviews?ProductReviews :[] } />
          </Grid>
        )):<Box ml={5} ><H4 color="red">No item in Wishlist</H4></Box>
        
        }
      </Grid>

  
    </CustomerDashboardLayout>
  );
  
}
return (
  <FlexRowCenter flexDirection="column" minHeight="100vh">

    <Login />
    <Link href='/'>Back to Home</Link>
  </FlexRowCenter>
)
};


export async function getServerSideProps(context) {
  

  const ProductReviews=await api.getReviews()
 
  return {
    props: {ProductReviews },
  };
}

export default WishList;
