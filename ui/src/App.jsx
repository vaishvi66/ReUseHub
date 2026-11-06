import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ItemDetailPage from './pages/public/ItemDetailPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'

import MyListingsPage from './pages/student/MyListingsPage'
import CreateListingPage from './pages/student/CreateListingPage'


export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/item/:id" element={<ItemDetailPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/my-listings" element={<MyListingsPage />} />
            <Route path="/create-listing" element={<CreateListingPage />} />
          </Route>

        </Routes>
      </div>

      <Footer />
    </div>
  )
}
