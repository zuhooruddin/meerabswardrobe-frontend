import { Box, Card, Grid } from "@mui/material";
import { FlexBox } from "components/flex-box";
import NavLink from "components/nav-link/NavLink";
import Link from "next/link";
import LazyImage from "components/LazyImage";
import StyledMegaMenu from "./StyledMegaMenu";

const AllCategoriesPage = ({ categories }) => {
  return (
    <StyledMegaMenu>
      <Card elevation={2} sx={{ ml: "3rem", minWidth: "300px" }}>
        <FlexBox px={2.5} py={1.75} alignItems="unset">
          <Box>
            {categories.map((item, ind) => (
              <Box
                key={ind}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 0,
                  px: 2,
                  borderRadius: 0,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f2f2f2",
                  },
                  borderBottom: "1px solid #ccc",
                }}
              >
                {item.href ? (
                  <NavLink
                    className="title-link"
                    href={item.href}
                    sx={{
                      color: "text.primary",
                      fontSize: "0.8rem",
                    }}
                  >
                    {item.title}
                  </NavLink>
                ) : (
                  <Box
                    className="title-link"
                    sx={{
                      color: "text.primary",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    {item.title}
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item.subCategories?.map((sub, ind) => (
                    <NavLink
                      className="child-link"
                      href={sub.href}
                      key={ind}
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.78em",
                        textDecoration: "none",
                        marginLeft: "1rem",
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                    >
                      {sub.title}
                    </NavLink>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </FlexBox>
      </Card>
    </StyledMegaMenu>
  );
};

const AllCategories = ({ data }) => {
  const { categories } = data;
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={10} lg={8}>
        <AllCategoriesPage categories={categories} />
      </Grid>
    </Grid>
  );
};

export default AllCategories;
