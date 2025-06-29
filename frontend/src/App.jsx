import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import SignUp from "./page/voyager/signUp";
import Home from "./page/voyager/Home";
import AdminLoginPage from "./page/admin/AdminLoginPage";
import CateringListAdmin from "./page/admin/CateringListAdmin";
import FitnessCenterListAdmin from "./page/admin/FitnessCenterListAdmin";
import MoviesList from "./page/admin/MoviesList";
import PartyHallList from "./page/admin/PartyHallList";
import ResortList from "./page/admin/ResortList";
import StationaryList from "./page/admin/StationaryList";
import MoviesListUser from "./page/voyager/moviesListVoyager";
import CateringOrderPage from "./page/voyager/cateringOrderPage";
import StationaryOrderPage from "./page/voyager/StationaryOrderPage";
import ResortBookingPage from "./page/voyager/ResortBookingPage";
import FitnessBookingPage from "./page/voyager/FitnessBookingPage";
import PartyHallBookingPage from "./page/voyager/PartyHallBookingPage";
import ManagerLoginPage from "./page/manager/ManagerLogin";
import HeadCookLoginPage from "./page/headCook/HeadCookLoginPage";
import SupervisorLoginPage from "./page/supervisor/SupervisorLoginPage";
import ManagerDashboard from "./page/manager/ManagerDashboard";
import CateringListsHeadCook from "./page/headCook/CateringListsHeadCook";
import StationaryOrdersSupervisor from "./page/supervisor/StationaryOrdersSupervisor";
import StaffSignUp from "./page/staff/StaffSignUp";
import AdminStaffApproval from "./page/admin/AdminStaffApproval";
import AuthenticateAdmin from "./page/admin/AuthenticateAdmin";
import VoyagerLoginPage from "./page/voyager/VoyagerLoginPage";
import AuthenticateVoyager from "./page/voyager/AuthenticateVoyager";
import ContactUs from "./page/voyager/ContactUsPage";
import VoyagerProfile from "./page/voyager/ProfilePage";
import BeautySalonList from "./page/admin/BeautySalonList";
import BeautySalonBookingPage from "./page/voyager/BeautySalonBookingPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*voyager side */}
          <Route path="/" element={<Home />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<VoyagerLoginPage />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route element={<AuthenticateVoyager />}>
            <Route path="/profilePage" element={<VoyagerProfile />} />
            <Route path="/moviesList" element={<MoviesListUser />} />
            <Route path="/cateringOrderPage" element={<CateringOrderPage />} />
            <Route
              path="/stationaryOrderPage"
              element={<StationaryOrderPage />}
            />
            <Route path="/resortBookingPage" element={<ResortBookingPage />} />
            <Route
              path="/fitnessBookingPage"
              element={<FitnessBookingPage />}
            />
            <Route
              path="/partyHallBookingPage"
              element={<PartyHallBookingPage />}
            />
            <Route
              path="/beautySalonBookingPage"
              element={<BeautySalonBookingPage />}
            />
          </Route>

          {/*admin side */}

          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route element={<AuthenticateAdmin />}>
            <Route path="/admin-cateringList" element={<CateringListAdmin />} />
            <Route path="/admin-moviesList" element={<MoviesList />} />
            <Route
              path="/admin-fitnessList"
              element={<FitnessCenterListAdmin />}
            />
            <Route path="/admin-partyHall" element={<PartyHallList />} />
            <Route path="/admin-BeautySalon" element={<BeautySalonList />} />
            <Route path="/admin-resortList" element={<ResortList />} />
            <Route path="/admin-stationaryList" element={<StationaryList />} />
            <Route
              path="/admin-StaffsApproval"
              element={<AdminStaffApproval />}
            />
          </Route>

          {/*manager side */}

          <Route path="/manager-Login" element={<ManagerLoginPage />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />

          {/*head cook side */}

          <Route path="/headCook-Login" element={<HeadCookLoginPage />} />
          <Route
            path="/headCook-CateringLists"
            element={<CateringListsHeadCook />}
          />

          {/* supervisor side */}

          <Route path="/supervisor-Login" element={<SupervisorLoginPage />} />
          <Route
            path="/supervisor-StationaryLists"
            element={<StationaryOrdersSupervisor />}
          />

          {/* staffs signUp */}

          <Route path="/staffs-signUp" element={<StaffSignUp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
