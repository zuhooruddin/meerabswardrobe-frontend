import { Pagination, Box } from "@mui/material";
import { FlexBetween, FlexBox, FlexRowCenter } from "components/flex-box";
import SearchCard9 from "components/product-cards/SearchCard9";
import React, { useState, useEffect, Fragment } from "react";
import { Span } from "../Typography";
import useSWR from 'swr';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { Select, MenuItem } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useSession, signIn, signOut } from 'next-auth/react';

const SearchCard9List = ({ category,ProductReviews }) => {
  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortOption, setSortOption] = useState('');
  const { data: session} = useSession()

  const fetcher = async (url) => await axios.get(url).then((res) => res.data);
  // Properly encode the search query to handle special characters and spaces
  const encodedCategory = category ? encodeURIComponent(category.trim()) : '';
  const searchUrl = server_ip + `getAllWebsitePaginatedItems?page=${pageIndex}&pageSize=${pageSize}&sort=${sortOption}${encodedCategory ? `&search=${encodedCategory}` : ''}`;
  const { data, error } = useSWR(searchUrl, fetcher);

  const isLoading = !data && !error;

  const handleChange = (event, value) => {
    setPageIndex(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setPageIndex(1);
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  useEffect(() => {
    setPageIndex(1);
  }, [category]);

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <Fragment>
      <FlexBox sx={{ mt: -2, mb: 1 }} alignItems="flex-end" justifyContent="flex-end" flexWrap="wrap" mt={4}>
        
      <FormControl>
  <InputLabel id="pageSize-select-label">Display</InputLabel>
  <Select
    labelId="pageSize-select-label"
    id="pageSize-select"
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
    <MenuItem value={15}>15</MenuItem>
    <MenuItem value={25}>25</MenuItem>
    <MenuItem value={50}>50</MenuItem>
    <MenuItem value={100}>100</MenuItem>
  </Select>
  {/* <FormHelperText>Select the number of products to display</FormHelperText> */}
</FormControl>
<FormControl sx={{ marginLeft: 2 }}>
  <InputLabel sx={{ marginTop: '-2px' }} id="sort-by-select-label">
    Sort By
  </InputLabel>
  <Select
    labelId="sort-by-select-label"
    id="sorting-select"
    value={sortOption}
    onChange={handleSortOptionChange}
    sx={{
      minWidth: 150,
      color: 'primary.main',
      '& .MuiSelect-icon': {
        color: 'primary.main',
      },
    }}
  >
    <MenuItem value="default">Default</MenuItem>
    <MenuItem value="asc">Price (Low to High)</MenuItem>
    <MenuItem value="desc">Price (High to Low)</MenuItem>
  </Select>
</FormControl>

      </FlexBox>

      {isLoading ? (
        <Box sx={{ display: 'flex' }} style={containerStyle}>
          <CircularProgress />
        </Box>
      ) : (
        <Fragment>
          {data && data['results'].length > 0 ? (
            data['results'].map((item, ind) => (
              <SearchCard9 key={ind} {...item} category={category} ProductReviews={ProductReviews} wishlist={session && session.wishlist &&  session.wishlist.length>0 ? session.wishlist : null}  />
            ))
          ) : (
            <Box sx={{ display: 'flex' }} style={containerStyle}>
              <h3>No Product Found</h3>
            </Box>
          )}

          <FlexRowCenter style={{ marginTop: '2%' }}>
            <Pagination count={data ? Math.ceil(data['count'] / pageSize) : ''} variant="outlined" color="primary" onChange={handleChange} pageSize={pageSize} page={pageIndex} />
          </FlexRowCenter>
          <FlexRowCenter style={{ marginTop: '1%' }}>
            <Span color="grey.600">Showing {data ? ((pageIndex - 1) * pageSize) + 1 : ''}-{data ? ((pageIndex - 1) * pageSize) + data['results'].length : ''} of {data ? data['count'] : ''} Products</Span>
          </FlexRowCenter>
        </Fragment>
      )}
    </Fragment>
  );
};

export default SearchCard9List;
