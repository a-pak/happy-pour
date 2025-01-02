import './App.css'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'

import AppBarComponent from './components/AppBarComponent'
import MapsComponent from './components/MapsComponent'
import { LogInPage } from './pages/LogInPage'
import BarListPage from './pages/BarListPage'

function App() {

  return (
    <>
      <AppBarComponent />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MapsComponent />}/>
          <Route path="/bars" element={<BarListPage />} />
          <Route path="/login" element={<LogInPage />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
