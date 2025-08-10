import React, { useState, useEffect } from 'react'
import { useDispatch } from "react-redux"
import './App.css'
import authService from "./appwrite/auth"
import { login, logout } from "./store/authSlice"
import { Header, Footer } from './components'
import { Outlet } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext.jsx'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    console.log("🚀 App: Starting authentication restoration...")

    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          console.log("✅ App: User authenticated, restoring session:", { id: userData.$id, name: userData.name })
          dispatch(login({userData}))
        } else {
          console.log("❌ App: No authenticated user found")
          dispatch(logout())
        }
      })
      .catch((error) => {
        console.error("❌ App: Error during auth restoration:", error)
        dispatch(logout())
      })
      .finally(() => {
        console.log("🏁 App: Authentication restoration complete")
        setLoading(false)
      })
  }, [dispatch])
  
  return !loading ? (
    <ToastProvider>
      <div className='min-h-screen flex flex-col bg-gray-100'>
        <Header />
        <main className='flex-1 w-full'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  ) : (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2'></div>
        <p className='text-gray-600'>Loading...</p>
      </div>
    </div>
  )
 
  
}

export default App
