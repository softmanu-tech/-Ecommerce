import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState, useCallback } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);
  
  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();

      if (data.success) {
        dispatch(setUserDetails(data.data));
      } else {
        throw new Error(data.message || 'Failed to fetch user details');
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details");
    }
  }, [dispatch]);

  const fetchUserAddToCart = useCallback(async () => {
    try {
      const response = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: 'include',
        headers:{
          'Content-type':'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart data');
      }

      const data = await response.json();
      setCartProductCount(data?.data?.count || 0);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      toast.error("Failed to fetch cart data");
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
    fetchUserAddToCart();
  }, [fetchUserDetails, fetchUserAddToCart]);



  return (
    <Context.Provider value={{
      fetchUserDetails,
      cartProductCount,
      fetchUserAddToCart
    }}>
      <ToastContainer position='top-center' />
      <Header />
      <main className='min-h-[calc(100vh-120px)] pt-16'>
        <Outlet />
      </main>
      <Footer />
    </Context.Provider>
  );
}

export default App;