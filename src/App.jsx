import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import InvoiceApp from './InvoiceApp'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<InvoiceApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
