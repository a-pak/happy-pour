import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import LayoutComponent from './components/LayoutComponent'
import { LogInPage } from './pages/LogInPage'
import RegisterPage from './pages/RegisterPage'
import BarListPage from './pages/BarListPage'
import LandingPage from './pages/LandingPage'
import ProtectedRoutes from './components/ProtectedRoutes'
import UpdatePage from './pages/UpdatePage.tsx'
import { AddPage } from './pages/AddPage'
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
              <Route path="/register" element={<RegisterPage />} />
              <Route path='/add' element={<AddPage />}/>
              <Route element={<ProtectedRoutes />}>
                <Route path='/update/:barId' element={<UpdatePage />} />
                <Route path='/submit/' element={<AddPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
