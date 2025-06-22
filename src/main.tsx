import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={createBrowserRouter([
  ])} />
);
