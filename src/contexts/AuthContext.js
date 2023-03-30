import { createContext, useContext, useState } from 'react'
import { isLoggedIn } from '@/utils/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loginStatus, setLoginStatus] = useState(() => isLoggedIn());

  // Access login status in different modes
  const accessLoginStatus = (mode, newStatus) => {
    // Get current status
    if (mode === 'get') {
      return loginStatus;
    }
    // Update and return status
    else if (mode === 'update') {
      const status = isLoggedIn();
      setLoginStatus(status);
      return status;
    }
    // Manually set status
    else if (mode === 'set') {
      setLoginStatus(newStatus);
      return newStatus;
    }
    else null;
  }

  return (
    <AuthContext.Provider value={{ accessLoginStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}