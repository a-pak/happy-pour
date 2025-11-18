import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import LayoutComponent from './components/LayoutComponent'
import { LogInPage } from './pages/LogInPage'
import RegisterPage from './pages/RegisterPage'
import BarListPage from './pages/BarListPage'
import BarDetailsPage from './pages/BarDetailsPage'
import LandingPage from './pages/LandingPage'
import ProtectedRoutes from './components/ProtectedRoutes'
import PriceSubmitPage from './pages/PriceSubmitPage.tsx'
import { BarSubmitPage } from './pages/BarSubmitPage.tsx'
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
import DrinkPage from './pages/DrinkPage.tsx'
import HappyHourSubmitPage from './pages/HappyHourSubmitPage.tsx'
import { useDrinkStore } from './store/drinkStore.ts'


function App() {
  const defaultDrink = useDrinkStore((state) => state.defaultDrink);
  return (
    <>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fi">
            <BrowserRouter>
              <Routes>
                <Route element={<LayoutComponent />}>
                  <Route path='' element={<LandingPage />}>
                    <Route path="/bars" element={<BarListPage key={defaultDrink} />} />
                    <Route path="bars/:id" element={<BarDetailsDrawer />} />
                  </Route>
                  <Route path="*" element={<NotFoundPage />} />

                  
                  <Route path="/bars/:id/details" element={<BarDetailsPage />} />

                  <Route path="/login" element={<LogInPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/about" element={<AboutUsPage />} />
                  <Route path='/profile' element={<ProfilePage />} />

                  <Route element={<ProtectedRoutes />}>
                    <Route path='/bars/create' element={<BarSubmitPage />} />
                    <Route path='/bars/:barId/update' element={<BarSubmitPage />} />
                    <Route path='/bars/:id/delete' element={<DeletePage />} />
                    <Route path='/drinks/update' element={<DrinkPage/>}/>
                    <Route path='/bars/delete' element={<DeletePage />} />
                    <Route path='bars/:barId/happy-hours/create' element={<HappyHourSubmitPage />} />
                    <Route path='bars/:barId/happy-hours/update/:hhId' element={<HappyHourSubmitPage />} />
                    <Route path='/bars/:barId/prices/update' element={<PriceSubmitPage />} />

                    <Route path='/bars/:barId/prices/update/:priceDrinkId' element={<PriceSubmitPage />} />
                    {//<Route path='/bars/:barId/happy-hours/:hhId/prices/update/:priceDinkId' element={<PriceSubmitPage />} />
}
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
