import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import LayoutComponent from './components/LayoutComponent'
import { LogInPage } from './pages/LogInPage'
import RegisterPage from './pages/RegisterPage'
import BarListPage from './pages/BarListPage'
import BarDetailsPage from './pages/BarDetailsPage'
import LandingPage from './pages/LandingPage'
import ProtectedRoutes from './components/ProtectedRoutes'
import UpdatePage from './pages/UpdatePage.tsx'
import { AddPage } from './pages/AddPage'
import { ThemeProvider } from '@emotion/react'
import { ContactPage } from './pages/ContactPage'
import theme from './Theme'
import { AboutUsPage } from './pages/AboutUsPage'
import { ProfilePage } from "./pages/ProfilePage.tsx";
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DeletePage from './pages/DeletePage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import BarDetailsDrawer from './components/BarDetailsDrawer.tsx'

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fi">
            <BrowserRouter>
              <Routes>
                <Route element={<LayoutComponent />}>
                  <Route path='' element={<LandingPage />}>
                    <Route path="bar/:id" element={<BarDetailsDrawer />} />
                  </Route>
                  <Route path="*" element={<NotFoundPage />} />

                  <Route path="/bars" element={<BarListPage />} />
                  <Route path="/bar/details/:id" element={<BarDetailsPage />} />

                  <Route path="/login" element={<LogInPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/about" element={<AboutUsPage />} />
                  <Route path='/profile' element={<ProfilePage />} />

                  <Route element={<ProtectedRoutes />}>
                    <Route path='/update/:id' element={<UpdatePage />} />
                    <Route path='/delete/:id' element={<DeletePage />} />
                    <Route path='/submit/' element={<AddPage />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  )
}

export default App
