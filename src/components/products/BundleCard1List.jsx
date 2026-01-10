import { Grid, Pagination, Box } from "@mui/material";
import { FlexBetween } from "components/flex-box";
import BundleCard1 from "components/product-cards/BundleCard1";
import { Span } from "components/Typography";
import React, { Fragment } from "react"; // ========================================================
import { useState,useEffect } from "react";
import useSWR from 'swr'
import axios from "axios";
import { H5,H3, Paragraph } from "components/Typography";
import {
  getFrequentlyBought,
  getRelatedProducts,
} from "utils/api/related-products";
import api from "utils/api/market-2";
import CircularProgress from '@mui/material/CircularProgress';

// ========================================================

const BundleCard1List = ({category},props) => {
  
  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const [pageIndex, setPageIndex] = useState(1);

  const fetcher = async (url) => await axios.get(url).then((res) => res.data);
  const { data, error } = useSWR(server_ip+`getWebsitePagniatedBundlesForCategory?page=${pageIndex}&slug=${category['slug']}`, fetcher);

  if (error) <p>Loading failed...</p>;
  if (!data) <h1>Loading...</h1>;
  const handleChange = (event, value) => {
    setPageIndex(value);
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // height: '100vh',
  };


  return data? (
    <Fragment>
      <Grid container spacing={3}>
      {data && data['results'].length>0?
      data['results'].map((item, ind) => (
        <Grid item lg={3} sm={6} xs={12} key={ind}>

        <BundleCard1 key={ind} {...item} category={category} />
        </Grid>
      ))
      :   <Box ml={5}><H3 color="red">No Result Found</H3></Box>}

      </Grid>

      <FlexBetween flexWrap="wrap" mt={4}>
        <Span color="grey.600">Showing {data?((pageIndex-1)*12)+1:''}-{data?((pageIndex-1)*12) + data['results'].length:''} of {data?data['count']:''} Bundles</Span>
        <Pagination count={data?Math.ceil(data['count']/12):''} variant="outlined" color="primary" onChange={handleChange} />
        {/* <Span color="grey.600">Showing 1-9 of 1.3k Products</Span>
        <Pagination count={10} variant="outlined" color="primary" /> */}
        
      </FlexBetween>
      
    </Fragment>
  ):(
    <Box sx={{ display: 'flex' }}  style={containerStyle}>
    <CircularProgress />
  </Box>
  );
};
export async function getServerSideProps(context) {
  const slug = context.query['slug'];
  const bundleDetails = await api.getbundleitemDetail(slug);
  return {
    props: { bundle:bundleDetails["bundle"],bundleitems:bundleDetails["bundleItems"] },
  };
};

export default BundleCard1List;
