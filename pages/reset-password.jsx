import { Checkbox, FormControlLabel } from "@mui/material";
import BazaarButton from "components/BazaarButton";
import BazaarTextField from "components/BazaarTextField";
import { H3, H6, Small } from "components/Typography";
import { useFormik } from "formik";
import React, { useCallback, useState,useContext } from "react";
import * as yup from "yup";
import EyeToggleButton from "pages-sections/sessions/EyeToggleButton";
import { Wrapper } from "pages-sections/sessions/Login";
import SocialButtons from "pages-sections/sessions/SocialButtons";
import {useRouter} from 'next/router'
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { toast } from 'react-toastify';


const ResetPassword = () => {
  const router = useRouter()
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
        new_password1: values.password,
        new_password2:values.re_password,
        uid: router.query.uid,
        token: router.query.token,
		
            
		}
      

		
			// call nextjs api function to create a user
			await axios.post( process.env.NEXT_PUBLIC_BACKEND_API_BASE+'api/auth/password/reset/confirm/', body, config).then(function(result){
         
           
			
				  if (result.error !== null)
				  {
					  if (result.data.status === 400)
					  {
                        toast.error("Password must be length of eight", {position: toast.POSITION.TOP_RIGHT});

						  
					  }
					  else
					  {
              toast.success("Password Reset Successfully", {position: toast.POSITION.TOP_RIGHT});
              router.push('/login');
              
					  }
         
				  }
				  else
				  {
					
				  }}).catch((error) => {
                    toast.error("Password must be length of eight", {position: toast.POSITION.TOP_RIGHT});

        
				return error
			  });

 
    // register = register({username:values.email, email:values.email, password:values.password})
   





  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      onSubmit: handleFormSubmit,
      validationSchema: formSchema,
    });
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // height: '100vh',
      };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
   <Wrapper elevation={3} passwordVisibility={passwordVisibility} >
      <form onSubmit={handleSubmit}>
        <H3 textAlign="center" mb={1}>
          Reset your password
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
          Reset Password
        </BazaarButton>
      </form>

    </Wrapper>
    </div>
 
    
  );
};

const initialValues = {
 
  password: "",
  re_password: "",
 

};
const formSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
  re_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please re-type password"),

});
export default ResetPassword;
