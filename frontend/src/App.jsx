import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'
import SignUp from './page/signUp'
import Home from './page/Home'
import AdminLoginPage from './page/admin/AdminLoginPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signUp' element={<SignUp/>}/>
      <Route path='/admin-login' element={<AdminLoginPage/>}/>
    </Routes>
    
    </BrowserRouter>
     
    </>
  )
}

export default App
