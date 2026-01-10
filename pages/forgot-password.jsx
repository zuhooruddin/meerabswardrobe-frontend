import { Card } from "@mui/material";
import { Box, Divider } from "@mui/material";
import Link from "next/link";

import { styled } from "@mui/material/styles";
import BazaarButton from "components/BazaarButton";
import BazaarTextField from "components/BazaarTextField";
import { H3,H6, Small } from "components/Typography";
import { useFormik } from "formik";
import React, { useCallback, useState,useEffect } from "react";
import * as yup from "yup";
import {useSession,signIn,signOut} from 'next-auth/react';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FlexBox, FlexRowCenter } from "components/flex-box";
import { toast } from 'react-toastify';




const fbStyle = {
  background: "#3B5998",
  color: "white",
};
const googleStyle = {
  background: "#4285F4",
  color: "white",
};
export const Wrapper = styled(({ children, passwordVisibility, ...rest }) => (
  <Card {...rest}>{children}</Card>
))(({ theme, passwordVisibility }) => ({
  width: 500,
  padding: "2rem 3rem",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
  ".passwordEye": {
    color: passwordVisibility
      ? theme.palette.grey[600]
      : theme.palette.grey[400],
  },
  ".facebookButton": {
    marginBottom: 10,
    ...fbStyle,
    "&:hover": fbStyle,
  },
  ".googleButton": { ...googleStyle, "&:hover": googleStyle },
  ".agreement": {
    marginTop: 12,
    marginBottom: 24,
  },
}));

const Forget = (props) => {
  const { data: session } = useSession()
  const { redirect = "/login", redirectText = "Login" } = props;


  const [alert,setAlert] = useState();

  const router = useRouter();

  
 


  const handleFormSubmit = async (values) => {  
    axios.post( process.env.NEXT_PUBLIC_BACKEND_API_BASE+'resetpassword', values)
            .then(response => {

             
                            toast.success("Please check your email to reset your password", {position: toast.POSITION.TOP_RIGHT});

                            router.push('/login');
                            values.email=""

            })
            .catch(error => {
              // toast.error(error, {position: toast.POSITION.TOP_RIGHT});

              toast.error("Something went wrong.please try again", {position: toast.POSITION.TOP_RIGHT});


  });
}
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      onSubmit: handleFormSubmit,
      validationSchema: formSchema,
    });
    
  return (
   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
       <Wrapper elevation={2}   >
     

     <form onSubmit={handleSubmit} >
     
    
       <H3 textAlign="center" mb={1}>
         Welcome To Meerab's Wardrobe
       </H3>
       <Small
         mb={4.5}
         display="block"
         fontSize="12px"
         fontWeight="600"
         color="grey.800"
         textAlign="center"
       >
     Reset your password 
       </Small>

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
         label="Enter Your Email "
         placeholder="exmple@mail.com"
         error={!!touched.email && !!errors.email}
         helperText={touched.email && errors.email}
       />

     

       <BazaarButton
         fullWidth
         type="submit"
         color="primary"
         variant="contained"
         sx={{
           mb: "1.65rem",
           height: 44,
         }}
       >
         Reset
       </BazaarButton>
       <FlexRowCenter my="1.25rem">
        <Box>Back to account?</Box>
        <Link href={redirect}>
          <a>
            <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
              {redirectText}
            </H6>
          </a>
        </Link>
      </FlexRowCenter>

     </form>

     
   </Wrapper>
   </div>
   
  );

 
  
 
};

const initialValues = {
  email: "",

};
const formSchema = yup.object().shape({
  email: yup.string(  ).email("invalid email").required("Email is required"),
});
export default Forget;
