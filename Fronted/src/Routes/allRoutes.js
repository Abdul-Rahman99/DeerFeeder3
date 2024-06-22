import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import DashboardEcommerce from "../pages/DashboardEcommerce/BirdDasboard";
import BirdAnalysis from "../pages/DashboardEcommerce/BirdAnalysis";
import SensorsAnalysis from "../pages/DashboardEcommerce/SensorsAnalysis";

import FeedProfile from "../pages/DashboardEcommerce/FeedProfile";
import FeedSetting from "../pages/DashboardEcommerce/FeedSetting";

import BirdSpecies from "../pages/DashboardEcommerce/BirdSpecies";
import MqttCommands from "../pages/MqttCommands";
import UserProfile from "../pages/Authentication/user-profile";

//APi Key
import APIKey from "../pages/APIKey/index";

import Logout from "../pages/Authentication/Logout";
import Login from "../pages/Authentication/Login";

import ResetPassword from "../pages/Authentication/ResetPassword";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Register from "../pages/Authentication/Register";

import ManageUsers from "../pages/Administration/ManageUsers";
import ManageUserTypes from "../pages/Administration/ManageUserTypes";
import ManageRoles from "../pages/Administration/ManageRoles";
import ManagePermissions from "../pages/Administration/ManagePermissions";
import ManageUserRoles from "../pages/Administration/ManageUserRoles";
import UserPermissions from "../pages/Administration/UserPermissions";
import ManageBirdFeedDevices from "../pages/Administration/ManageBirdFeedDevices";
import ManageBirds from "../pages/Administration/ManageBirds";


const authProtectedRoutes = [
  { path: "/dashboard", component: <DashboardEcommerce /> },
  { path: "/index", component: <DashboardEcommerce /> },
  { path: "/bird-analysis", component: <BirdAnalysis /> },
  { path: "/sensors-analysis", component: <SensorsAnalysis /> },
  { path: "/feed-profile", component: <FeedProfile /> },
  { path: "/feed-setting", component: <MqttCommands /> },
  { path: "/bird-detector", component: <BirdSpecies /> },
  // Administration
  { path: "/manage-users", component: <ManageUsers /> },
  { path: "/manage-usertypes", component: <ManageUserTypes /> },
  { path: "/manage-roles", component: <ManageRoles /> },
  { path: "/manage-permissions", component: <ManagePermissions /> },

  { path: "/user-roles", component: <ManageUserRoles /> },
//  { path: "/user-permissions", component: <UserPermissions /> },
  { path: "/bird-feeding-devices", component: <ManageBirdFeedDevices /> },
  { path: "/manage-birds", component: <ManageBirds /> },

  { path: "/commands", component: <MqttCommands /> },
  //User Profile
  { path: "/profile", component: <UserProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
  { path: "/reset-password", component: <ResetPassword /> },


];

export { authProtectedRoutes, publicRoutes };
