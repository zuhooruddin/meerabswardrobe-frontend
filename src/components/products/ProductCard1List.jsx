import { Grid, Pagination, Box } from "@mui/material";
import { FlexRowCenter, FlexBox } from "components/flex-box";
import CircularProgress from '@mui/material/CircularProgress';
import { Span, H3 } from "components/Typography";
import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import useSWR from 'swr'
import axios from "axios";
import { Select, MenuItem } from '@mui/material';
import ProductCard1 from "components/product-cards/ProductCard1";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from 'next-auth/react';
import Head from "next/head";

const ProductCard1List = ({ category,ProductReviews }) => {


  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [scrollFlag, setScrollFlag] = useState(false);
  const [sorting, setSorting] = useState('Default'); // New state for sorting value
  const { data: session} = useSession()
  useEffect(() => {
    if (router.asPath+'__pp' in sessionStorage) {
      const { pageIndexRoute, pageSizeRoute, scrollPos, sorting } = JSON.parse(sessionStorage.getItem(router.asPath+'__pp'));
        // if ('scrollRestoration' in window.history) {
        const handleRouteChange = (url) => {
    
          // Check if the user is navigating back to this page
          if (url === router.asPath) {
            // Update the pageIndex state with a new value
            if(pageIndexRoute){setPageIndex(pageIndexRoute)}
            if(pageSizeRoute){setPageSize(pageSizeRoute)}
            if(scrollPos){setScrollFlag(true)}
            if(sorting){setSorting(sorting)}
          }
        
        };
        const handleRouteChangeClear = (url) => {
          // Check if the user is navigating back to this page
          if (url === router.asPath) {
            if(pageIndexRoute || pageSizeRoute){
              sessionStorage.removeItem(router.asPath+'__pp')
            }
          }
        
        };
        // Listen to the 'routeChangeComplete' event
        router.events.on('routeChangeComplete', handleRouteChange);
    
        // Clean up the event listener
        return () => {
          router.events.off('routeChangeComplete', handleRouteChangeClear);
        };
      }
      }, []);
const getCurrentScrollPosition = () => {
  return window.pageYOffset;
}


  const fetcher = async (url) => await axios.get(url).then((res) => res.data);
  const { data, error } = useSWR(server_ip + `PaginatedCategorys?page=${pageIndex}&slug=${category['slug']}&pageSize=${pageSize}&sort=${sorting}`, fetcher);
  if (error) <p>Loading failed...</p>;
  if (!data) <h1>Loading...</h1>;
  if(data && scrollFlag){
    const { scrollPos } = JSON.parse(sessionStorage.getItem(router.asPath+'__pp'));
    setTimeout(() => {window.scrollTo(0, parseInt(scrollPos));}, 0);
    setScrollFlag(false);
    sessionStorage.setItem(router.asPath+'__pp', JSON.stringify({}));

  }

  const handleChange = (event, value) => {
    setPageIndex(value);
  };

  const pf = data ? data.publisherFlag : '';

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setPageIndex(1);
  };
  const handleSortingChange = (event) => {
    setSorting(event.target.value);
    setPageIndex(1);
  };

  useEffect(() => {
    setPageIndex(1);
  }, [category]);

  return data ? (
    <Fragment>
      <FlexBox sx={{ mt: -2, mb: 1 }} alignItems="flex-end" justifyContent="flex-end" flexWrap="wrap" mt={4}>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Display</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Products"

            value={pageSize}
            onChange={handlePageSizeChange}
            sx={{
              minWidth: 50,
              color: 'primary.main',
              '& .MuiSelect-icon': {
                color: 'primary.main',
              },
            }}
          >
            <MenuItem value={15} sx={{ color: 'primary.main' }}>15</MenuItem>
            <MenuItem value={25} sx={{ color: 'primary.main' }}>25</MenuItem>
            <MenuItem value={50} sx={{ color: 'primary.main' }}>50</MenuItem>
            <MenuItem value={100} sx={{ color: 'primary.main' }}>100</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ml:2}}>
          <InputLabel id="sorting-select-label">Sort By</InputLabel>
          <Select
            labelId="sorting-select-label"
            id="sorting-select"
            label="Sort By"
            value={sorting}
            onChange={handleSortingChange}
            sx={{
              minWidth: 120,
              color: 'primary.main',
              '& .MuiSelect-icon': {
                color: 'primary.main',
              },
            }}
          >
            <MenuItem value="Default">Default</MenuItem>
            <MenuItem value="price_asc">Price (Low to High)</MenuItem>
            <MenuItem value="price_desc">Price (High to Low)</MenuItem>
            {/* Add more sorting options as needed */}
          </Select>
        </FormControl>
      </FlexBox>
      {/* SEO Pagination Links */}
      {data && (
        <Head>
          {pageIndex > 1 && (
            <link rel="prev" href={`${router.asPath.split('?')[0]}?page=${pageIndex - 1}${sorting !== 'Default' ? `&sort=${sorting}` : ''}`} />
          )}
          {pageIndex < Math.ceil(data['count'] / pageSize) && (
            <link rel="next" href={`${router.asPath.split('?')[0]}?page=${pageIndex + 1}${sorting !== 'Default' ? `&sort=${sorting}` : ''}`} />
          )}
        </Head>
      )}

      <Grid container spacing={3}>
        {data && data['results'].length > 0 ?
          data['results'].map((item, ind) => (
            <Grid item lg={3} sm={6} xs={12} key={ind}>
      <ProductCard1 {...item} category={category} publisherFlag={pf} pageIndex={pageIndex} pageSize={pageSize} getCurrentScrollPosition={getCurrentScrollPosition} sorting={sorting} ProductReviews={ProductReviews} wishlist={session && session.wishlist &&  session.wishlist.length>0 ? session.wishlist : null} />
            </Grid>
          ))
          :
          <Grid item lg={6} sm={6} xs={12}><H3 color="red" >No Product Found</H3></Grid>
        }
      </Grid>
      <FlexRowCenter style={{ marginTop: '2%' }}>
        <Pagination count={data ? Math.ceil(data['count'] / pageSize) : ''} variant="outlined" color="primary" onChange={handleChange} pageSize={pageSize} page={pageIndex} />
      </FlexRowCenter>
      <FlexRowCenter style={{ marginTop: '1%' }}>
        <Span color="grey.600">Showing {data ? ((pageIndex - 1) * pageSize) + 1 : ''}-{data ? ((pageIndex - 1) * pageSize) + data['results'].length : ''} of {data ? data['count'] : ''} Products</Span>
      </FlexRowCenter>

    </Fragment>
  ) : (
    <Box sx={{ display: 'flex' }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
    </Box>
  );
};

export default ProductCard1List;