import { Add, Remove } from "@mui/icons-material";
import { Box, Grid } from "@mui/material";
import BazaarButton from "components/BazaarButton";
import LazyImage from "components/LazyImage";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { H1, H2, H3, H6 } from "components/Typography";
import { useAppContext } from "contexts/AppContext";
import { useRouter } from "next/router";
import React, { useCallback, useState,useEffect } from "react";
import { FlexBox, FlexRowCenter } from "../flex-box"; // ================================================================
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";

// ================================================================
const BundleIntro = ({ product, bundle }) => {
  const imgbaseurl = process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL + "/";
  const imgurl = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "media/";
  const imgurls = process.env.NEXT_PUBLIC_BACKEND_API_BASE;

  const slugbaseurl = "/product/";

  const {
    id,
    status,
    name,
    image,
    imgGroup,
    mrp,
    manufacturer,
    author,
    aliasCode,
    sku,
  } = bundle;
  const [rowsData, setRowsData] = useState(product);
  const router = useRouter();
  const routerId = router.query.id;
  const [totalBundlePrice, setTotalBundlePrice] = useState(bundle.salePrice);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const { state, dispatch } = useAppContext();
  const cartList = state.cart;
  const cartItem = cartList.find(
    (item) => item.id === id || item.id === routerId
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


const[currency,setCurrency]=useState('')

useEffect(()=>{
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedCurrency = localStorage.getItem('currency');

    setCurrency(storedCurrency);
  }
},[])



  const inputStyle = {
    width: "3.5em",
    fontSize: isMobile ? "0.9em" : "1em",
  };

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const handleTotalBundlePriceChange = () => {
    var sumPrice = 0;
    rowsData.map(
      (row, index) => (sumPrice = sumPrice + row.salePrice * row.qty)
    );
    setTotalBundlePrice(sumPrice);
  };
  const handleCartAmountChange = useCallback(
    (addflag) => () => {
      let addedToCart = false;
      rowsData.forEach((row) => {
        if (row.qty <= 0 || row.stock <= 0) return;
        const payloadQty = Math.min(row.qty, row.stock);
        const payload = {
          id: row.id,
          mrp: row.mrp,
          salePrice: row.salePrice,
          price: row.salePrice,
          sku: row.sku,
          slug: row.slug,
          image: imgurl + row.image,
          name: row.name + " | Bundle: " + bundle.name,
          qty: payloadQty,
          bundle: true,
        };
        dispatch({
          type: "CHANGE_CART_AMOUNT",
          payload,
        });
        addedToCart = true;
        if (payloadQty < row.qty && addflag) {
          toast.info(`${row.name} has only ${row.stock} in stock`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });

      if (addedToCart && addflag) {
        toast.success("Added to cart", { position: toast.POSITION.TOP_RIGHT });
      } else if (addedToCart && !addflag) {
        toast.error("Removed from cart", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    },
    [bundle, rowsData, dispatch]
  );

  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const rowsInput = [...product];
    rowsInput[index]["qty"] = value;
    setRowsData(rowsInput);
    handleTotalBundlePriceChange();
  };

  return (
    <Box width="100%">
      <Grid container spacing={3} justifyContent="space-around">
        <Grid item md={6} xs={12} alignItems="center">
          <FlexBox justifyContent="center" mb={6}>
            <LazyImage
              width={300}
              alt={name}
              height={300}
              loading="eager"
              objectFit="contain"
              src={imgurls + `${image}`}
            />
          </FlexBox>
        </Grid>

        <Grid item md={6} xs={12} alignItems="center">
          <H1 mb={2}>{bundle.name}</H1>
          <Box mb={3}>
            <H2 color="primary.main" mb={0.5} lineHeight="1">
              {currency}. {totalBundlePrice.toFixed(2)}
              {/* Rs. {bundle.salePrice.toFixed(2)} */}
            </H2>
          </Box>

          <FlexBox alignItems="center" mb={2}>
            <Box>Product SKU / CODE:</Box>

            <H6 ml={1}>{sku}</H6>
          </FlexBox>
          {!cartItem?.qty ? (
            <BazaarButton
              color="primary"
              variant="contained"
              onClick={handleCartAmountChange(1, true)}
              sx={{
                mb: 4.5,
                px: "1.75rem",
                height: 40,
              }}
            >
              Add to Cart
            </BazaarButton>
          ) : (
            <FlexBox alignItems="center" mb={4.5}>
              <BazaarButton
                size="small"
                sx={{
                  p: 1,
                }}
                color="primary"
                variant="outlined"
                onClick={handleCartAmountChange(cartItem?.qty - 1, false)}
              >
                <Remove fontSize="small" />
              </BazaarButton>

              <H3 fontWeight="600" mx={2.5}>
                {cartItem?.qty.toString().padStart(2, "0")}
              </H3>

              <BazaarButton
                size="small"
                sx={{
                  p: 1,
                }}
                color="primary"
                variant="outlined"
                onClick={handleCartAmountChange(cartItem?.qty + 1, true)}
              >
                <Add fontSize="small" />
              </BazaarButton>
            </FlexBox>
          )}
        </Grid>
      </Grid>
      {isMobile ? (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f2f2f2",
                  color: "#444",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Image
              </th>

              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f2f2f2",
                  color: "#444",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Name
              </th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f2f2f2",
                  color: "#444",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Quantity
              </th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f2f2f2",
                  color: "#444",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Price
              </th>
            </tr>
          </thead>
          {product.map((row, index) => (
            <tbody key={row.id} style={{ textAlign: "left" }}>
              <tr>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                  {" "}
                  <LazyImage
                    width={40}
                    alt={row.name}
                    height={40}
                    loading="eager"
                    objectFit="contain"
                    src={imgurl + `${row.image}`}
                  />
                </td>

                <Link href={slugbaseurl + `${row.slug}`}>
                  <a>
                    <th
                      style={{
                        padding: "8px",
                        color: "#444",
                        fontWeight: "inherit",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {row.name}
                    </th>
                  </a>
                </Link>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={row.qty}
                      onChange={(evnt) => handleChange(index, evnt)}
                      name="name"
                      style={inputStyle}
                    />
                  </div>
                </td>

                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                  {row.salePrice}
                </td>
              </tr>
            </tbody>
          ))}
          <tfoot>
            <tr>
              <td
                colSpan="2"
                style={{
                  textAlign: "right",
                  paddingRight: "8px",
                  paddingTop: "8px",
                }}
              >
                Total:
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {product.reduce(
                  (total, row) => total + row.salePrice * row.qty,
                  0
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ width: "100%", overflowX: "auto" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "#D23F57", fontWeight: "bold" }}>
                  Image
                </TableCell>

                <TableCell style={{ color: "#D23F57", fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell
                  style={{ color: "#D23F57", fontWeight: "bold" }}
                  align="center"
                >
                  Quantity
                </TableCell>
                <TableCell
                  style={{ color: "#D23F57", fontWeight: "bold" }}
                  align="center"
                >
                  Price
                </TableCell>
                <TableCell
                  style={{ color: "#D23F57", fontWeight: "bold" }}
                  align="center"
                >
                  Total Price
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {product.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <LazyImage
                      width={60}
                      alt={row.name}
                      height={60}
                      loading="eager"
                      objectFit="contain"
                      src={imgurl + `${row.image}`}
                    />
                  </TableCell>
                  <Link href={slugbaseurl + `${row.slug}`}>
                    <a>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                    </a>
                  </Link>

                  <TableCell align="center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={row.qty}
                      onChange={(evnt) => handleChange(index, evnt)}
                      name="name"
                      style={inputStyle}
                    />
                  </TableCell>
                  <TableCell align="center">{row.salePrice}</TableCell>
                  <TableCell align="center">
                    {row.salePrice * row.qty}
                  </TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default BundleIntro;
