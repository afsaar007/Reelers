import React from "react";
import { createBrowserRouter } from "react-router-dom";
import UserRegister from "../page/auth/UserRegister";
import UserLogin from "../page/auth/UserLogin";
import FoodPartnerLogin from "../page/auth/FoodPartnerLogin";
import FoodPartnerRegister from "../page/auth/FoodPartnerRegister";
import CreateFood from "../page/food-partner/CreateFood";
import Profile from "../page/food-partner/Profile";
import Home from '../page/General/Home';
import Saved from "../page/General/Saved";

 const AppRoutes = createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  }, {
    path:'/create-food',
    element:<CreateFood/>

  },
    {
      path: "/user/register",
      element:<UserRegister/>,
    },
    {
      path: "/user/login",
      element: <UserLogin/>,
    },
    {
      path: "/food-partner/register",
      element: <FoodPartnerRegister />,
    },
    {
      path:"/food-partner/login",
      element:<FoodPartnerLogin/>
    },
    {
      path:'/food-partner/profile/:id',
      element:<Profile/>
    },
    {
      path:'/saved',
      element:<Saved/>
    }
  ]);

export default AppRoutes;
