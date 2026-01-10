import { Rating } from "@mui/lab";
import { Box, Button, TextField } from "@mui/material";
import { FlexBox } from "components/flex-box";
import { H2, H5 } from "components/Typography";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import ProductComment from "./ProductComment";
import { useSession, signIn, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';

const ProductReview = ({itemid,reviews,itemname}) => {

  const { data: session} = useSession()

  const handleFormSubmit = async (values, { resetForm }) => {
 

    // fetch(server_ip+'addReviews', {
    //   method: "POST",
    //   body: formData,
    //   // headers: {
    //   //   "content-type": "application/json",
    //   // },
    // }).catch((e) => console.log(e));
    try {
    
      const formData = new FormData();
      formData.append('rating', values.rating);
      formData.append('comment', values.comment);
      formData.append('userid', session.user.id);
      formData.append('username', session.user.name);
      formData.append('itemid', itemid);
      formData.append('itemname', itemname);

      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'addReviews', {
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
  

  
      toast.success("Review Added Successfully", {position: toast.POSITION.TOP_RIGHT});
    } catch (error) {
      console.error(error);
    }


    resetForm();
  };

  const {
    dirty,
    values,
    errors,
    touched,
    isValid,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    onSubmit: handleFormSubmit,
    initialValues: initialValues,
    validationSchema: reviewSchema,
  });

  return (
    <Box>
      {reviews.map((item, ind) => (
        <ProductComment {...item} key={ind} />
      ))}

      { session? <><H2 fontWeight="600" mt={7} mb={2.5}>
        Write a Review for this product
      </H2><form onSubmit={handleSubmit}>
          <Box mb={2.5}>
            <FlexBox mb={1.5} gap={0.5}>
              <H5 color="grey.700">Your Rating</H5>
              <H5 color="error.main">*</H5>
            </FlexBox>

            <Rating
              color="warn"
              size="medium"
              value={values.rating}
              onChange={(_, value) => setFieldValue("rating", value)} />
          </Box>

          <Box mb={3}>
            <FlexBox mb={1.5} gap={0.5}>
              <H5 color="grey.700">Your Review</H5>
              <H5 color="error.main">*</H5>
            </FlexBox>

            <TextField
              rows={8}
              multiline
              fullWidth
              name="comment"
              variant="outlined"
              onBlur={handleBlur}
              value={values.comment}
              onChange={handleChange}
              placeholder="Write a review here..."
              error={!!touched.comment && !!errors.comment}
              helperText={touched.comment && errors.comment} />
          </Box>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!(dirty && isValid)}
          >
            Submit
          </Button>
        </form></>:<H5 fontWeight="600" mt={7} mb={2.5}>
        Please login to Write a Review for this product
      </H5>
      
    
    
    }

     
    </Box>
  );
};

const commentList = [
  {
    name: "Jannie Schumm",
    imgUrl: "/assets/images/faces/7.png",
    rating: 4.7,
    date: "2021-02-14",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account.",
  },
  {
    name: "Joe Kenan",
    imgUrl: "/assets/images/faces/6.png",
    rating: 4.7,
    date: "2019-08-10",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account.",
  },
  {
    name: "Jenifer Tulio",
    imgUrl: "/assets/images/faces/8.png",
    rating: 4.7,
    date: "2021-02-05",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account.",
  },
];
const initialValues = {
  rating: 0,
  comment: "",
  date: new Date().toISOString(),
};
const reviewSchema = yup.object().shape({
  rating: yup.number().required("required"),
  comment: yup.string().required("required"),
});
export default ProductReview;
