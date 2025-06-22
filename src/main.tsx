import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { createRoot } from 'react-dom/client'
import P6 from '../src/pages/customer_list_page_customer.tsx';
import P8 from '../src/pages/customer_detail_page_customer_id.tsx';
import P9 from '../src/pages/edit_customer_page_customer_id_edit.tsx';
import P11 from '../src/pages/final_status_page_customer_id_status.tsx';
import P10 from '../src/pages/verify_customer_page_customer_id_verify.tsx';
import P5 from '../src/pages/add_customer_page_customer_add.tsx';
import P4 from '../src/pages/dashboard_page_dashboard.tsx';
import P2 from '../src/pages/forgot_password_page_forgot_password.tsx';
import P1 from '../src/pages/login_page_login.tsx';
import P7 from '../src/pages/logout_confirmation_page_logout.tsx';
import P3 from '../src/pages/register_page_register.tsx';

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={createBrowserRouter([
    // [src/pages/customer_list_page_customer.tsx] Customer List Page
    { path: "/customer", element: <P6 /> },
    // [src/pages/customer_detail_page_customer_id.tsx] Customer Detail Page
    { path: "/customer/:id", element: <P8 /> },
    // [src/pages/edit_customer_page_customer_id_edit.tsx] Edit Customer Page
    { path: "/customer/:id/edit", element: <P9 /> },
    // [src/pages/final_status_page_customer_id_status.tsx] Final Status Page
    { path: "/customer/:id/status", element: <P11 /> },
    // [src/pages/verify_customer_page_customer_id_verify.tsx] Verify Customer Page
    { path: "/customer/:id/verify", element: <P10 /> },
    // [src/pages/add_customer_page_customer_add.tsx] Add Customer Page
    { path: "/customer/add", element: <P5 /> },
    // [src/pages/dashboard_page_dashboard.tsx] Dashboard Page
    { path: "/dashboard", element: <P4 /> },
    // [src/pages/forgot_password_page_forgot_password.tsx] Forgot Password Page
    { path: "/forgot-password", element: <P2 /> },
    // [src/pages/login_page_login.tsx] Login Page
    { path: "/login", element: <P1 /> },
    // [src/pages/logout_confirmation_page_logout.tsx] Logout Confirmation Page
    { path: "/logout", element: <P7 /> },
    // [src/pages/register_page_register.tsx] Register Page
    { path: "/register", element: <P3 /> },
  ])} />
);
