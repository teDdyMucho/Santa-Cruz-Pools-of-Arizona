import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Studio from './pages/Studio'
import Services from './pages/Services'
import Work from './pages/Work'
import Process from './pages/Process'
import Contact from './pages/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="studio" element={<Studio />} />
          <Route path="services" element={<Services />} />
          <Route path="work" element={<Work />} />
          <Route path="process" element={<Process />} />
          <Route path="contact" element={<Contact />} />
          {/* Anything unrecognised falls back to the homepage rather than a
              dead end. Replace with a real 404 page when the site grows. */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
