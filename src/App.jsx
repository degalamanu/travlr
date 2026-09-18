import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AuthModal from './components/layout/AuthModal'
import Toast from './components/layout/Toast'
import CookieBar from './components/layout/CookieBar'

import Flights from './pages/Flights'
import FlightResults from './pages/FlightResults'
import FlightDetail from './pages/FlightDetail'
import Stays from './pages/Stays'
import StayResults from './pages/StayResults'
import StayDetail from './pages/StayDetail'
import Cars from './pages/Cars'
import CarResults from './pages/CarResults'
import CarDetail from './pages/CarDetail'
import Explore from './pages/Explore'
import DestinationDetail from './pages/DestinationDetail'
import AiSearch from './pages/AiSearch'
import RoadTrip from './pages/RoadTrip'
import Trips from './pages/Trips'
import Help from './pages/Help'
import HelpTopic from './pages/HelpTopic'
import About from './pages/About'
import Partners from './pages/Partners'
import Legal from './pages/Legal'
import International from './pages/International'
import Sitemap from './pages/Sitemap'
import Redirecting from './pages/Redirecting'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname, search])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/flights" replace />} />

          <Route path="/flights" element={<Flights />} />
          <Route path="/flights/results" element={<FlightResults />} />
          <Route path="/flights/offer/:id" element={<FlightDetail />} />

          <Route path="/stays" element={<Stays />} />
          <Route path="/stays/results" element={<StayResults />} />
          <Route path="/stays/hotel/:id" element={<StayDetail />} />

          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/results" element={<CarResults />} />
          <Route path="/cars/car/:id" element={<CarDetail />} />

          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/:id" element={<DestinationDetail />} />
          <Route path="/ai" element={<AiSearch />} />
          <Route path="/road-trip" element={<RoadTrip />} />
          <Route path="/trips" element={<Trips />} />

          <Route path="/help" element={<Help />} />
          <Route path="/help/:topic" element={<HelpTopic />} />
          <Route path="/about" element={<About />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/legal/:doc" element={<Legal />} />
          <Route path="/international" element={<International />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/go" element={<Redirecting />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <AuthModal />
      <Toast />
      <CookieBar />
    </div>
  )
}
