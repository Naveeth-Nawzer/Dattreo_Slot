// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const BACKEND_URL = 'http://localhost:5001/UserOperation';

// const AuthContext = createContext({
//   token: null,
//   user: null,
//   login: () => {},
//   logout: () => {},
//   isInitialized: false
// });

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [user, setUser] = useState(null);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         if (token) {
//           axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//           await fetchUserData();
//         }
//       } catch (error) {
//         console.error('Auth initialization error:', error);
//         localStorage.removeItem('token');
//         setToken(null);
//         setUser(null);
//       } finally {
//         setIsInitialized(true);
//       }
//     };

//     initializeAuth();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const response = await axios.get(`${BACKEND_URL}/me`);
//       setUser(response.data.user);
//       return true;
//     } catch (error) {
//       console.error('Failed to fetch user data:', error);
//       logout();
//       return false;
//     }
//   };

//   const login = async (credentials) => {
//     try {
//       const response = await axios.post(`${BACKEND_URL}/login`, credentials);
//       const { token, user } = response.data;
//       localStorage.setItem('token', token);
//       setToken(token);
//       setUser(user);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       return true;
//     } catch (error) {
//       console.error('Login failed:', error);
//       return false;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//     delete axios.defaults.headers.common['Authorization'];
//     navigate('/SignIn');
//   };

//   const value = {
//     token,
//     user,
//     login,
//     logout,
//     isInitialized
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {isInitialized ? children : <div>Loading authentication...</div>}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:5001/UserOperation';

const AuthContext = createContext({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  isInitialized: false,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('userData');

      try {
        if (storedToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // If we have user data in localStorage, use it temporarily
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }

          // Verify token with backend and get fresh user data
          const isValid = await validateToken(storedToken);
          if (!isValid) {
            throw new Error('Invalid token');
          }

          setToken(storedToken);
          await fetchUserData();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/validate-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.isValid;
    } catch (error) {
      return false;
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/me`);
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
      return false;
    }
  };

const login = async (credentials, isAdmin = false) => {
  try {
    if (isAdmin) {
      // For admin login, we don't need to call the API
      const adminUser = {
        nic: credentials.nic,
        role: 'admin',
        isAdmin: true
      };
      
      localStorage.setItem('userData', JSON.stringify(adminUser));
      localStorage.setItem('token', 'admin-token');
      setUser(adminUser);
      setToken('admin-token');
      return true;
    }

    // Regular user login
    const response = await axios.post(`${BACKEND_URL}/login`, credentials);
    const { token: authToken, user: userData } = response.data;
    
    localStorage.setItem('token', authToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

const verifyAdmin = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return userData?.isAdmin === true;
};

  const logout = () => {
    // Clear storage and state
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/SignIn');
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
    isInitialized,
  };

  return (
    <AuthContext.Provider value={value}>
      {isInitialized ? children : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-teal-600">Loading authentication...</div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};