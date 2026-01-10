import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Typography,
  MenuItem
} from "@mui/material";
import { useFormik } from "formik";
import React, { Fragment, useState } from "react";
import * as yup from "yup";
import axios from "axios";
import useSWR from 'swr'

const checkoutSchema = yup.object({
  address: yup.string().required("required"),
  city: yup.string().required("required"),
  country: yup.string().required("required"),
});
const initialValues = {
  city: "",
  address: "",
  country: "",
}; // ==================================================================

// ==================================================================
const NewAddressForm = ({ setNewAddress,setFieldValue }) => {


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

  const [addCardForm, setAddCardForm] = useState(false);
  const { handleChange, handleSubmit, errors, touched, values } = useFormik({
    initialValues: initialValues,
    validationSchema: checkoutSchema,
    onSubmit: (values, { resetForm }) => {
      setNewAddress(values);
      //  (values);

      if (values) {
        setFieldValue('address',values['address']);
        setFieldValue('city',values['city']);
        setAddCardForm(false);
        resetForm(initialValues);
      }
    },
  });







  return (
    <Fragment>
      <Button
        color="primary"
        variant="outlined"
        sx={{
          p: "2px 20px",
        }}
        onClick={() =>
          addCardForm ? setAddCardForm(false) : setAddCardForm(true)
        }
      >
        Add New Address
      </Button>

      <Dialog open={addCardForm} onClose={() => setAddCardForm(false)}>
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
    </Fragment>
  );
};

export default NewAddressForm;
