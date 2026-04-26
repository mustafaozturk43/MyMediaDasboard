import { Route, Routes } from 'react-router-dom'

import { AppProvider } from './app/AppProvider'
import { KioskScreen } from './screens/KioskScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import './App.css'

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<KioskScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </AppProvider>
  )
}

export default App
