import { Box, MenuItem, TextField, styled, keyframes, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import BazaarButton from "components/BazaarButton";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchResultCard } from "./SearchBox";
import { useRouter } from "next/router";

// Pulse animation for search icon
const pulse = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
`;

// Premium Search Container
const SearchContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  flex: "1 1 0",
  maxWidth: "670px",
  margin: "0 auto",
}));

// Premium Search Input
const PremiumSearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    height: "52px",
    paddingRight: 0,
    borderRadius: "26px",
    backgroundColor: theme.palette.mode === 'dark' 
      ? "rgba(255, 255, 255, 0.05)" 
      : "#F8FAFC",
    border: theme.palette.mode === 'dark'
      ? "2px solid rgba(255, 255, 255, 0.08)"
      : "2px solid rgba(0, 0, 0, 0.04)",
    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
    
    "& fieldset": {
      border: "none",
    },
    
    "&:hover": {
      backgroundColor: theme.palette.mode === 'dark' 
        ? "rgba(255, 255, 255, 0.08)" 
        : "#FFFFFF",
      borderColor: theme.palette.mode === 'dark'
        ? "rgba(255, 255, 255, 0.15)"
        : "rgba(0, 0, 0, 0.08)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    },
    
    "&.Mui-focused": {
      backgroundColor: theme.palette.mode === 'dark' 
        ? "rgba(255, 255, 255, 0.1)" 
        : "#FFFFFF",
      borderColor: "#D23F57",
      boxShadow: "0 8px 32px rgba(210, 63, 87, 0.15), 0 0 0 4px rgba(210, 63, 87, 0.08)",
      
      "& .search-icon": {
        color: "#D23F57",
      },
    },
  },
  
  "& .MuiOutlinedInput-input": {
    padding: "14px 16px",
    fontSize: "15px",
    fontWeight: 500,
    color: theme.palette.mode === 'dark' ? "#F8FAFC" : "#1E293B",
    
    "&::placeholder": {
      color: theme.palette.mode === 'dark' ? "#94A3B8" : "#94A3B8",
      opacity: 1,
    },
  },
}));

// Premium Search Button
const SearchButton = styled(BazaarButton)(({ theme }) => ({
  padding: "0 32px",
  height: "100%",
  borderRadius: "0 26px 26px 0",
  background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
  color: "white",
  fontWeight: 600,
  fontSize: "15px",
  letterSpacing: "0.02em",
  textTransform: "none",
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  minWidth: "120px",
  
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
    transition: "left 0.5s ease",
  },
  
  "&:hover": {
    background: "linear-gradient(135deg, #B72C42 0%, #D23F57 100%)",
    boxShadow: "0 8px 24px rgba(210, 63, 87, 0.4)",
    
    "&::before": {
      left: "100%",
    },
  },
  
  "&:active": {
    transform: "scale(0.98)",
  },
  
  [theme.breakpoints.down("sm")]: {
    padding: "0 20px",
    minWidth: "80px",
    fontSize: "14px",
  },
}));

// Premium Search Icon
const SearchIcon = styled(Search)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? "#94A3B8" : "#94A3B8",
  marginLeft: "16px",
  marginRight: "8px",
  transition: "all 0.35s ease",
  fontSize: "22px",
}));

// Premium Result Card
const PremiumResultCard = styled(SearchResultCard)(({ theme }) => ({
  borderRadius: "16px",
  marginTop: "12px",
  boxShadow: "0 16px 48px rgba(0, 0, 0, 0.12)",
  border: theme.palette.mode === 'dark'
    ? "1px solid rgba(255, 255, 255, 0.1)"
    : "1px solid rgba(0, 0, 0, 0.04)",
  overflow: "hidden",
  
  "& .MuiMenuItem-root": {
    padding: "14px 20px",
    fontSize: "15px",
    fontWeight: 500,
    transition: "all 0.2s ease",
    
    "&:hover": {
      backgroundColor: theme.palette.mode === 'dark'
        ? "rgba(210, 63, 87, 0.15)"
        : "rgba(210, 63, 87, 0.08)",
      color: "#D23F57",
    },
  },
}));

const GrocerySearchBox = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [resultList, setResultList] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const parentRef = useRef();

  const handleSearch = useCallback(() => {
    const sanitizedMessage = message.replaceAll("/", " ");
    router.push("/search/" + sanitizedMessage);
  }, [router, message]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setMessage(value);
    setMessageError(value.trim() === '');
  };

  const handlebutton = () => {
    if (message.trim() !== '') {
      handleSearch();
    }
  };

  const handleDocumentClick = () => setResultList([]);

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => {
      window.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <SearchContainer ref={parentRef}>
      <PremiumSearchField
        fullWidth
        name="name"
        variant="outlined"
        placeholder="Search for products..."
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        error={messageError}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="search-icon" />
            </InputAdornment>
          ),
          endAdornment: (
            <SearchButton
              onClick={handlebutton}
              disableElevation
              variant="contained"
            >
              Search
            </SearchButton>
          ),
        }}
      />

      {typeof resultList !== "undefined" && !!resultList.length && (
        <PremiumResultCard elevation={3}>
          {resultList.map((item) => (
            <Link href={`/product/search/${item.name}`} key={item.name} passHref>
              <MenuItem>{item.name}</MenuItem>
            </Link>
          ))}
        </PremiumResultCard>
      )}
    </SearchContainer>
  );
};

export default GrocerySearchBox;
