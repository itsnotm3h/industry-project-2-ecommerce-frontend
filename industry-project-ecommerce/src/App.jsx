import React, { useEffect,useState } from 'react';
import { Route, Switch } from 'wouter';
import Home from './Home';
import ProductInfo from './ProductInfo';
import Products from './Products';
import Cart from './Cart';
import Login from './Login';
import Register from './Register';

import axios from 'axios';



export default function App() {
  

  useEffect(()=>{
    const initSession = async ()=>{
      const response =  await axios.post(`${import.meta.env.VITE_API_URL}/session/init`,{},{withCredentials:true})
      .then()
      .catch(error => console.error(error));
    };

    initSession();
  },[]);
  
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products/:id" component={ProductInfo} />
        <Route path="/products" component={Products} />
        <Route path="/cart" component={Cart}/>
        <Route path="/register" component={Register}/>
        <Route path="/login" component={Login}/>
        {/* <Route path="/admin-dashboard" component={Dashboard}/> */}
      </Switch>
    </>
  )
};