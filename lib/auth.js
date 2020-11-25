import React, { createContext, useEffect, useState } from 'react'

const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  setIsAuthenticated: () => {}
})

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const response = await fetch('/api/checkAuth')
      setAuthenticated(response.status === 200)
      setLoading(false)
    }
    initializeAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        setAuthenticated
      }}>
      { children }
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const useIsAuthenticated = () => {
  const context = useAuth()
  return context.isAuthenticated
}
