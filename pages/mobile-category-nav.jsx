import { Box, Divider, Grid, Typography } from "@mui/material";
import Accordion from "components/accordion/Accordion";
import AccordionHeader from "components/accordion/AccordionHeader";
import Header from "components/header/Header";
import MobileCategoryImageBox from "components/mobile-category-nav/MobileCategoryImageBox";
import MobileCategoryNavStyle from "components/mobile-category-nav/MobileCategoryNavStyle";
import MobileNavigationBar from "components/mobile-navigation/MobileNavigationBar";
import navigations from "data/navigations";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import api from "utils/api/market-2";
import Man from "components/icons/Man";
import Image from 'next/image'
// List imports
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const MobileCategoryNav = (props) => {
  const { navCategories } = props;
  const [category, setCategory] = useState(null);
  const [suggestedList, setSuggestedList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);

  const handleCategoryClick = (cat) => () => {
    let menuData = cat.menuData;
    if (menuData) setSubCategoryList(menuData.categories || menuData);
    else setSubCategoryList([]);
    setCategory(cat);
  };

  // const myLoader = ({ src, width, quality }) => {
  //   return `http://100.64.6.105:8099/media/${src}?w=${width}&q=${quality || 75}`
  // }

  useEffect(() => setSuggestedList(suggestion), []);
   ("SubCategories",subCategoryList)
  const imgbaseurl=process.env.NEXT_PUBLIC_BACKEND_API_BASE+'media/'

  return (
    <MobileCategoryNavStyle>
      <Header className="header" />

      <Box className="main-category-holder">
        {navCategories.map((item) => (
          item.menuData.categories.length>0?
          <Box
            key={item.title}
            className="main-category-box"
            onClick={handleCategoryClick(item)}
            borderLeft={`${category?.href === item.href ? "3" : "0"}px solid`}
          >
            <Image
              
              src={imgbaseurl+item.icon}
              alt="Picture of the author"
              width={60}
              height={40}
            />
            <Typography
              className="ellipsis"
              textAlign="center"
              fontSize="11px"
              sx={{fontWeight: 'bold'}}
              lineHeight="2"
            >
              {item.title}
            </Typography>
          </Box>
          :
          <Link href={item.href} key={item.title} >
            <a>
              <Box
                key={item.title}
                className="main-category-box"
                onClick={handleCategoryClick(item)}
                borderLeft={`${category?.href === item.href ? "3" : "0"}px solid`}
              >
                <Image
                  
                  src={imgbaseurl+item.icon}
                  alt="Picture of the author"
                  width={60}
                  height={40}
                />
                <Typography
                  className="ellipsis"
                  textAlign="center"
                  fontSize="11px"
                  sx={{fontWeight: 'bold'}}
                  lineHeight="2"
                >
                  {item.title}
                </Typography>
              </Box>
            </a>
          </Link>
        ))}
      </Box>

      <Box className="container">
        {/* <Typography fontWeight="600" fontSize="15px" mb={2}>
          Recommended Categories
        </Typography>

        <Box mb={4}>
          <Grid container spacing={3}>
            {navCategories.map((item, ind) => (
              <Grid item lg={1} md={2} sm={3} xs={4} key={item.href}>
                <Link href={item.href}>
                  <a>
                    <MobileCategoryImageBox {...item} />
                  </a>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box> */}

        {category?.menuComponent === "MegaMenu1" ? (
          subCategoryList.map((item, ind) => (
            <Fragment key={ind}>
              <Divider />
              {/* <Accordion>
                  <Typography fontWeight="600" fontSize="15px">
                    <Link href={item.href}>
                    <a >
                    {item.title}
                    </a>
                    </Link>
                  </Typography>
                
              </Accordion> */}
              <List>
                <Link href={item.href}>
                  <a>
                    <ListItem disablePadding >
                        <ListItemText primary={item.title} />
                    </ListItem>
                  </a>
                </Link>
              </List>
            </Fragment>
          ))
        ) : (
          <Box mb={4}>
            <Grid container spacing={3}>
              {subCategoryList.map((item, ind) => (
                <Grid item lg={1} md={2} sm={3} xs={4} key={item.href}>
                  <a href={item.href}></a>
                  <Link href={item.href}>
                    <a>
                      <MobileCategoryImageBox {...item.icon} />
                    </a>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      <MobileNavigationBar />
    </MobileCategoryNavStyle>
  );
};

const suggestion = [
  {
    title: "Belt",
    href: "/belt",
    imgUrl: "/assets/images/products/categories/belt.png",
  },
  {
    title: "Hat",
    href: "/Hat",
    imgUrl: "/assets/images/products/categories/hat.png",
  },
  {
    title: "Watches",
    href: "/Watches",
    imgUrl: "/assets/images/products/categories/watch.png",
  },
  {
    title: "Sunglasses",
    href: "/Sunglasses",
    imgUrl: "/assets/images/products/categories/sunglass.png",
  },
  {
    title: "Sneakers",
    href: "/Sneakers",
    imgUrl: "/assets/images/products/categories/sneaker.png",
  },
  {
    title: "Sandals",
    href: "/Sandals",
    imgUrl: "/assets/images/products/categories/sandal.png",
  },
  {
    title: "Formal",
    href: "/Formal",
    imgUrl: "/assets/images/products/categories/shirt.png",
  },
  {
    title: "Casual",
    href: "/Casual",
    imgUrl: "/assets/images/products/categories/t-shirt.png",
  },
];


export async function getServerSideProps() {
  const navCategories = await api.getNavCategories();
  return {
    props: {
      navCategories
    },
  };
}

export default MobileCategoryNav;
