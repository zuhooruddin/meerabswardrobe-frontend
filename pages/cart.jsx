import { Button, Card, Divider, Grid, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import { FlexBetween, FlexBox } from "components/flex-box";
import CheckoutNavLayout from "components/layouts/CheckoutNavLayout";
import ProductCard7 from "components/product-cards/ProductCard7";
import SEO from "components/SEO";
import { Span } from "components/Typography";
import { useAppContext } from "contexts/AppContext";
import countryList from "data/countryList";
import Link from "next/link";
import {  useEffect, useState } from "react";

const Cart = () => {
  const { state } = useAppContext();
  const cartList = state.cart;

  const getTotalPrice = () => {
    return cartList.reduce(
      (accum, item) => accum + item.salePrice * item.qty,
      0
    );
  };

  const[currency,setCurrency]=useState('')

  useEffect(()=>{

    if (typeof window !== 'undefined' && window.localStorage) {
      const storedCurrency = localStorage.getItem('currency');

      setCurrency(storedCurrency);
    }
  },[])

  return (
    <CheckoutNavLayout>
      <SEO title="Cart" metaTitle="Cart - Online Book Store" />
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          {cartList.map((item) => (
            <ProductCard7 key={item.id} {...item} />
          ))}
        </Grid>

        <Grid item md={4} xs={12}>
          <Card
            sx={{
              padding: 3,
            }}
          >
            <FlexBetween mb={2}>
              <Span color="grey.600">Total:</Span>

              <Span fontSize={18} fontWeight={600} lineHeight="1">
               {currency}. {getTotalPrice().toFixed(2)}
              </Span>
            </FlexBetween>

            <Divider
              sx={{
                mb: 2,
              }}
            />

            {/* <FlexBox alignItems="center" columnGap={1} mb={2}>
              <Span fontWeight="600">Additional Comments</Span>

              <Span
                p="6px 10px"
                fontSize={12}
                lineHeight="1"
                borderRadius="3px"
                color="primary.main"
                bgcolor="primary.light"
              >
                Note
              </Span>
            </FlexBox> */}

            {/* <TextField
              variant="outlined"
              rows={6}
              fullWidth
              multiline
              sx={{
                mb: 2,
              }}
            /> */}

            <Divider
              sx={{
                mb: 2,
              }}
            />

            {/* <TextField
              fullWidth
              size="small"
              label="Voucher"
              variant="outlined"
              placeholder="Voucher"
            />

            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                mb: 4,
              }}
            >
              Apply Voucher
            </Button>

            <Divider
              sx={{
                mb: 2,
              }}
            /> */}

            {/* <Span fontWeight={600} mb={2} display="block">
              Shipping Estimates
            </Span> */}

            {/* <Autocomplete
              fullWidth
              sx={{
                mb: 2,
              }}
              options={countryList} // getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Country"
                  variant="outlined"
                  placeholder="Select Country"
                />
              )}
            /> */}

            {/* <TextField
              select
              fullWidth
              size="small"
              label="State"
              variant="outlined"
              placeholder="Select State"
              defaultValue="new-york"
            >
              {stateList.map((item) => (
                <MenuItem value={item.value} key={item.label}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField> */}

            {/* <TextField
              fullWidth
              size="small"
              label="Zip Code"
              placeholder="3100"
              variant="outlined"
              sx={{
                mt: 2,
              }}
            /> */}

            {/* <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{
                my: 2,
              }}
            >
              Calculate Shipping
            </Button> */}

            {getTotalPrice().toFixed(2) == 0.0 ? (
              <Link href="" passHref>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={true}
                >
                  Checkout Now
                </Button>
              </Link>
            ) : (
              <Link href="/checkout" passHref>
                <Button variant="contained" color="primary" fullWidth>
                  Checkout Now
                </Button>
              </Link>
            )}

            <br />
            <br />
            <div style={{ marginTop: "1%" }}>
              <Link href="/" passHref>
                <Button variant="outlined" color="primary" fullWidth>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </Card>
        </Grid>
      </Grid>
    </CheckoutNavLayout>
  );
};

const stateList = [
  {
    value: "new-york",
    label: "New York",
  },
  {
    value: "chicago",
    label: "Chicago",
  },
];
export default Cart;
