import React, { useState } from "react";
import { CallOutlined, ExpandMore, MailOutline,LogOut } from "@mui/icons-material";

import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Span } from "components/Typography";
import { FlexBox } from "components/flex-box";
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
  } from "@mui/material";

  import { IconButton } from "@mui/material";

// import { makeStyles } from '@mui/styles';
// import { Link } from "react-router-dom";

import Link from "next/link";
const phonenumber=process.env.NEXT_PUBLIC_PHONE
const email=process.env.NEXT_PUBLIC_EMAIL

function DrawerComponent() {
    const [openDrawer, setOpenDrawer] = useState(false);
    return (
        <>
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}>
                    <List>
                        <ListItem onClick={() => setOpenDrawer(false)}>
                            <ListItemText>
                                <FlexBox sx={{
                                     alignItems: 'center',
                                }}>
                                    <CallOutlined fontSize="small" style={{ color: "#cc0000" }} />
                                    <Span className="title" style={{ color: "#303444", marginLeft: "10px", }}><a href={phonenumber}>{phonenumber}</a></Span>
                                </FlexBox>
                            </ListItemText>
                        </ListItem>
                        <ListItem onClick={() => setOpenDrawer(false)}>
                            <ListItemText>
                                <FlexBox sx={{
                                     alignItems: 'center',
                                }}>
                                    <MailOutline fontSize="small" style={{ color: "#cc0000" }}/>
                                    <Span className="title" style={{ color: "#303444", marginLeft: "10px", }}>{email}</Span>
                                </FlexBox>
                            </ListItemText>
                        </ListItem>
                    </List>
            </Drawer>
            <IconButton 
                onClick={() => setOpenDrawer(!openDrawer)}
                aria-label={openDrawer ? "Close menu" : "Open menu"}
                aria-expanded={openDrawer}
                sx={{ minWidth: '44px', minHeight: '44px' }}
            >
                <MenuOutlinedIcon  style={{ color: "white" }} />
            </IconButton>
        </>
    );
}
export default DrawerComponent;

//rgb(48,52,68)
