import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import MyProfile from "../dashboard/MyProfile";
import {
  myProfile,
  userLogout,
  userNotification,
} from "../../services/authService";
import { store } from "../../redux/store";
import { clearAuth } from "../../redux/slice/authSlice";
import { setIsAuthenticated } from "../../redux/slice/globalSlice";
import ChangePassword from "../dashboard/ChangePassword";
import Credit from "../dashboard/Credit";
import { toast } from "react-toastify";
import VisualizerPage from "./VisualizerPage";
import DashboardNavbar from "../dashboard/DashboardNavbar";
import DashboardComponent from "../dashboard/Dashboard";
import { dashboardService } from "../../services/dashboardService";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";



const Dashboard = () => {
  const dashboard = useSelector((store) => store.dashboard.dashboard);
  return (
    <>
      <div className="bg-primaryGrey">
        <DashboardNavbar  />
          <DashboardComponent
            dashboard={dashboard}
          />
      
      </div>
    </>
  );
};

export default Dashboard;
