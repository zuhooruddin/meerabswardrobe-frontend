import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Typography,
  MenuItem
} from "@mui/material";
import Box from "@mui/material/Box";
import { useFormik } from "formik";
import React, { useEffect,useState } from "react";
import * as yup from "yup";
import axios from "axios";
import useSWR from 'swr'

const checkoutSchema = yup.object({
  city: yup.string().required("Required"),
  country: yup.string().required("Required"),
  address: yup.string().required("Required"),
});

const EditAddressForm = (props) => {
  const {
    addressData,
    selected,
    setAddressData,
    openEditForm,
    setOpenEditForm,
  } = props;


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





  useEffect(() => {
    formik.setValues({
      city: selected?.city || "",
      country: selected?.country || "",
      address: selected?.address || "",
    });
  }, [selected]);

  const initialValues = {
    city: selected?.city || "",
    country: selected?.country || "",
    address: selected?.address || "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: checkoutSchema,
    onSubmit: (values) => {
      const updated = addressData.map((item) =>
        item.address === selected.address ? { ...item, ...values } : item
      );
      setAddressData(updated);
      setOpenEditForm(false);
    },
  });

  return (
    <Dialog open={openEditForm} onClose={() => setOpenEditForm(false)}>
      <DialogContent>
        <Typography variant="h6" mb={3}>
          Edit Address Information
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Box mb={3}>
            <Grid container spacing={3}>
            <Grid item sm={6} xs={12}>
              <TextField
        select
        fullWidth
        color="info"
        size="medium"
        name="country"
        value={formik.values.country}
        onChange={(event) => {
          formik.handleChange(event);
          handleChangeCountry(event); 
        }}
        label="Country"
        error={!!formik.touched.country && !!formik.errors.country}
        helperText={formik.touched.country && formik.errors.country}
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
        value={formik.values.city}
        onChange={formik.handleChange}
        label="City"
        error={formik.touched.city && Boolean(formik.errors.city)}
        helperText={formik.touched.city && formik.errors.city}
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
                  type="text"
                  name="address"
                  label="Complete Address"
                  value={formik.values.address}
                  inputProps={{ maxLength: 150 }}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>
            </Grid>
          </Box>

          <Button color="primary" variant="contained" type="submit">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAddressForm;
