import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on startup
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/users/profile');
        setUser(res.data);
      } catch (err) {
        console.error('Failed to load user profile:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login User
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      
      // Load full profile (with bookmarks/downloads) after login
      const profileRes = await api.get('/users/profile');
      setUser(profileRes.data);
      return profileRes.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Register User
  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      
      // Load full profile
      const profileRes = await api.get('/users/profile');
      setUser(profileRes.data);
      return profileRes.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try a different email.';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Update Profile
  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const res = await api.put('/users/profile', profileData);
      setUser(res.data);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Toggle Bookmark
  const toggleBookmark = async (noteId) => {
    try {
      const res = await api.post(`/notes/${noteId}/bookmark`);
      // Update local user bookmarks list
      setUser((prevUser) => {
        if (!prevUser) return null;
        
        const isBookmarked = prevUser.bookmarks.some((b) => b._id === noteId || b === noteId);
        let updatedBookmarks;
        
        if (isBookmarked) {
          updatedBookmarks = prevUser.bookmarks.filter((b) => (b._id || b) !== noteId);
        } else {
          updatedBookmarks = [...prevUser.bookmarks, noteId];
        }
        
        return {
          ...prevUser,
          bookmarks: updatedBookmarks
        };
      });
      return res.data.isBookmarked;
    } catch (err) {
      console.error('Error bookmarking note:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        toggleBookmark,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
