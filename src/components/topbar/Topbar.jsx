import { CallOutlined, ExpandMore, MailOutline, LogOut } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { Box, Container, MenuItem, styled } from "@mui/material";
import BazaarImage from "components/BazaarImage";
import Image from "next/image";
import { FlexBox } from "components/flex-box";
import { Span } from "components/Typography";
// ThemeSwitcher removed from topbar
import Link from "next/link";
import { useEffect, useState } from "react";
import { layoutConstant } from "utils/constants";
import { useSession, signIn, signOut, destroy } from 'next-auth/react';
import DrawerComponent from "components/topbar/drawer";
import { toast } from 'react-toastify';
import ReactModal from 'react-modal'; 
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
const TopbarWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'color',
})(({ theme, bgColor, color }) => ({
  fontSize: 12,
  height: layoutConstant.topbarHeight,
  background: bgColor || (theme.palette.mode === 'dark' 
    ? "rgba(15, 23, 42, 0.95)" 
    : theme.palette.secondary.dark),
  color: color || (theme.palette.mode === 'dark' 
    ? "#FFFFFF" 
    : theme.palette.secondary.contrastText),
  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 1100,
  position: 'relative',
  display: 'block',
  visibility: 'visible',
  opacity: 1,
  // Ensure all text and icons are visible in dark mode
  "& a": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      opacity: 0.85,
    },
  },
  "& svg": {
    color: "inherit",
  },
  "& p, & span": {
    color: "inherit",
  },
  "& .topbarLeft": {
    "& .logo": {
      display: "none",
    },
    "& .title": {
      marginLeft: "10px",
      fontsize: 12,
      color: "inherit", // Ensure title text inherits color
    },
    "& .icon": {
      color: "inherit", // Ensure icons inherit color
    },
    "& .drawer": {
      display: "none",
    },

    "@media only screen and (max-width: 600px)": {
      "& .logo": {
        display: "none",
      },
      "& .title": {
        marginLeft: "0px",
        fontSize: 10,
        display: "none",
      },
      "& .icon": {
        display: "none"
      },
      "& .drawer": {
        justifyContent: 'flex-start',
        display: "block",
      },
      "& > *:not(.drawer)": {
        display: "none",
      },
    },
  },
  "& .topbarRight": {
    "& .link": {
      paddingRight: 30,
      color: theme.palette.mode === 'dark' 
        ? "rgba(255, 255, 255, 0.9)" 
        : theme.palette.secondary.contrastText,
      fontSize: 12,
    },
    "@media only screen and (max-width: 600px)": {
      "& .link": {
        display: "none",
        fontSize: 10,
      },
    },
  },


  "& .menuItem": {
    minWidth: 100,
  },
  "& .marginRight": {
    marginRight: "1.25rem",
  },
  "& .handler": {
    height: layoutConstant.topbarHeight,
  },
  "& .smallRoundedImage": {
    height: 15,
    width: 25,
    borderRadius: 2,
  },
  "& .menuTitle": {
    fontSize: 12,
    marginLeft: "0.5rem",
    fontWeight: 600,
  },
}));



