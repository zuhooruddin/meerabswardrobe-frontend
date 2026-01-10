import { Pagination, Box } from "@mui/material";
import TableRow from "components/TableRow";
import { H5, H4, H2 } from "components/Typography";
import { Fragment } from "react";
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import OrderRow from "./OrderRow";


const OrderList = () => {
  const { data: session, status } = useSession();
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'getCustomerOrders'
  const fetcher = (...args) => fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + session.accessToken
    },
    body: JSON.stringify({ "id": session.user.id })
  }).then(res => res.json())
    .then((customerOrders) => {
      setOrderData(customerOrders);
      setIsLoading(false);
    }).catch((err) => {

    });


  const { orders, error } = useSWR(url, fetcher);


  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // height: '100vh',
  };
   if (session) {

    return (
      <Fragment>
        <TableRow
          elevation={0}
          sx={{
            padding: "0px 18px",
            background: "none",
            display: {
              xs: "none",
              md: "flex",
            },
          }}
        >
          <H5 color="grey.600" my={0} mx={0.75} textAlign="left">
            Order #
          </H5>

          <H5 color="grey.600" my={0} mx={0.75} textAlign="left">
            Status
          </H5>

          <H5 color="grey.600" my={0} mx={0.75} textAlign="left">
            Date purchased
          </H5>

          <H5 color="grey.600" my={0} mx={0.75} textAlign="left">
            Total
          </H5>
          <H5 flex="0 0 0 !important" color="grey.600" px={2.75} my={0} />
        </TableRow>
        { isLoading ? (
          <Box sx={{ display: 'flex' }}  style={containerStyle} mt={5}>
          <CircularProgress />
        </Box>
        ):
         
            orderData.length > 0 ? orderData.map((item, ind) => (
              <OrderRow item={item} key={ind} />
            )) : <Box style={containerStyle} mt={12}><H5 color="red">No orders yet</H5></Box>

           
        }
      </Fragment>
    ) 
  }
}
export default OrderList;
