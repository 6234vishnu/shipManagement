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

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signUp' element={<SignUp/>}/>

      {/*admin side */}
      <Route path='/admin-login' element={<AdminLoginPage/>}/>
      <Route path='/sidebar' element={<Sidebar/>}/>
      <Route path='/admin-categoryList' element={<CateringListAdmin/>}/>
      <Route path='/admin-fitnessList' element={<FitnessCenterListAdmin/>}/>
      <Route path='/admin-movies' element={<MoviesList/>}/>
      <Route path='/admin-partyHall' element={<PartyHallList/>}/>
    </Routes>
    
    </BrowserRouter>
     
    </>
  )
}

export default App
