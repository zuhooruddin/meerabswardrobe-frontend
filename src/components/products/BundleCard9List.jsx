import { FlexBetween } from "components/flex-box";
import BundleCard9 from "components/product-cards/BundleCard9";
import { Grid, Pagination,Box} from "@mui/material";
import { Span } from "../Typography"; // ==========================================================
import useSWR from 'swr'
import { H5,H3, Paragraph } from "components/Typography";
import axios from "axios";
import { useState,useEffect } from "react";
import React, { Fragment } from "react"; // ========================================================
import CircularProgress from '@mui/material/CircularProgress';

// ==========================================================
const BundleCard9List = ({category}) => {
  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const [pageIndex, setPageIndex] = useState(1);


  const fetcher = async (url) => await axios.get(url).then((res) => res.data);
  const { data, error } = useSWR(server_ip+`getWebsitePagniatedBundlesForCategory?page=${pageIndex}&slug=${category['slug']}`, fetcher);


  if (error) <p>Loading failed...</p>;
  if (!data) <h1>Loading...</h1>;

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // height: '100vh',
  };

  const handleChange = (event, value) => {
    setPageIndex(value);
  };
  return data?(
    <div>
      {data && data['results'].length>0?
      data['results'].map((item, ind) => (
        <BundleCard9 key={ind} {...item} category={category} />
      ))
      :<Box ml={5}><H3 color="red">No Result Found</H3></Box>}

      <FlexBetween flexWrap="wrap" mt={4}>
        <Span color="grey.600">Showing {data?((pageIndex-1)*12)+1:''}-{data?((pageIndex-1)*12) + data['results'].length:''} of {data?data['count']:''} Bundles</Span>
        <Pagination count={data?Math.ceil(data['count']/12):''} variant="outlined" color="primary" onChange={handleChange} />
        {/* <Span color="grey.600">Showing 1-9 of 1.3k Products</Span>
        <Pagination count={10} variant="outlined" color="primary" /> */}
      </FlexBetween>
    </div>
  ):(
<Box sx={{ display: 'flex' }}  style={containerStyle}>
    <CircularProgress />
  </Box>
);
};

export default BundleCard9List;
