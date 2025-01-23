import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import Cookies from 'js-cookie';
import { API_URL } from "../App.jsx";



const adminContext = createContext();


export const AdminProvider = ({ children }) => {
    const [role, setRole] = useState("");
    const [token, setToken] = useState("");
    const [loggedInUser, setloggedInUser] = useState(null);
    const [products, setProduct] = useState([]);
    const [categories, setCategory] = useState([]);
    const [subCategories, setSubCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const currency = "Rs/-";
    const delivery_Fee = 200;


    // set with expity used for to store items in local storage

    const setWithExpiry = (key, value, timeInHours) => {
        const timeNow = new Date()
        const items = {
            value: value,
            expiry: timeNow.getTime() + timeInHours * 60 * 60 * 1000
        }
        localStorage.setItem(key, JSON.stringify(items))

    }
    // getting items with expity used for to get items in local storage
    const getWithExpiry = (key) => {
        const items = localStorage.getItem(key);
        if (!items) return null

        const item = JSON.parse(items)
        const timesNow = new Date();

        if (timesNow.getTime() > item.expiry) {
            localStorage.removeItem(key)
            return null
        }
        return item.value
    }
    useEffect(() => {
        const storedUser = JSON.parse(getWithExpiry("loggedIn"))
        if (storedUser) {
            setloggedInUser(storedUser)
            const userRole = getWithExpiry("role");
            setRole(userRole);
            const accessToken = Cookies.get('accessToken');
            setToken(accessToken);
            console.log("token for context", token)
        }
    }, [token, setToken])

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        setToken(accessToken);
    }, [token, setToken])
    useEffect(() => {
        setRole(getWithExpiry("role"));
        console.log("role", role)
    }, [role, setRole])


    const getProductAsync = async () => {
        try {
            const getProductResponse = await axios.get(`${API_URL}/product/get-products`);
            setProduct(getProductResponse.data.products ? getProductResponse.data.products : []);
        } catch (error) {
            console.log("Error while getting products", error);
            toast.error("Failed to load products");
        }
    };

    const getCategories = async () => {
        try {
            const getCategoriesResponse = await axios.get(`${API_URL}/category/get-categorys`);
            if (getCategoriesResponse.data.success) {
                setCategory(getCategoriesResponse.data.categories ? getCategoriesResponse.data.categories : []);
            }
        } catch (error) {
            console.log("Error while getting categories", error);
        }
    };

    const getSubCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/subcategory/get-all-subcategory`);
            if (response.data.success) {
                const { subcategories } = response.data;
                setSubCategory(subcategories ? subcategories : []);
            }
        } catch (error) {
            console.log("Error while getting subcategories", error);
        }
    };

    useEffect(() => {
        getProductAsync();
        getCategories();
        getSubCategories();
    }, [products]);
    const values = {
        loggedInUser, setloggedInUser,
        role, setRole,
        token, setToken,
        products, setProduct,
        categories, setCategory,
        subCategories, setSubCategory,
        isLoading, setIsLoading,
        setWithExpiry, getWithExpiry,
        currency, delivery_Fee
    }
    return (
        <adminContext.Provider value={values}>
            {children}
        </adminContext.Provider>
    )
}



export const useAdminContext = () => useContext(adminContext)