import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import SignUp from "./page/voyager/signUp";
import Home from "./page/voyager/Home";
import AdminLoginPage from "./page/admin/AdminLoginPage";
import Sidebar from "./page/admin/sidebar";
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
import VoyagerSidebar from "./page/voyager/voyagerSideBar";
import ManagerLoginPage from "./page/manager/ManagerLogin";
import HeadCookLoginPage from "./page/headCook/HeadCookLoginPage";
import SupervisorLoginPage from "./page/supervisor/SupervisorLoginPage";
import ManagerDashboard from "./page/manager/ManagerDashboard";
import CateringListsHeadCook from "./page/headCook/CateringListsHeadCook";
import StationaryOrdersSupervisor from "./page/supervisor/StationaryOrdersSupervisor";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*user side */}
          <Route path="/" element={<Home />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/sideBar" element={<VoyagerSidebar />} />
          <Route path="/moviesList" element={<MoviesListUser />} />
          <Route path="/cateringOrderPage" element={<CateringOrderPage />} />
          <Route path="/stationaryOrderPage" element={<StationaryOrderPage />} />
          <Route path="/resortBookingPage" element={<ResortBookingPage />} />
          <Route path="/fitnessBookingPage" element={<FitnessBookingPage />} />
          <Route path="/partyHallBookingPage" element={<PartyHallBookingPage />} />


          {/*admin side */}
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/admin-cateringList" element={<CateringListAdmin />} />
          <Route path="/admin-moviesList" element={<MoviesList />} />
          <Route path="/admin-fitnessList" element={<FitnessCenterListAdmin />} />
          <Route path="/admin-partyHall" element={<PartyHallList />} />
          <Route path="/admin-resortList" element={<ResortList />} />
          <Route path="/admin-stationaryList" element={<StationaryList />} />


          {/*manager side */}

          <Route path="/manager-Login" element={<ManagerLoginPage/>}/>
          <Route path="/manager-dashboard" element={<ManagerDashboard/>}/>

          {/*head cook side */}

          <Route path="/headCook-Login" element={<HeadCookLoginPage/>}/>
          <Route path="/headCook-CateringLists" element={<CateringListsHeadCook/>}/>

          {/* supervisor side */}

          <Route path="/supervisor-Login" element={<SupervisorLoginPage/>}/>
          <Route path="/supervisor-StationaryLists" element={<StationaryOrdersSupervisor/>}/>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
