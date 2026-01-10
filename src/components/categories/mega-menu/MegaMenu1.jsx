import { useState } from "react";
import { Box, Card, Grid } from "@mui/material";
import { FlexBox } from "components/flex-box";
import LazyImage from "components/LazyImage";
import NavLink from "components/nav-link/NavLink";
import Link from "next/link";
import StyledMegaMenu from "./StyledMegaMenu";
import { useRouter } from 'next/router';

const MegaMenu1 = ({
  data: { categories, rightImage, bottomImage },
  minWidth,
}) => {
  const [showAll, setShowAll] = useState(false);
  const maxCategories = 10; // maximum number of categories to display

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };
  
  const router = useRouter();

  const displayCategories = showAll ? categories : categories.slice(0, maxCategories);

  const handleShowAllClick = (slug) => {
    router.push({
      pathname: '/categories/'+slug

      
    });
  };

  return categories ? (
    <StyledMegaMenu>
      {/* minWidth: "300px" */}
      <Card elevation={2} sx={{ ml: "3rem", width: "max-content", minWidth: "320px" }}>
        <FlexBox px={2.5} py={1.75} alignItems="unset">
          <Box>
            {displayCategories.map((item, ind) => (
              <Box
                key={ind}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 0.4,
                  px: 0,
                  borderRadius: 0,
                  cursor: "pointer",
                  minWidth: "300px",
                  "&:hover": {
                    backgroundColor: "#f2f2f2",
                  },
                  '&:not(:last-child)': {
                  borderBottom: "1px solid #ccc",
                  }
                }}
              >
                {item.href ? (
                  <NavLink className="title-link" href={item.href} sx={{
                    color: "text.primary",
                    fontSize: "0.9rem", 
                    width: '100%',
                    whiteSpace: "nowrap",
                    overflow: "visible",
                    display: "block",
                    paddingRight: "1rem",
                  }}>
                    {item.title}
                  </NavLink>
                ) : (
                  <Box
                    className="title-link"
                    sx={{
                      color: "text.primary",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      whiteSpace: "nowrap",
                      overflow: "visible",
                      paddingRight: "1rem",
                    }}
                  >
                    {item.title}
                  </Box>
                )}
                {/* <Box
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
                        fontSize: "0.78em", // Updated font size
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
                </Box> */}
              </Box>
            ))}
            {categories.length > maxCategories && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 1,
                }}
              >
                <Box
                  sx={{
                    cursor: "pointer",
                    color: "primary.main",
                  }}
                  onClick={() => handleShowAllClick(categories[maxCategories-1].slug)}
                >
                  Show all
                </Box>
              </Box>
            )}
          </Box>
          {rightImage && (
            <Box mt={1.5}>
              <Link href={rightImage.href}>
                <a>
                  <LazyImage
                    src={rightImage.imgUrl}
                    objectFit="contain"
                    width={137}
                    height={318}
                  />
                </a>
              </Link>
            </Box>
          )}
        </FlexBox>

        {bottomImage && (
          <Link href={bottomImage.href}>
            <a>
              <Box position="relative" height="170px">
                <LazyImage
                  src={bottomImage.imgUrl}
                  layout="fill"
                  objectFit="cover"
                />
              </Box>
            </a>
          </Link>
        )}
      </Card>
    </StyledMegaMenu>
  ) : null;
};

MegaMenu1.defaultProps = {
  minWidth: "760px",
};
export default MegaMenu1;