const Topbar = ({ bgColor,topbardata, color }) => {
  const { data: session } = useSession();
  async function tokenBlacklist(){
    const payload = {
      // refresh: session.refreshToken,
      userId:session.user.id,
      accessToken: session.accessToken
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE}apiSignOut`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
  
      })
      const res = await response.json()
      if(res['ErrorCode'] == 0){
              // toast.success(res.data['ErrorMsg'], {
              //   position: toast.POSITION.TOP_RIGHT
              // });
              signOut();
            }
      else{toast.error(res['ErrorMsg'], {position: toast.POSITION.TOP_RIGHT});}
      return res;
    } catch (error) {
      if (error.response) {
          if(error.response.status==400){
            for(var i=0;i<Object.keys(error.response.data).length;i++){
              var key = Object.keys(error.response.data)[i];
              var value = error.response.data[key].toString();
              toast.error(<div>Field: {key} <br/>Error Message: {value}</div>, {position: toast.POSITION.TOP_RIGHT});
            }
          }
          else{toast.error('Error Occured! '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
          }
          return error.response
      } else if (error.request) {toast.error('Network Error', {position: toast.POSITION.TOP_RIGHT});
          return error.request
        } else {toast.error('Error Occured', {position: toast.POSITION.TOP_RIGHT});
          return error
        }
    }
    }


    const imgbaseurl = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "media/";
const server_ip=process.env.NEXT_PUBLIC_BACKEND_API_BASE
    const handleSignOut = () => {tokenBlacklist()}


  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  // Removed todayDealStyle - no longer needed

  const[coupon,setCoupon]=useState()

  useEffect(() => {
    const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
    fetch(server_ip+'getvoucher')
      .then((res) => res.json())
      .then((data) => {
        setCoupon(data)
      })
      .catch((error) => {
        console.error('Error fetching voucher:', error);
      })
  }, [])
 
  const data = coupon?.voucher?.[0] || null

  
  const couponContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
  };

  const modalContentStyle = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)',
    },
    content: {
      width: '90%',
      maxWidth: '500px',
      margin: 'auto',
      padding: '0',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      border: 'none',
      overflow: 'hidden',
      top: 'auto',
      left: 'auto',
      right: 'auto',
      bottom: 'auto',
    },
  };
  
  const couponTitleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    margin: '16px 0 8px 0',
    color: '#1a1a1a',
    textAlign: 'center',
  };

  const couponInfoStyle = {
    fontSize: '15px',
    margin: '6px 0',
    color: '#666',
    textAlign: 'center',
  };

  const couponCodeContainerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    padding: '20px',
    margin: '20px 0',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  };

  const couponCodeTextStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
    letterSpacing: '2px',
    fontFamily: 'monospace',
  };

  const copyButtonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    fontWeight: '600',
  };

  const discountBadgeStyle = {
    display: 'inline-block',
    backgroundColor: '#ff6b6b',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '12px',
  };

  const dateContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  };

  const dateItemStyle = {
    textAlign: 'center',
    flex: 1,
  };

  const dateLabelStyle = {
    fontSize: '12px',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '4px',
  };

  const dateValueStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  };


  const handleCopyClick = async (couponCode) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(couponCode);
        toast.success("Code Copied Successfully!", {
          position: toast.POSITION.TOP_RIGHT
        });
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = couponCode;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        toast.success("Code Copied Successfully!", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    } catch (err) {
      console.error('Error copying coupon code:', err);
      toast.error("Failed to copy code", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  if (session) {
    return (
      <TopbarWrapper bgColor={bgColor}>
        <Container
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <FlexBox className="topbarLeft">
            <div className="logo">
              <Link href="/" passHref>
                <Image
                  height={28}
                  width={120}
                  src={topbardata?imgbaseurl+topbardata[0].site_logo:'/assets/images/logos/webpack.png'}
                  alt="logo"
                  priority
                  quality={95}
                  sizes="120px"
                  style={{
                    display: 'block',
                    objectFit: 'contain',
                    filter: 'brightness(1.1) contrast(1.1)',
                    transition: 'all 0.3s ease',
                  }}
                />
              </Link>
            </div>
            <FlexBox className="drawer">
              <DrawerComponent />
            </FlexBox>
            <FlexBox>
              <FlexBox alignItems="center">
                <CallOutlined className="icon" fontSize="small" sx={{ color: 'inherit' }} />
                <Span className="title" sx={{ color: 'inherit' }}>
  <a href={`tel:${topbardata ? topbardata[0].top_bar_left_phone : ''}`} style={{ color: 'inherit', textDecoration: 'none' }}>
    {topbardata ? topbardata[0].top_bar_left_phone : '+923'}
  </a>
</Span>
              </FlexBox>

              <FlexBox alignItems="center" ml={2.5}>
                <MailOutline className="icon" fontSize="small" sx={{ color: 'inherit' }} />
                <Span className="title" sx={{ color: 'inherit' }}>
                  <a href={`mailto:${topbardata?topbardata[0].top_bar_left_email:''}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {topbardata?topbardata[0].top_bar_left_email:'email@company.com'}
                  </a>
                </Span>
              </FlexBox>
            </FlexBox>
          </FlexBox>
          <FlexBox className="topbarRight" alignItems="center" gap={2} style={{ cursor: 'pointer' }}>
          <LogoutIcon fontSize="small" onClick={handleSignOut} sx={{ color: 'inherit' }} />
          <Span sx={{ color: 'inherit', fontSize: '12px' }}> Sign Out</Span>
               </FlexBox>
      </Container>

      <ReactModal
        isOpen={isPopupOpen}
        onRequestClose={closePopup}
        contentLabel="Voucher Popup"
        style={modalContentStyle}

      >
       
        <CloseIcon
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            cursor: 'pointer',
            color: '#666',
            zIndex: 1,
            transition: 'color 0.2s ease',
          }}
          onClick={closePopup}
          onMouseEnter={(e) => e.target.style.color = '#000'}
          onMouseLeave={(e) => e.target.style.color = '#666'}
        />
      <div className="voucher-content" style={couponContainerStyle}>
          {data ? (
            <>
              {data.image && (
                <Image
                  src={imgbaseurl + data.image}
                  alt={data.name || 'Voucher'}
                  width={400}
                  height={200}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    objectFit: 'cover',
                    maxHeight: '200px',
                  }}
                  loading="lazy"
                />
              )}
              <div style={discountBadgeStyle}>
                {data.discount || 0}% OFF
              </div>
              <h2 style={couponTitleStyle}>{data.name || ''}</h2>
              
              <div style={couponCodeContainerStyle}>
                <span style={couponCodeTextStyle}>{data.code || ''}</span>
                <button
                  onClick={() => handleCopyClick(data.code || '')}
                  style={copyButtonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <FileCopyIcon style={{ fontSize: '18px' }} />
                  Copy
                </button>
              </div>

              <div style={dateContainerStyle}>
                <div style={dateItemStyle}>
                  <div style={dateLabelStyle}>Start Date</div>
                  <div style={dateValueStyle}>{data.startdate || 'N/A'}</div>
                </div>
                <div style={{ width: '1px', backgroundColor: '#ddd', margin: '0 16px' }}></div>
                <div style={dateItemStyle}>
                  <div style={dateLabelStyle}>End Date</div>
                  <div style={dateValueStyle}>{data.enddate || 'N/A'}</div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ ...couponInfoStyle, fontSize: '18px', color: '#999' }}>
                No voucher available at this time.
              </p>
            </div>
          )}
             </div>
      </ReactModal>
      </TopbarWrapper>
    );
  }
  // handleClick();onClick={() => {  signOut;}}
  else {
    return (
      <TopbarWrapper bgColor={bgColor} color={color}>
        <Container
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <FlexBox className="topbarLeft">
            <div className="logo">
              <Link href="/" passHref>
              <Image
                  height={28}
                  width={120}
                  src={topbardata?imgbaseurl+topbardata[0].site_logo:'/assets/images/logos/webpack.png'}
                  alt="logo"
                  priority
                  quality={95}
                  sizes="120px"
                  style={{
                    display: 'block',
                    objectFit: 'contain',
                    filter: 'brightness(1.1) contrast(1.1)',
                    transition: 'all 0.3s ease',
                  }}
                />
              </Link>
            </div>
            <FlexBox className="drawer">
              <DrawerComponent />
            </FlexBox>
            <FlexBox>
              <FlexBox alignItems="center">
                <CallOutlined className="icon" fontSize="small" sx={{ color: 'inherit' }} />
                <Span className="title" sx={{ color: 'inherit' }}>
                  <a href={topbardata?topbardata[0].top_bar_left_phone:''} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {topbardata ? topbardata[0].top_bar_left_phone : '+923'}
                  </a>
                </Span>
              </FlexBox>

              <FlexBox alignItems="center" ml={2.5}>
                <MailOutline className="icon" fontSize="small" sx={{ color: 'inherit' }} />
                <Span className="title" sx={{ color: 'inherit' }}>
                  <a href={`mailto:${topbardata?topbardata[0].top_bar_left_email:''}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {topbardata?topbardata[0].top_bar_left_email:'email@company.com'}
                  </a>
                </Span>
              </FlexBox>
            </FlexBox>
          </FlexBox>
          <FlexBox className="topbarRight" alignItems="center" gap={2} style={{'cursor': 'pointer'}} >
            <LoginIcon fontSize="small" onClick={signIn} sx={{ color: 'inherit' }} />
            <Span sx={{ color: 'inherit', fontSize: '12px' }}> Sign In</Span>
          </FlexBox>
        </Container>
        <ReactModal
        isOpen={isPopupOpen}
        onRequestClose={closePopup}
        contentLabel="Voucher Popup"
        style={modalContentStyle}

      >
       
        <CloseIcon
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            cursor: 'pointer',
            color: '#666',
            zIndex: 1,
            transition: 'color 0.2s ease',
          }}
          onClick={closePopup}
          onMouseEnter={(e) => e.target.style.color = '#000'}
          onMouseLeave={(e) => e.target.style.color = '#666'}
        />
      <div className="voucher-content" style={couponContainerStyle}>
          {data ? (
            <>
              {data.image && (
                <Image
                  src={imgbaseurl + data.image}
                  alt={data.name || 'Voucher'}
                  width={400}
                  height={200}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    objectFit: 'cover',
                    maxHeight: '200px',
                  }}
                  loading="lazy"
                />
              )}
              <div style={discountBadgeStyle}>
                {data.discount || 0}% OFF
              </div>
              <h2 style={couponTitleStyle}>{data.name || ''}</h2>
              
              <div style={couponCodeContainerStyle}>
                <span style={couponCodeTextStyle}>{data.code || ''}</span>
                <button
                  onClick={() => handleCopyClick(data.code || '')}
                  style={copyButtonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <FileCopyIcon style={{ fontSize: '18px' }} />
                  Copy
                </button>
              </div>

              <div style={dateContainerStyle}>
                <div style={dateItemStyle}>
                  <div style={dateLabelStyle}>Start Date</div>
                  <div style={dateValueStyle}>{data.startdate || 'N/A'}</div>
                </div>
                <div style={{ width: '1px', backgroundColor: '#ddd', margin: '0 16px' }}></div>
                <div style={dateItemStyle}>
                  <div style={dateLabelStyle}>End Date</div>
                  <div style={dateValueStyle}>{data.enddate || 'N/A'}</div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ ...couponInfoStyle, fontSize: '18px', color: '#999' }}>
                No voucher available at this time.
              </p>
            </div>
          )}
             </div>
      </ReactModal>
      </TopbarWrapper>
    );
  }

};

export default Topbar;
