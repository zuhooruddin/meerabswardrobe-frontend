import ShoppingBag from "@mui/icons-material/ShoppingBag";
import UserDashboardHeader from "components/header/UserDashboardHeader";
import CustomerDashboardLayout from "components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "components/layouts/customer-dashboard/Navigations";
import OrderList from "pages-sections/orders/OrderList";
import { FlexRowCenter } from "components/flex-box";
import Login from "pages-sections/sessions/Login";
import Link from "next/link";
import { signOut } from "next-auth/react"
import { useSession } from 'next-auth/react';
const Orders = () => {
  const { data: session } = useSession({required:true});
  if (session && 'error' in session && session.error == "SessionTimedOut") {
    signOut({redirect: false});
    return (
      <FlexRowCenter flexDirection="column" minHeight="100vh">

        <Login />
        <Link href='/'>Back to Home</Link>
      </FlexRowCenter>
    )
  }
  else if (session){
  return (
    <CustomerDashboardLayout>
      <UserDashboardHeader
        title="My Orders"
        icon={ShoppingBag}
        navigation={<CustomerDashboardNavigation />}
      />

      <OrderList />
    </CustomerDashboardLayout>
  );
  }
  else{
    return (
      <FlexRowCenter flexDirection="column" minHeight="100vh">

        <Login />
        <Link href='/'>Back to Home</Link>
      </FlexRowCenter>
    )
  }
};

export default Orders;
