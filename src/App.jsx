import React from 'react'
import RegisterLogin from './Components/RegisterLogin'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import ProductDetail from './Components/ProductDetail'

const App = () => {
  return (
   <>
   <div >
    {/* <RegisterLogin/> */}
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<RegisterLogin/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
       <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
    </BrowserRouter>
   </div>
   </>
  )
}

export default App