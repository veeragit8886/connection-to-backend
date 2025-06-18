import React from 'react'
import RegisterLogin from './Components/RegisterLogin'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './Components/Dashboard'

const App = () => {
  return (
   <>
   <div >
    {/* <RegisterLogin/> */}
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<RegisterLogin/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
    </Routes>
    </BrowserRouter>
   </div>
   </>
  )
}

export default App