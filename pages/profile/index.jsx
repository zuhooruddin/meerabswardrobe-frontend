import Person from "@mui/icons-material/Person";
import { Avatar, Box, Button, Card, Grid, Typography } from "@mui/material";
import { FlexBetween, FlexBox } from "components/flex-box";
import UserDashboardHeader from "components/header/UserDashboardHeader";
import CustomerDashboardLayout from "components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "components/layouts/customer-dashboard/Navigations";
import TableRow from "components/TableRow";
import { H3, H5, Small } from "components/Typography";
import Link from "next/link";
import { useSession, signIn, signOut } from 'next-auth/react';
import React, { useEffect } from "react";
import Login from "pages-sections/sessions/Login";
import { FlexRowCenter } from "components/flex-box";
import SEO from "components/SEO";




const Profile = () => {
  const { data: session } = useSession();
   ("Session", session)
  if (session && 'error' in session && session.error == "SessionTimedOut") {
     ("You have been logged out as your session was outdated. Please login again to continue shopping.");
    signOut();
    return (
      <FlexRowCenter flexDirection="column" minHeight="100vh">

        <Login />
        <Link href='/'>Back to Home</Link>
      </FlexRowCenter>
    )
  }
  else if (session) {
    return (
      <CustomerDashboardLayout>
        <UserDashboardHeader
          icon={Person}
          title="My Profile"
          navigation={<CustomerDashboardNavigation />}
        // button={
        //   <Link href="/profile/edit" passHref>
        //     <Button
        //       color="primary"
        //       sx={{
        //         px: 4,
        //         bgcolor: "primary.light",
        //       }}
        //     >
        //       Edit Profile
        //     </Button>
        //   </Link>
        // }
        />

        <Box mb={4}>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Card
                sx={{
                  display: "flex",
                  p: "14px 32px",
                  height: "100%",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={session.user.picture}
                  sx={{
                    height: 64,
                    width: 64,
                  }}
                />

                <Box ml={1.5} flex="1 1 0">
                  <FlexBetween flexWrap="wrap">
                    <div>
                      <H5 my="0px"> {session.user.name}</H5>



                    </div>


                  </FlexBetween>
                </Box>
              </Card>
            </Grid>

            {/* <Grid item md={6} xs={12}>
              <Grid container spacing={4}>
                {infoList.map((item) => (
                  <Grid item lg={3} sm={6} xs={6} key={item.subtitle}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        p: "1rem 1.25rem",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <H3 color="primary.main" my={0} fontWeight={600}>
                        {item.title}
                      </H3>
  
                      <Small color="grey.600" textAlign="center">
                        {item.subtitle}
                      </Small>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid> */}
          </Grid>
        </Box>

        <TableRow
          sx={{
            p: "0.75rem 1.5rem",
          }}
        >
          <FlexBox flexDirection="column" p={1}>
            <Small color="grey.600" mb={0.5} textAlign="left">
              Name
            </Small>
            <span>{session.user.name}</span>
          </FlexBox>



          <FlexBox flexDirection="column" p={1}>
            <Small color="grey.600" mb={0.5} textAlign="left">
              Email
            </Small>
            <span>{session.user.email}</span>
          </FlexBox>
          {/* {data.map((item) => (
            <FlexBox flexDirection="column" p={1} key={item.id}>
            <Small color="grey.600" mb={0.5} textAlign="left">
              Phone
            </Small>
            <span>{item.custPhone}</span>
          </FlexBox>

          ))} */}

          {/*   
          <FlexBox flexDirection="column" p={1}>
            <Small color="grey.600" mb={0.5}>
              Birth date
            </Small>
            <span className="pre">
              {format(new Date(1996 / 11 / 16), "dd MMM, yyyy")}
            </span>
          </FlexBox> */}
        </TableRow>
      </CustomerDashboardLayout>
    );
  }
  return (
    <FlexRowCenter flexDirection="column" minHeight="100vh">

      <Login />
      <Link href='/'>Back to Home</Link>
    </FlexRowCenter>
  )
};
export default Profile;
