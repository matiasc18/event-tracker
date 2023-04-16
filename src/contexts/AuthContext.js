import { createContext, useContext, useState } from 'react'
import { isLoggedIn } from '@/utils/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const initialStatus = isLoggedIn();
  const [loginStatus, setLoginStatus] = useState(initialStatus);

  const updateLoginStatus = (newStatus) => {
    setLoginStatus(newStatus);
  }

  return (
    <AuthContext.Provider value={{ loginStatus, updateLoginStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}