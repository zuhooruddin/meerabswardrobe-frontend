import { Grid, Pagination, Box } from "@mui/material";
import { FlexBetween, FlexBox, FlexRowCenter } from "components/flex-box";
import SearchCard1 from "components/product-cards/SearchCard1";
import CircularProgress from '@mui/material/CircularProgress';
import { Span, H3 } from "components/Typography";
import React, { Fragment, useState, useEffect } from "react";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import useSWR from 'swr';
import axios from "axios";
import { Select, MenuItem } from '@mui/material';
import { useSession, signIn, signOut } from 'next-auth/react';

const SearchCard1List = ({ category,ProductReviews}) => {
  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortOption, setSortOption] = useState('');
  const { data: session} = useSession()

  const fetcher = async (url) => await axios.get(url).then((res) => res.data);
  const { data, error } = useSWR(server_ip + `getAllWebsitePaginatedItems?page=${pageIndex}&search=${category}&pageSize=${pageSize}&sort=${sortOption}`, fetcher);

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

  return (
    <Fragment>
      <FlexBox sx={{ mt: -2, mb: 1 }} alignItems="flex-end" justifyContent="flex-end" flexWrap="wrap" mt={4}>
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          sx={{
            minWidth: 120,
            color: 'primary.main',
            '& .MuiSelect-icon': {
              color: 'primary.main',
            },
          }}
        >
          <MenuItem value={15} sx={{ color: 'primary.main' }}>15 per page</MenuItem>
          <MenuItem value={25} sx={{ color: 'primary.main' }}>25 per page</MenuItem>
          <MenuItem value={50} sx={{ color: 'primary.main' }}>50 per page</MenuItem>
          <MenuItem value={100} sx={{ color: 'primary.main' }}>100 per page</MenuItem>
        </Select>

        <FormControl sx={{ml:2}}>
  <InputLabel htmlFor="sorting-select" sx={{ marginTop: '-2px' }}>
    Sort By
  </InputLabel>
  <Select
    value={sortOption}
    onChange={handleSortOptionChange}
    sx={{
      minWidth: 120,
      
      color: 'primary.main',
      '& .MuiSelect-icon': {
        color: 'primary.main',
      },
    }}
    inputProps={{
      name: 'sorting',
      id: 'sorting-select',
    }}
  >
    <MenuItem value="default" sx={{ color: 'primary.main' }}>
      Default
    </MenuItem>
    <MenuItem value="asc" sx={{ color: 'primary.main' }}>
      Price (Low to High)
    </MenuItem>
    <MenuItem value="desc" sx={{ color: 'primary.main' }}>
      Price (High to Low)
    </MenuItem>
  </Select>
</FormControl>


      </FlexBox>

      {isLoading ? (
        <Box sx={{ display: 'flex' }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Fragment>
          <Grid container spacing={3}>
            {data && data['results'].length > 0 ? (
              data['results'].map((item, ind) => (
                <Grid item lg={3} sm={6} xs={12} key={ind}>
                  <SearchCard1 {...item} category={category} ProductReviews={ProductReviews} wishlist={session && session.wishlist &&  session.wishlist.length>0 ? session.wishlist : null} />
                </Grid>
              ))
            ) : (
              <Grid item lg={6} sm={6} xs={12}><H3 color="red" >No Product Found</H3></Grid>
            )}
          </Grid>

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

export default SearchCard1List;
