import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'
import SignUp from './page/voyager/signUp'
import Home from './page/voyager/Home'
import AdminLoginPage from './page/admin/AdminLoginPage'
import Sidebar from './page/admin/sidebar'
import CateringListAdmin from './page/admin/CateringListAdmin'
import FitnessCenterListAdmin from './page/admin/FitnessCenterListAdmin'
import MoviesList from './page/admin/MoviesList'
import PartyHallList from './page/admin/PartyHallList'
import ResortList from './page/admin/ResortList'
import StationaryList from './page/admin/StationaryList'
import MoviesListUser from './page/voyager/moviesListVoyager'
import CateringOrderPage from './page/voyager/cateringOrderPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
       {/*user side */}
      <Route path='/' element={<Home/>}/>
      <Route path='/signUp' element={<SignUp/>}/>
      <Route path='/moviesList' element={<MoviesListUser/>}/>
      <Route path='/cateringOrderPage' element={<CateringOrderPage/>}/>
      

      {/*admin side */}
      <Route path='/admin-login' element={<AdminLoginPage/>}/>
      <Route path='/sidebar' element={<Sidebar/>}/>
      <Route path='/admin-cateringList' element={<CateringListAdmin/>}/>
      <Route path='/admin-moviesList' element={<MoviesList/>}/>
      <Route path='/admin-fitnessList' element={<FitnessCenterListAdmin/>}/>
      <Route path='/admin-partyHall' element={<PartyHallList/>}/>
      <Route path='/admin-resortList' element={<ResortList/>}/>
      <Route path='/admin-stationaryList' element={<StationaryList/>}/>
    </Routes>
    
    </BrowserRouter>
     
    </>
  )
}

export default App
