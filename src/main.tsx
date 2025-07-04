import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={createBrowserRouter([
    ])} />
    <Toaster />
  </>
);
