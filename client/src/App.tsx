import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import LayoutComponent from './components/LayoutComponent'
import { LogInPage } from './pages/LogInPage'
import BarListPage from './pages/BarListPage'
import LandingPage from './pages/LandingPage'
import ProtectedRoutes from './components/ProtectedRoutes'
import SubmitPage from './pages/SubmitPage'
import { AddPage } from './pages/AddPage'
import { UpdatePricePage } from './pages/UpdatePricePage'
import { ThemeProvider } from '@emotion/react'
import theme from './Theme'

function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LayoutComponent />}>
              <Route index element={<LandingPage />} />
              <Route path="/bars" element={<BarListPage />} />
              <Route path="/login" element={<LogInPage />} />
              <Route path='/submit' element={<SubmitPage />} />
              <Route path='/add' element={<AddPage />}/>
              <Route path='/update' element={<UpdatePricePage />} />
              <Route element={<ProtectedRoutes />}>
                <Route path='/submit' element={<SubmitPage />} />
              
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
