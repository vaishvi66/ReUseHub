import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import BrowsePage from './pages/public/BrowsePage'
import ItemDetailPage from './pages/public/ItemDetailPage'
import HowItWorksPage from './pages/public/HowItWorksPage'
import SustainabilityPage from './pages/public/SustainabilityPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'

import StudentDashboardPage from './pages/student/DashboardPage'
import MyListingsPage from './pages/student/MyListingsPage'
import CreateListingPage from './pages/student/CreateListingPage'
import EditListingPage from './pages/student/EditListingPage'
import MyRequestsPage from './pages/student/MyRequestsPage'
import HistoryPage from './pages/student/HistoryPage'
import ProfilePage from './pages/student/ProfilePage'


export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<BrowsePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/item/:id" element={<ItemDetailPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/dashboard" element={<StudentDashboardPage />} />
            <Route path="/my-listings" element={<MyListingsPage />} />
            <Route path="/create-listing" element={<CreateListingPage />} />
            <Route path="/edit-listing/:id" element={<EditListingPage />} />
            <Route path="/my-requests" element={<MyRequestsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}
