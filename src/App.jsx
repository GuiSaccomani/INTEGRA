import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import ServiceListPage from './pages/ServiceListPage.jsx'
import LogsPage from './pages/LogsPage.jsx'
import CreateLogPage from './pages/CreateLogPage.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ServiceListPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/create-log" element={<CreateLogPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}