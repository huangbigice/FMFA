// import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
// import axios from 'axios';

// interface User {
//   id: number;
//   email: string;
//   name: string;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string, name: string) => Promise<void>;
//   logout: () => void;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const API_BASE_URL = '/api';

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // 檢查 localStorage 中是否有 token
//     const storedToken = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');

//     if (storedToken && storedUser) {
//       setToken(storedToken);
//       setUser(JSON.parse(storedUser));
      
//       // 驗證 token 是否仍然有效
//       verifyToken(storedToken);
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const verifyToken = async (token: string) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/user`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       // 處理不同的API響應格式
//       const userData = response.data.user || response.data;
//       setUser(userData);
//     } catch (error) {
//       console.error('Token驗證失敗:', error);
//       // Token 無效，清除本地儲存
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       setToken(null);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email: string, password: string) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/login`, {
//         email,
//         password
//       });

//       // 處理不同的API響應格式
//       const responseData = response.data;
//       const newToken = responseData.access_token || responseData.token;
//       const userData = responseData.user;
      
//       if (!newToken || !userData) {
//         throw new Error('API響應格式錯誤');
//       }
      
//       localStorage.setItem('token', newToken);
//       localStorage.setItem('user', JSON.stringify(userData));
      
//       setToken(newToken);
//       setUser(userData);
//     } catch (error: any) {
//       console.error('登入錯誤:', error);
//       throw new Error(error.response?.data?.detail || error.response?.data?.message || '登入失敗');
//     }
//   };

//   const register = async (email: string, password: string, name: string) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/register`, {
//         email,
//         password,
//         name
//       });

//       // 處理不同的API響應格式
//       const responseData = response.data;
//       const newToken = responseData.access_token || responseData.token;
//       const userData = responseData.user;
      
//       if (!newToken || !userData) {
//         throw new Error('API響應格式錯誤');
//       }
      
//       localStorage.setItem('token', newToken);
//       localStorage.setItem('user', JSON.stringify(userData));
      
//       setToken(newToken);
//       setUser(userData);
//     } catch (error: any) {
//       console.error('註冊錯誤:', error);
//       throw new Error(error.response?.data?.detail || error.response?.data?.message || '註冊失敗');
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setToken(null);
//     setUser(null);
//   };

//   const value = {
//     user,
//     token,
//     login,
//     register,
//     logout,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
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
