import { Pagination, Box } from "@mui/material";
import { FlexBetween, FlexBox } from "components/flex-box";
import ProductCard9 from "components/product-cards/ProductCard9";
import React from "react";
import { Span } from "../Typography";
import { useState, useEffect } from "react";
import { Fragment } from "react";
import { FormControl, InputLabel } from "@mui/material";
import useSWR from 'swr';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { Select, MenuItem } from '@mui/material';
import { useSession, signIn, signOut } from 'next-auth/react';

const ProductCard9List = ({ category,ProductReviews }) => {
  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortOption, setSortOption] = useState('');
  const fetcher = async (url) => await axios.get(url).then((res) => res.data);
  const { data, error } = useSWR(server_ip + `PaginatedCategorys?page=${pageIndex}&slug=${category['slug']}&pageSize=${pageSize}&sort=${sortOption}`, fetcher);
  const { data: session} = useSession()

  const handleChange = (event, value) => {
    setPageIndex(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setPageIndex(1);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setPageIndex(1);
  };

  useEffect(() => {
    setPageIndex(1);
  }, [category]);

  return (
    <Fragment>
      <FlexBox sx={{ mt: -2, mb: 1 }} alignItems="flex-end" justifyContent="flex-end" flexWrap="wrap" mt={4}>
        <FormControl>
          <InputLabel id="display-label">Display</InputLabel>
          <Select
            labelId="display-label"
            id="display-select"
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
          <InputLabel id="sort-label">Sort</InputLabel>
          <Select
            labelId="sort-label"
            id="sort-select"
            label="Sort"
            value={sortOption}
            onChange={handleSortChange}
            sx={{
              minWidth: 120,
              color: 'primary.main',
              '& .MuiSelect-icon': {
                color: 'primary.main',
              },
            }}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="price_asc">Price (Low to High)</MenuItem>
            <MenuItem value="price_desc">Price (High to Low)</MenuItem>
          </Select>
        </FormControl>
      </FlexBox>

      {data ? (
        data.results.map((item, ind) => (
          <ProductCard9 key={ind} {...item} category={category}   ProductReviews={ProductReviews} wishlist={session && session.wishlist &&  session.wishlist.length>0 ? session.wishlist : null} 
          />
        ))
      ) : (
        <p>No products found.</p>
      )}

      <FlexBetween flexWrap="wrap" mt={4}>
        <Span color="grey.600">
          Showing {data ? ((pageIndex - 1) * pageSize) + 1 : ''}-{data ? ((pageIndex - 1) * pageSize) + data.results.length : ''} of {data ? data.count : ''} Products
        </Span>
        <Pagination
          count={data ? Math.ceil(data.count / pageSize) : ''}
          variant="outlined"
          color="primary"
          onChange={handleChange}
          pageSize={pageSize}
          page={pageIndex}
        />
        <FormControl>
          <InputLabel id="display-label-bottom">Display</InputLabel>
          <Select
            labelId="display-label-bottom"
            id="display-select-bottom"
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
      </FlexBetween>
    </Fragment>
  );
};

export default ProductCard9List;
