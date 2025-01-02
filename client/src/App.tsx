import './App.css'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'

import AppBarComponent from './components/AppBarComponent'
import MapsComponent from './components/MapsComponent'
import LayoutComponent from './components/LayoutComponent'
import { LogInPage } from './pages/LogInPage'
import BarListPage from './pages/BarListPage'
import LandingPage from './pages/LandingPage'
import ProtectedRoutes from './components/ProtectedRoutes'
import SubmitPage from './pages/SubmitPage'

function App() {

  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutComponent />}>
            <Route index element={<LandingPage />} />
            <Route path="/bars" element={<BarListPage />} />
            <Route path="/login" element={<LogInPage />} />
            
            <Route element={<ProtectedRoutes />}>
              <Route path='submit' element={<SubmitPage />} />
            
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
