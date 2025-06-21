import React from 'react'
import RegisterLogin from './Components/RegisterLogin'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import ProductDetail from './Components/ProductDetail'
import Products from './Components/Products'
import Categories from './Components/Categories'

const App = () => {
  return (
   <>
   <div >
    {/* <RegisterLogin/> */}
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<RegisterLogin/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/products' element={<Products/>}/>
       <Route path="/product/:id" element={<ProductDetail />} />
       <Route path='/categories/all' element={<Categories/>}/>
    </Routes>
    </BrowserRouter>
   </div>
   </>
  )
}

export default App