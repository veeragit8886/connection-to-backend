import React from 'react'
import RegisterLogin from './Components/RegisterLogin'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import ProductDetail from './Components/ProductDetail'
<<<<<<< HEAD
import Products from './Components/Products'
import Categories from './Components/Categories'
=======
>>>>>>> 2625ab5b886ab2504087600db3faff1f95a38f0d

const App = () => {
  return (
   <>
   <div >
    {/* <RegisterLogin/> */}
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<RegisterLogin/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
<<<<<<< HEAD
      <Route path='/products' element={<Products/>}/>
       <Route path="/product/:id" element={<ProductDetail />} />
       <Route path='/categories/all' element={<Categories/>}/>
=======
       <Route path="/product/:id" element={<ProductDetail />} />
>>>>>>> 2625ab5b886ab2504087600db3faff1f95a38f0d
    </Routes>
    </BrowserRouter>
   </div>
   </>
  )
}

export default App