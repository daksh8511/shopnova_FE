import { createBrowserRouter } from "react-router-dom";
import App from './App'
import ProductsPage from "./pages/ProductsPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthRoute from "./components/AuthRoutes";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";

export const router = createBrowserRouter([
    {
        path: '',
        element: <App />,
        children: [
            {
                path: '',
                element: <Home />
            },
            {
                path: 'products',
                element: <ProductsPage />
            },
            {
                path: 'products/:id',
                element: <ProductDetails />
            },
            {
                path: 'checkout',
                element: <Checkout />
            },
        ]
    },
    {
        path: 'login',
        element: <AuthRoute><Login /></AuthRoute>
    },
    {
        path: 'signup',
        element: <AuthRoute><Signup /></AuthRoute>
    }
])