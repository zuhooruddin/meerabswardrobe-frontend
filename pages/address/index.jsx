import { Delete, Place } from "@mui/icons-material";
import { Button, IconButton, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem ,Grid, Autocomplete,
} from "@mui/material";
import { FlexBox, FlexRowCenter } from "components/flex-box";
import UserDashboardHeader from "components/header/UserDashboardHeader";
import CustomerDashboardLayout from "components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "components/layouts/customer-dashboard/Navigations";
import TableRow from "components/TableRow";
import Link from "next/link";
import { H4 } from "components/Typography";
import Login from "pages-sections/sessions/Login";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import useSWR from 'swr'
import { useFormik } from "formik";
import * as yup from "yup";

const checkoutSchema = yup.object({
  address: yup.string().required("required"),
  city: yup.string().required("required"),
  country: yup.string().required("required"),
});
const initialValues = {
  city: "",
  address: "",
  country: "",
};

const AddressList = () => {
  const { data: session } = useSession();
  const { data: orderData, mutate: mutateOrderData } = useSWR(
    session ? [process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'getCustomerShipping', session.accessToken] : null,
    (url, accessToken) =>
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({ id: session.user.id }),
      })
        .then((res) => res.json())
        .catch((err) => {
          console.error(err);
        })
  );
 



  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [cityData,setcityData] = useState([]);

  const fetcher = async (url) => await axios.get(url).then((res) => res.data);

  const { data, error } = useSWR(process.env.NEXT_PUBLIC_BACKEND_API_BASE+`getwebcountries`, fetcher);


  const [cities, setCities] = useState([]);



  const handleChangeCountry = async (event) => {
    const selectedCountry = event.target.value;

    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_API_BASE+`getwebcities?country=${selectedCountry}`
      );


      setCities(response.data.citylist);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };







  const cityOptions = Array.isArray(cityData) ? cityData.map((city) => city.name) : [];
  const [newCity, setNewCity] = useState('ISLAMABAD');


  
  
  const deleteCustomerShipping = async (shippingId, index) => {
    try {
      await fetch(process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'deleteCustomerShipping', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        
            Authorization: 'Bearer ' + session.accessToken,
       
        },
        body: JSON.stringify({
          id: session.user.id,
          shipping: shippingId,
        }),
      });

      mutateOrderData((prevList) => {
        const newList = [...prevList];
        newList.splice(index, 1);
        return newList;
      });
      toast.error("Address Deleted Successfully", {position: toast.POSITION.TOP_RIGHT});

    } catch (err) {
      console.error(err);
      toast.error(err, {position: toast.POSITION.TOP_RIGHT});

    }
  };
  const { handleChange, handleSubmit, errors, touched, values } = useFormik({
    initialValues: initialValues,
    validationSchema: checkoutSchema,
    onSubmit: async (values, { resetForm }) => {

console.log("Values",values)


      try {
        const formData = new FormData();
        formData.append('country', values.country);
        formData.append('city', values.city);
        formData.append('address', values.address);
       
        formData.append('user_id', session.user.id);
    
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'addCustomerShipping', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + session.accessToken,
          },
          body: formData,
        });
    
        if (!response.ok) {
          throw new Error('Failed to add address');
        }
    
        const updatedOrderData = await response.json();
    
        mutateOrderData(updatedOrderData);
    
        setDialogOpen(false);
    
        values.country='';
        values.city='';
        values.address=''
    
        toast.success("Address Added Successfully", {position: toast.POSITION.TOP_RIGHT});
      } catch (error) {
        console.error(error);
      }
  
    },
  });
 
  if (session && "error" in session && session.error === "SessionTimedOut") {
    signOut();
    return (
      <FlexRowCenter flexDirection="column" minHeight="100vh">
        <Login />
      </FlexRowCenter>
    );
  }

  if (session) {
    if (!orderData) {
      return <div>Loading...</div>;
    }

    return (
      <CustomerDashboardLayout>
        <UserDashboardHeader
          icon={Place}
          title="My Addresses"
          navigation={<CustomerDashboardNavigation />}
          button={
            <Button
              color="primary"
              sx={{
                bgcolor: "primary.light",
                px: 4,
              }}
              onClick={() => setDialogOpen(true)}
            >
              Add New Address
            </Button>
          }
        />

        {/* Existing Addresses */}
        {orderData.length > 0 ? (
          orderData.map((item, index) => (
            <TableRow
              sx={{
                my: 2,
                padding: "6px 18px",
              }}
              key={item}
            >
              <Typography whiteSpace="pre" m={0.75} textAlign="left">
                {item.address}
              </Typography>

              <Typography flex="1.9  1.9 250px !important" m={0.75} textAlign="left">
                {item.area}
              </Typography>

              <Typography whiteSpace="pre" textAlign="center" color="grey.700">
                <IconButton 
                  onClick={() => deleteCustomerShipping(item.id, index)}
                  aria-label={`Delete address ${item.address}`}
                  sx={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <Delete fontSize="small" color="inherit" />
                </IconButton>
              </Typography>
            </TableRow>
          ))
        ) : (
          <Box ml={5}>
            <H4 color="red">No Address Found</H4>
          </Box>
        )}

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth={true} maxWidth="sm" style={{ minWidth: '300px' }}>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogContent>
          <Typography variant="h6" mb={3}>
            Add New Address Information
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
            <Grid item sm={6} xs={12}>
            <TextField
        select
        fullWidth
        color="info"
        size="medium"
        name="country"
        value={values.country}
        onChange={(event) => {
          handleChange(event);
          handleChangeCountry(event); 
        }}
        label="Country"
        error={!!touched.country && !!errors.country}
        helperText={touched.country && errors.country}
      >
        {data && data.countrylist
          ? data.countrylist.map((country) => (
              <MenuItem key={country.id} value={country.name}>
                {country.name}
              </MenuItem>
            ))
          : ""}
      </TextField>
</Grid>
              <Grid item sm={6} xs={12}>
              <TextField
        select
        fullWidth
        color="info"
        size="medium"
        name="city"
        value={values.city}
        onChange={handleChange}
        label="City"
        error={!!touched.city && !!errors.city}
        helperText={touched.city && errors.city}
      >
        {cities&&cities?cities.map((city) => (
          <MenuItem key={city.id} value={city.name}>
            {city.name}
          </MenuItem>
        )):''}
      </TextField>
              </Grid>

   

              <Grid item sm={12} xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  inputProps={{ maxLength: 150 }}
                  type="text"
                  name="address"
                  label="Complete Address"
                  value={values.address}
                  onChange={handleChange}
                  helperText={touched.address && errors.address}
                  error={touched.address && Boolean(errors.address)}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <Button color="primary" variant="contained" type="submit">
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        
        </Dialog>
      </CustomerDashboardLayout>
    );
  }

  if (!orderData || orderData.length === 0) {
    return (
      <FlexRowCenter flexDirection="column" minHeight="100vh">
        <Login />
      </FlexRowCenter>
    );
  }
};

export default AddressList;
