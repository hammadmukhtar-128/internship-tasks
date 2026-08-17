import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService, orgService } from '../services';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [organization, setOrganization] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authService.me();
      const meUser = data.data;
      setUser(meUser);
      localStorage.setItem('user', JSON.stringify(meUser));

      const orgsRes = await orgService.list();
      setOrganizations(orgsRes.data.data);
      const current =
        orgsRes.data.data.find((o) => o._id === (meUser.currentOrganization?._id || meUser.currentOrganization)) ||
        orgsRes.data.data[0];
      setOrganization(current || null);
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = async (email, password) => {
    const { data } = await authService.login({ email, password });
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    await loadSession();
    return data;
  };

  const register = async (payload) => {
    const { data } = await authService.register(payload);
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    setOrganization(data.data.organization);
    setOrganizations([data.data.organization]);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setOrganization(null);
    setOrganizations([]);
  };

  const switchOrganization = async (orgId) => {
    await authService.switchOrganization(orgId);
    const org = organizations.find((o) => o._id === orgId);
    setOrganization(org);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        organization,
        organizations,
        setOrganizations,
        switchOrganization,
        loading,
        login,
        register,
        logout,
        refresh: loadSession,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
