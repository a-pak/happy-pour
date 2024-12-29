import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import AppBarComponent from './components/AppBarComponent'
import MapsComponent from './components/MapsComponent'

function App() {

  return (
    <>
      <AppBarComponent />
      <MapsComponent />
    </>
  )
}

export default App
