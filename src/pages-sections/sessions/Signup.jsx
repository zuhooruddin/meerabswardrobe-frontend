import { Checkbox, FormControlLabel } from "@mui/material";
import BazaarButton from "components/BazaarButton";
import BazaarTextField from "components/BazaarTextField";
import { H3, H6, Small } from "components/Typography";
import { useFormik } from "formik";
import React, { useCallback, useState,useContext } from "react";
import * as yup from "yup";
import EyeToggleButton from "./EyeToggleButton";
import { Wrapper } from "./Login";
import SocialButtons from "./SocialButtons";
import AuthenticationContext from '../../../context/AuthenticationContext'
import {useRouter} from 'next/router'
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { toast } from 'react-toastify';



const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const phoneNumberRegex = /^(\+92|0)?(3\d{2}|5\d{2}|6\d{2}|7\d{2}|8\d{2}|9\d{2})\d{7}$/;

  const router = useRouter()
  const {register} = useContext(AuthenticationContext)
  const [loginError, setLoginError] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible);
  }, []);

  const handleFormSubmit = async (values) => {
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    const body = {
      username: values.email,
      email: values.email,
      password: values.password,
      fullName: fullName,
      address: address,
      phone: phone
    }
    // call nextjs api function to create a user
    await axios.post(process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'registerUser', body, config)
      .then(function (result) {
        if (result.error !== null) {
          if (result.data.ErrorCode === 1) {
            setLoginError(
              <Alert variant="filled" severity="error">
                User already exist please use different Email
              </Alert>
            );
          } else {
            toast.success("Account Created Successfully", { position: toast.POSITION.TOP_RIGHT });
            router.push('/login');
          }
        } else {
  
        }
      })
      .catch((error) => {
        setLoginError(error);
        return error;
      });
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      onSubmit: handleFormSubmit,
      validationSchema: formSchema,
    });
  return (
    
    <Wrapper elevation={3} passwordVisibility={passwordVisibility}>
        

      {loginError}
      <form onSubmit={handleSubmit}>
        <H3 textAlign="center" mb={1}>
          Create Your Account
        </H3>
        <Small
          mb={4.5}
          fontSize={12}
          display="block"
          fontWeight={600}
          color="grey.800"
          textAlign="center"
        >
          Please fill all fields to continue
        </Small>

     
        <BazaarTextField
  mb={1.5}
  fullWidth
  name="fullName"
  size="small"
  label="Full Name"
  variant="outlined"
  onBlur={handleBlur}
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  placeholder="Your Name"
  error={!!touched.fullName && !!errors.fullName}
  helperText={touched.fullName && errors.fullName}
/>

<BazaarTextField
  mb={1.5}
  fullWidth
  name="address"
  size="small"
  label="Address"
  variant="outlined"
  onBlur={handleBlur}
  value={address}
  onChange={(e) => setAddress(e.target.value)}
  placeholder="Your Address"
  error={!!touched.address && !!errors.address}
  helperText={touched.address && errors.address}
/>

<BazaarTextField
  mb={1.5}
  fullWidth
  name="phone"
  size="small"
  label="Phone"
  variant="outlined"
  onBlur={handleBlur}
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="Your Phone"
  error={!!touched.phone && (!!errors.phone || !phoneNumberRegex.test(phone))}
  helperText={
    touched.phone &&
    ((!!errors.phone && errors.phone) ||
      (!phoneNumberRegex.test(phone) && "Please enter a valid Pakistani phone number"))
  }
/>

        <BazaarTextField
          mb={1.5}
          fullWidth
          name="email"
          size="small"
          type="email"
          variant="outlined"
          onBlur={handleBlur}
          value={values.email}
          onChange={handleChange}
          label="Email"
          placeholder="exmple@mail.com"
          error={!!touched.email && !!errors.email}
          helperText={touched.email && errors.email}
        />

        <BazaarTextField
          mb={1.5}
          fullWidth
          size="small"
          name="password"
          label="Password"
          variant="outlined"
          autoComplete="on"
          placeholder="*********"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password}
          type={passwordVisibility ? "text" : "password"}
          error={!!touched.password && !!errors.password}
          helperText={touched.password && errors.password}
          InputProps={{
            endAdornment: (
              <EyeToggleButton
                show={passwordVisibility}
                click={togglePasswordVisibility}
              />
            ),
          }}
        />

        <BazaarTextField
          fullWidth
          size="small"
          autoComplete="on"
          name="re_password"
          variant="outlined"
          label="Retype Password"
          placeholder="*********"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.re_password}
          type={passwordVisibility ? "text" : "password"}
          error={!!touched.re_password && !!errors.re_password}
          helperText={touched.re_password && errors.re_password}
          InputProps={{
            endAdornment: (
              <EyeToggleButton
                show={passwordVisibility}
                click={togglePasswordVisibility}
              />
            ),
          }}
        />

<br />

        <BazaarButton
          fullWidth
          type="submit"
          color="primary"
          variant="contained"
          sx={{
            height: 44,
          }}
        >
          Create Account
        </BazaarButton>
      </form>

      <SocialButtons redirect="/login" redirectText="Login" />
    </Wrapper>
    
  );
};

const initialValues = {

  email: "",
  password: "",
  re_password: "",
 

};
const formSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  re_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please re-type password"),

});
export default Signup;
