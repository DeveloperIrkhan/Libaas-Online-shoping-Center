import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, useNavigate } from 'react-router-dom'
import './App.css'
import './CustomTostify.css'
import Home from './Pages/Home'
import Collection from './Pages/Collection'
import About from './Pages/About'
import Cart from './Pages/Cart'
import Contact from './Pages/Contact'
import MyOrders from './Pages/MyOrders'
import PlaceOrder from './Pages/PlaceOrder'
import Product from './Pages/Product'
import SummerSale from './Pages/SummerSale'
import Footwear from './Pages/Footwear'
import Layout from './Components/Layout/Layout'
import NewArrivals from './Pages/NewArrivals'
import BestSellers from "./Pages/BestSellers"
import Clothing from "./Pages/Clothing"
import Accessories from "./Pages/Accessories"
import ReturnRefundPolicy from "./Pages/ReturnRefundPolicy/ReturnRefundPolicy"
import Auth from './Pages/Auth'
import ProductDetails from './Pages/ProductDetails'
import Perfumes from './Pages/Perfumes'
import { useShopContext } from './Context/Context'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from './Components/Layout/AdminLayout'
import AddItem from './Pages/AdminPanel/pages/AddItem'
import ListOrder from './Pages/AdminPanel/pages/ListOrder'
import AddCategory from './Pages/AdminPanel/pages/AddCategory'
import AddSubCategory from './Pages/AdminPanel/pages/AddSubCategory'
import ListProduct from './Pages/AdminPanel/pages/ListProduct'
import Cookies from "js-cookie"
import Profile from './Pages/Profile'
import { useEffect, useState } from 'react'
import axios from 'axios'
function App() {
  const { loggedInUser, setloggedInUser, setWithExpiry, setToken, setRole } = useShopContext();
  const [refreshToken, setrefreshToken] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const API_URL = import.meta.env.VITE_BACKEND_URL
  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    console.log("Initial accessToken:", accessToken);
    console.log("Initial refreshToken:", refreshToken);
    setrefreshToken(refreshToken)
    setAccessToken(accessToken)
    if (refreshToken && (!accessToken || accessToken === undefined)) {
      getUserUsingRefreshToken();
    }
    else {
      setloggedInUser(null);
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("role");
      localStorage.removeItem("cartItems");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    }
  }, [])

  const getUserUsingRefreshToken = async () => {
    // const response = await axios.get(`http://localhost:8080/api/v1/auth/get-refresh-token`,{},
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/auth/get-refresh-token`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${refreshToken}`  // Send refreshToken as part of the headers if needed
          }
        },)
      console.log("response", response)
      if (response.data.success) {
        const { message } = response.data;
        toast.success(message);

        const { accessToken, refreshToken, loggedIn } = response.data;
        // const accessTokenExpiry = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);
        // Cookies.set('accessToken', accessToken, { expires: accessTokenExpiry, path: '/' });
        // Cookies.set('refreshToken', refreshToken, { expires: 7, path: '/' });
        setToken(accessToken);
        setrefreshToken(refreshToken)
        setAccessToken(accessToken)
        setWithExpiry("loggedIn", JSON.stringify(loggedIn), 7)
        if (loggedIn.UserRole === 2) {
          setRole("Admin")
          setWithExpiry("role", "Admin", 7)
          toast.success("Admin login successfully")
          setloggedInUser(loggedIn)
        }
        else {
          setRole("User")
          setloggedInUser(loggedIn)
          setWithExpiry("role", "User", 7)
          toast.success("Logged in successfully");
        }
      }
    } catch (error) {
      console.log(error)
      if (error.response && error.response.data.message === "refresh token is expired") {
        toast.error("Your session has expired. Please log in again.");
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
      }
    }
  }



  const routes = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/collections' element={<Collection />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/summer-sale' element={<SummerSale />} />
          <Route path='/Footwear' element={<Footwear />} />
          <Route path='/perfumes' element={<Perfumes />} />
          <Route path='/new-arrivals' element={<NewArrivals />} />
          <Route path='/best-sellers' element={<BestSellers />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/Clothing' element={<Clothing />} />
          <Route path='/Accessories' element={<Accessories />} />
          <Route path='/about-us' element={<About />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/refund-policy' element={<ReturnRefundPolicy />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/about-us' element={<About />} />
          <Route path='/products' element={<Product />} />
          <Route path='/product-details/:_id' element={<ProductDetails />} />
        </Route>
        <Route path='/admin-panel/' element={<AdminLayout />}>
          <Route path='add-item' element={<AddItem />} />
          <Route path='add-category' element={<AddCategory />} />
          <Route path='add-sub-category' element={<AddSubCategory />} />
          <Route path='list-products' element={<ListProduct />} />
          <Route path='list-orders' element={<ListOrder />} />
        </Route>
      </>
    )
  )



  return (
    <>
      <ToastContainer />
      <div>
        <RouterProvider router={routes} />
      </div>
    </>
  )
}

export default App
